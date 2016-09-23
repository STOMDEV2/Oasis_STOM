package fr.stcg.oasis.servlets.grid;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.essbase.api.base.EssException;
import com.essbase.api.dataquery.IEssCubeView;
import com.essbase.api.dataquery.IEssGridView;
import com.essbase.api.dataquery.IEssOpUpdate;
import com.essbase.api.datasource.IEssCube;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.Comment;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.beans.ScenarioParameter;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.essbase.Essbase;

@WebServlet("/workspace/grid/updateGridValues")
public class UpdateGridValuesServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

    public UpdateGridValuesServlet() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		
		String dataStringJSON = request.getParameter("data");
		String rowContextJSON = request.getParameter("rowContext");
		String columnContextJSON = request.getParameter("columnContext");
		String headerContextJSON = request.getParameter("headerContext");
		String gridIdString = request.getParameter("id");
		String comment = request.getParameter("gridComment");
		
		
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements())
		{
			String paramName = parameterNames.nextElement();

			String[] paramValues = request.getParameterValues(paramName);
			for (int i = 0; i < paramValues.length; i++)
			{
				String paramValue = paramValues[i];
				System.out.println(paramName + " " + paramValue);
			}
		}
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		
		
		
		JsonArray dataJSON = (JsonArray)parser.parse(dataStringJSON);
		JsonArray rowContextsJSON = (JsonArray)parser.parse(rowContextJSON);
		JsonArray columnContextsJSON = (JsonArray)parser.parse(columnContextJSON);
		JsonArray headerContextsJSON = (JsonArray)parser.parse(headerContextJSON);
		
				
		try
		{
			Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdString));

			ArrayList<RowContext> rowContexts = new ArrayList<RowContext>();
			ArrayList<ColumnContext> columnContexts = new ArrayList<ColumnContext>();
			ArrayList<HeaderDimension> headerContexts = new ArrayList<HeaderDimension>();
			
			for(JsonElement element : rowContextsJSON)
			{
				String idElement = element.getAsString();
				
				RowContext context = DaoFactory.getRowContextDao().findById(Integer.parseInt(idElement));
				
				rowContexts.add(context);
			}
			
			int elementIndex = 0;
			for(JsonElement element : columnContextsJSON)
			{
				String idElement = element.getAsString();
				
				ColumnContext context = DaoFactory.getColumnContextDao().findById(Integer.parseInt(idElement));
				
				if(context.getType().getValue().equals("Capture") || context.getType().getValue().equals("Comment"))
					columnContexts.add(context);
				else
				{
					for(JsonElement elem : dataJSON)
					{
						JsonArray arr = (JsonArray)elem;
						
						arr.remove(elementIndex);
					}
					
					elementIndex--;
				}
				
				elementIndex++;
			}
			
			for(JsonElement element : headerContextsJSON)
			{
				String idElement = element.getAsString();
				
				HeaderDimension context = DaoFactory.getHeaderDimensionDao().findById(Integer.parseInt(idElement));
				
				headerContexts.add(context);
			}
			
			
			
			
			
			
			for(RowContext context: rowContexts)
			{
				ArrayList<RowDimension> dimensions = new ArrayList<RowDimension>();
				
				for(RowDimension dimension: context.getRowDimensions())
				{
					if(dimension.getType().equals("Capture"))
						dimensions.add(dimension);
				}
				
				context.setRowDimensions(dimensions);
			}
			
			
			
			ArrayList<ColumnContext> columnContextsToBeRemoved = new ArrayList<ColumnContext>();
			for(ColumnContext context: columnContexts)
			{
				if(!context.getType().getValue().equals("Comment"))
					continue;
				
				int contextIndex = columnContexts.indexOf(context);
				
				for(int i = 0; i < dataJSON.size(); i++)
				{
					RowContext rowContext = rowContexts.get(i);
					
					JsonArray array = dataJSON.get(i).getAsJsonArray();
					
					String value = array.get(contextIndex).getAsString();
					
					Comment elementComment = DaoFactory.getCommentDao().findCommentByColumnAndRowAndGrid(context, rowContext, grid);
					
					if(elementComment == null)
					{
						elementComment = new Comment();
							elementComment.setColumnContext(context);
							elementComment.setRowContext(rowContext);
							elementComment.setGrid(grid);
							elementComment.setComment(value);
						elementComment = DaoFactory.getCommentDao().add(elementComment);							
					}
					else
					{
						elementComment.setComment(value);
						DaoFactory.getCommentDao().update(elementComment);
					}
				}
				
				columnContextsToBeRemoved.add(context);
			}
			for(ColumnContext context : columnContextsToBeRemoved)
				columnContexts.remove(context);
			
			int		nbOfChildrenCol = columnContexts.get(0).getColumnsDimensions().size(),
					nbOfChildrenRow = rowContexts.get(0).getRowDimensions().size(),
					nbCols = nbOfChildrenRow + columnContexts.size(),
					nbRows = nbOfChildrenCol + rowContexts.size();
			
			System.out.println("nbOfChildrenCol " + nbOfChildrenCol + " nbOfChildrenRow " + nbOfChildrenRow );
			HashMap<String, String> form = (HashMap<String, String>) request.getSession().getAttribute("form");
			String select = (String) request.getSession().getAttribute("applicationCube");
			String[] applicationCube = select.split("\\.");
			
			Essbase essbase = new Essbase(form);
			
			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationCube[0], applicationCube[1]);
			IEssCubeView cubeView = cube.openCubeView("default");
			
			
			
			
			// Mettre à jour options (necessaire)
			cubeView.updatePropertyValues();
			// Grille à partir du cubeView
			IEssGridView gridView = cubeView.getGridView();
			gridView.setSize(nbRows, nbCols);
			
			/*	SETTINGS LINES	*/
			for(int i = nbOfChildrenCol; i < nbRows; i++)
			{
				RowContext context = rowContexts.get(i - nbOfChildrenCol);
				
				for(int j = 0; j < context.getRowDimensions().size(); j++)
				{
					ArrayList<RowDimension> dimensions = new ArrayList<RowDimension>(context.getRowDimensions());
					RowDimension dimension = dimensions.get(j);
					
					String value = dimension.getGridElement().getValue();
					
					if(value.indexOf("%") == 0)
					{
						boolean isRetrieve = (dimension.getType().equals("Retrieve") ? true : false);
						ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByVariableAndGrid(value, grid, isRetrieve);
						
						value = parameter.getValue();
					}
					
					gridView.setValue(i, j, value);
				}
			}
			/*	SETTINGS COLUMNS	*/
			for(int i = nbOfChildrenRow; i < nbCols; i++)
			{
				ColumnContext context = columnContexts.get(i - nbOfChildrenRow);
				
				for(int j = 0; j < context.getColumnsDimensions().size(); j++)
				{
					ArrayList<ColumnDimension> dimensions = new ArrayList<ColumnDimension>(context.getColumnsDimensions());
					ColumnDimension dimension = dimensions.get(j);
					
					String value = dimension.getGridElement().getValue();
					if(value.indexOf("%") == 0)
					{
						boolean isRetrieve = (context.getType().equals("Retrieve") ? true : false);
						ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByVariableAndGrid(value, grid, isRetrieve);
						
						value = parameter.getValue();
					}
					
					gridView.setValue(j, i, value);
				}
			}
			
			cubeView.performOperation(cubeView.createIEssOpRetrieve()); // Retrieve
			System.out.println("the gridView");
			
			displayGrid(gridView);
			
			/*	SETTINGS DATA	*/
			for(int i = nbOfChildrenCol; i < nbRows; i++)
			{
				for(int j = nbOfChildrenRow; j < nbCols; j++)
				{
					String value = dataJSON.get(i - nbOfChildrenCol).getAsJsonArray().get(j - nbOfChildrenRow).getAsString();
					
//					System.out.println(value);
					
					gridView.setValue(i, j, Double.parseDouble(value));
				}
			}
			
			System.out.println("the data gridView");
			displayGrid(gridView);
