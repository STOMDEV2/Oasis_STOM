package fr.stcg.oasis.servlets.mask;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.json.HeaderDimensionAdapter;
import fr.stcg.oasis.objetMetier.MaskToGrid;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/mask/previewGrid")
public class PreviewGridServlet extends HttpServlet {

	
	private static final long serialVersionUID = 1L;
	
	
	
	public PreviewGridServlet()
	{
		super();
	}
	
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		PrintWriter out = response.getWriter();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
		        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
		        .serializeNulls()
		        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
		        .excludeFieldsWithoutExposeAnnotation()
		        .create();
		HttpSession session = request.getSession();
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		try
		{
			HashMap<String,String> form = (HashMap<String, String>) session.getAttribute("form");
			String select = (String) session.getAttribute("applicationCube");
			String[] applicationCube = select.split("\\.");
			String maskString = request.getParameter("mask");
			
			JsonParser parser = new JsonParser();
			JsonObject maskJSON = (JsonObject)parser.parse(maskString);
			
			String nameMask = maskJSON.get("nameMask").getAsString();
			
			int idCube = maskJSON.get("idCube").getAsInt();
			Cube cube = DaoFactory.getCubeDao().findById(idCube);
			
			JsonArray columnContextJSON = (JsonArray) maskJSON.get("columnContext").getAsJsonArray();
			JsonArray rowContextJSON = (JsonArray) maskJSON.get("rowContext").getAsJsonArray();
			JsonArray headerContextJSON = (JsonArray) maskJSON.get("headerContext").getAsJsonArray();
			
			ArrayList<ColumnContext> columnContext = new ArrayList<ColumnContext>( getColumnContextsFromJSON(columnContextJSON, cube));
			ArrayList<RowContext> rowContext = new ArrayList<RowContext>( getRowContextsFromJSON(rowContextJSON, cube));
			ArrayList<HeaderDimension> headerContext = new ArrayList<HeaderDimension>(getHeaderContextFromJSON(headerContextJSON));
			
			Mask mask = new Mask(nameMask, columnContext, rowContext, headerContext);
			map.put("mask", gson.toJson(mask));
			
			System.out.println("mask " + maskJSON);
			
			String[][] gridValues = MaskToGrid.maskToGrid(mask, form, applicationCube[0], applicationCube[1]);
			
			map.put("gridValues", gson.toJson(gridValues));
			
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
			if( e.getMessage().equals("Empty Sparameters") )
				map.put("error", "Some scenario parameters are empty. Please fill them");
			else
				map.put("error", "Error retrieving data! Try again later!");

		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
	
	
	private ArrayList<HeaderDimension> getHeaderContextFromJSON(JsonArray headerContextJSON)
	{
		ArrayList<HeaderDimension> headerContext = new ArrayList<HeaderDimension>();
		Gson gson = new GsonBuilder().registerTypeHierarchyAdapter(HeaderDimension.class, new HeaderDimensionAdapter()).create();
		
		for(JsonElement o : headerContextJSON)
		{
			HeaderDimension h = gson.fromJson(o , HeaderDimension.class);
		
			
			headerContext.add(h);
		}
		
		return headerContext; 
	}
	
	private ArrayList<ColumnContext> getColumnContextsFromJSON(JsonArray columnContextJson, Cube cube) 
	{
		
		ArrayList<ColumnContext> columnContexts = new ArrayList<ColumnContext>();
		
		
		for(int i = 0, cpt = columnContextJson.size(); i < cpt ; i++)
		{
			ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)columnContextJson.get(i));
			
			ArrayList<ColumnDimension> columnDimensions = new ArrayList<ColumnDimension>(columnContext.getColumnsDimensions());
			
			Vector<Integer> toRemove = new Vector<Integer>();
			
			int j = 0;
			
			for(ColumnDimension columnDimension : columnDimensions)
			{
				System.out.println("columnDimension " + columnDimension);
				
				if(columnContext.getType().equals("Formula") || columnContext.getType().equals("Comment"))
				{
//					columnDimensions.remove(j);
					toRemove.add(Integer.valueOf(j));
					continue;
				}
				
				
				Dimension dimension = DaoFactory.getDimensionDao().findDimensionByName(columnDimension.getDimension().getName(), cube);
				
				columnDimension.setDimension(dimension);
				columnDimension.setColumnContext(columnContext);
				
				j++;
			}
			
			for(int k=0, kCpt = toRemove.size(); k < kCpt ;k++)
				columnDimensions.remove(toRemove.get(k));
			
			columnContext.setColumnsDimensions(columnDimensions);
			columnContexts.add(columnContext);
		}
		
		return columnContexts;
	}
	
	private ArrayList<RowContext> getRowContextsFromJSON(JsonArray rowContextJson,Cube cube)
	{
		ArrayList<RowContext> rowContexts = new ArrayList<RowContext>();
		
		for(int i = 0, cpt = rowContextJson.size(); i < cpt; i++)
		{
			
			RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)rowContextJson.get(i));
			System.out.println("rowContext " + rowContext);
			
			Vector<Integer> toRemove = new Vector<Integer>();
			ArrayList<RowDimension> rowDimensions = new ArrayList<RowDimension>(rowContext.getRowDimensions());
			
			
			boolean isFormulaContext = false;
			for(RowDimension rowDimension : rowDimensions)
				if(rowDimension.getDimension().getName().equals("Formule") && !rowDimension.getGridElement().getValue().equals(""))
					isFormulaContext = true;
			
			int j = 0;
			
			for(RowDimension rowDimension : rowDimensions)
			{
				System.out.println("rowDimension " + rowDimension);
				if((rowDimension.getGridElement().getValue().equals("") && isFormulaContext)
					|| (rowDimension.getGridElement().getValue().equals("") && rowDimension.getDimension().getName().equals("Formule") && !isFormulaContext))
				{
//					rowDimensions.remove(j);
					toRemove.add(Integer.valueOf(j));
					continue;
				}
					
				
				Dimension dimension = DaoFactory.getDimensionDao().findDimensionByName(rowDimension.getDimension().getName(), cube);
				
				if(dimension == null)
				{
					dimension = new Dimension();
					dimension.setCube(cube);
					dimension.setName(rowDimension.getDimension().getName());

					
				}
				
				rowDimension.setDimension(dimension);
				rowDimension.setRowContext(rowContext);
				
				j++;
			}
			
			for(int k=0, kCpt = toRemove.size(); k < kCpt ;k++)
				rowDimensions.remove(toRemove.get(k));
			
			rowContext.setRowDimensions(rowDimensions);
			rowContexts.add(rowContext);
		}
		
		return rowContexts;
	}

}