//			for (int i = 0, cpt = nbRows; i < cpt; i += 1)
//			{
//				for (int j = 0, jCpt = nbCols; j < jCpt; j += 1)
//				{
//					System.out.print(gridView.getValue(i, j) + "\t");
//				}
//				
//				System.out.println();
//			}

	        IEssOpUpdate opUpd = cubeView.createIEssOpUpdate();
	        cubeView.performOperation(opUpd);                    // Update

	        cubeView.performOperation(cubeView.createIEssOpRetrieve()); // Retrieve again.
	        
	        
	        displayGrid(gridView);
	        
//			IEssOperation essOp = cubeView.createIEssOpRetrieve();
//			cubeView.performOperation(essOp);

//			String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];
//
//			for (int i = nbLinesColumnContext + nbLinesHeaderContext, m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
//				for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
//					gridValues[m][n] = gridView.getStringValue(i, j);
//					System.out
//							.print(" " + gridView.getStringValue(i, j) + "\t");
//				}
//
//				System.out.print("\n");
//			}
	        
			System.out.println();

			grid.setComment(comment);

			grid.setLastModificationDate(new Date(Calendar.getInstance().getTime().getTime()));
			DaoFactory.getGridDao().update(grid);
	        
	        map.put("success", "Data succesfully saved!");
		}
		catch (EssException e)
		{
            e.printStackTrace();
            
			map.put("error", "An error occured during the save! Try again later!");
        } 
		catch (NumberFormatException e)
		{
			e.printStackTrace();
			
			map.put("error", "An error occured during the save! Try again later!");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
			map.put("error", "An error occured during the save! Try again later!");
		}
//		finally
//		{
//            // Close cube view.
//            try
//            {
//                if (cubeView != null)
//                	cubeView.close();
//            }
//            catch (EssException x)
//            {
//                System.err.println("Error: " + x.getMessage());
//            }
//
//            // Sign off from the domain.
//            try {
//                if (ess != null && ess.isSignedOn() == true)
//                    ess.signOff();
//            } catch (EssException x) {
//                System.err.println("Error: " + x.getMessage());
//            }
//        }
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		out.write(gson.toJson(map));
		out.flush();
		out.close();
	}
	
	private void displayGrid(IEssGridView grid)
	{
		try
		{
			for (int i = 0; i < grid.getCountRows(); i++)
			{
				for (int j = 0; j < grid.getCountColumns(); j++)
				{
					System.out.print(grid.getValue(i, j) + "\t");
				}
				
				System.out.println();
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}
