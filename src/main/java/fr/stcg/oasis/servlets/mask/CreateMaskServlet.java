package fr.stcg.oasis.servlets.mask;

import java.io.PrintWriter;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map.Entry;

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
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.beans.Variable;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.json.HeaderDimensionAdapter;
import fr.stcg.oasis.json.VariableAdapter;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/mask/mask")
public class CreateMaskServlet extends HttpServlet
{
	private static final long serialVersionUID = -2431131179387598008L;
	
	private static final String VUE = "/workspace/mask/mask.jsp";

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		PrintWriter out = response.getWriter();
		Gson gson = new GsonBuilder().registerTypeAdapter(Variable.class, new VariableAdapter()).create();
		HttpSession session = request.getSession();
		
		String action = request.getParameter("action");
		
		
		if(action!=null)
		{
			try
			{
				
				if( "getMaskGrids".equals(action) )
				{
					String idString = request.getParameter("id");
					HashMap<String, Object> map = new HashMap<String, Object>();
					Mask mask = null;
					
					try {
						mask = DaoFactory.getMaskDao().findById(Integer.parseInt(idString));
					} catch (NumberFormatException e) {
						e.printStackTrace();
					} catch (Exception e) {
						e.printStackTrace();
					}
					
					
					gson = new GsonBuilder().disableHtmlEscaping()
										        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
										        .serializeNulls()
										        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
										        .excludeFieldsWithoutExposeAnnotation()
										        .create();
					
					map.put("mask", gson.toJson(mask));
					map.put("grids", gson.toJson(DaoFactory.getGridDao().findGridsByMask(mask.getId())));
					
					out.write(gson.toJson(map));
					
				}
				else if("getApplication".equals(action))
				{
					HashMap<String, Object> JSONSession = new HashMap<String, Object>();
					
					JSONSession.put("appliCube", (String) session.getAttribute("applicationCube"));
					
					Cube cube = (Cube) session.getAttribute("cube");
					
					JSONSession.put("idCube", cube.getId());
					
					out.write(gson.toJson(JSONSession));
					
				}
				else if("getDimensions".equals(action)) 
				{
					ArrayList<String> dimensions = null;
					
					dimensions = (ArrayList<String>) session.getAttribute("dimensions");
					HashMap<String,Object> output = new HashMap<String, Object>();
					
					output.put("dimensions", dimensions);
					out.write(gson.toJson(output));
				}
				else if("getMembersPerDimension".equals(action))
				{
					HashMap<String,Object> output = new HashMap<String, Object>();
					output.put("membersPerDimension", (HashMap<String, ArrayList<String>>) session.getAttribute("membersPerDimension"));
					out.write(gson.toJson(output));
					System.out.println("membersPerDimension" + gson.toJson(output));
				}
				else if( "getVariablesPerDimension".equals(action) )
				{
					try
					{
						HashMap<String, ArrayList<Variable>> variablesPerDimension = DaoFactory.getVariableDao().findVariablesPerDimensionByCube((Cube) session.getAttribute("cube"));
						HashMap<String, Object> output = new HashMap<>();
						
						HashMap<String, ArrayList<String>>  variablesPerDimensionString = new HashMap<String, ArrayList<String>>();
//						HashMap<String, ArrayList<String>> variablesRetrievePerDimension = new HashMap<String, ArrayList<String>>(); 
//						HashMap<String, ArrayList<String>> variablesCapturePerDimension =  new HashMap<String, ArrayList<String>>();
						
						boolean putString = false, putRetrieve = false, putCapture = false;
						
						ArrayList<Variable> variablesDimension = new ArrayList<Variable>();
						ArrayList<String> variablesRetrieveDimension = new ArrayList<String>(), variablesCaptureDimension = new ArrayList<String>(), variablesDimensionString = new ArrayList<String>();
						
						for(Entry<String, ArrayList<Variable>> entry : variablesPerDimension.entrySet()) {
						    
							variablesDimension = entry.getValue();
						    
							variablesDimensionString.clear();
//							variablesRetrieveDimension.clear();
//						    variablesCaptureDimension.clear();
							
						    for(Variable v : variablesDimension)
						    {
						    	
//						    	variablesDimensionString.add("%" + v.getName() + "_R%");
//						    	variablesDimensionString.add("%" + v.getName() + "_S%");
//						    	variablesDimensionString.add( v.getNameRetrieve() );
//						    	variablesDimensionString.add( v.getNameCapture() );
//						    	variablesRetrieveDimension.add( v.getNameRetrieve() );
//						    	variablesCaptureDimension.add( v.getNameCapture() );
						    }
						    
//						    if( variablesRetrieveDimension.size() != 0 )
//						    {
//						    	variablesRetrievePerDimension.put(entry.getKey(), new ArrayList<String>(variablesRetrieveDimension));
//						    	putRetrieve = true;
//						    }
//						    	
//						    if( variablesCaptureDimension.size() != 0 )
//						    {
//						    	putCapture = true;
//						    	variablesCapturePerDimension.put(entry.getKey(), new ArrayList<String>(variablesCaptureDimension));
//						    }
						    	
						    if( variablesDimensionString.size() != 0)
						    {
						    	putString = true;
						    	variablesPerDimensionString.put(entry.getKey(), new ArrayList<String>(variablesDimensionString));
						    }
						    
						}
						
						output.put("variablesPerDimension", gson.toJson(variablesPerDimension));
//						output.put("variablesPerDimension", variablesPerDimensionString);
//						output.put("variablesRetrievePerDimension", variablesRetrievePerDimension);						
//						output.put("variablesCapturePerDimension", variablesCapturePerDimension);
						
						System.out.println("variables here" + gson.toJson(output));
						
						out.write(gson.toJson(output));
					}
					catch(Exception e)
					{
						e.printStackTrace();
					}
				}
			}
			catch(Exception e)
			{
				HashMap<String, String> error = new HashMap<String, String>();
				
				error.put("error", e.getMessage());
				
				out.write(gson.toJson(error));
			}
			finally
			{
				out.flush();
				out.close();
			}
		}
		else
		{
			this.getServletContext().getRequestDispatcher(VUE).forward(request, response);
		}
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		String maskStringified = request.getParameter("mask");
		
		System.out.println("maskStringified " + maskStringified);

		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements())
		{
			String paramName = parameterNames.nextElement();

			String[] paramValues = request.getParameterValues(paramName);
			for (int i = 0; i < paramValues.length; i++) {
				String paramValue = paramValues[i];
				System.out.println(paramName + " " + paramValue);
			}
		}
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new GsonBuilder().registerTypeAdapter(HeaderDimension.class, new HeaderDimensionAdapter()).create();
		
		try
		{
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");
			String[] applicationCube = ((String)session.getAttribute("applicationCube")).split("\\.");
			Cube cube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
			
			JsonParser parser = new JsonParser();
			JsonObject maskJSON = (JsonObject)parser.parse(maskStringified);

			
			
			
			
			JsonArray columnContexts = maskJSON.get("columnContext").getAsJsonArray();
			JsonArray rowContexts = maskJSON.get("rowContext").getAsJsonArray();

			/*	SAVING MASK	*/
			Mask mask = Mask.getMaskFromJSON(maskJSON.get("mask").getAsJsonObject());
			
			if(mask.getNameMask().isEmpty())
			{
				map.put("error", "Please enter a mask name");
				
				out.write(gson.toJson(map));
				out.flush();
				out.close();
				return;
			}
			
			if( !Mask.isNameAvailable( mask.getNameMask() ) )
			{
				map.put("errorMaskName", "true");
				throw new Exception("A mask with the same name already exists!");
			}
			
			mask.setAuthor(user);
			mask.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
			mask.setCube(cube);
			
			mask = DaoFactory.getMaskDao().add(mask);
			
			
			
			
			
			for(int i = 0; i < columnContexts.size(); i++)
			{
				ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)columnContexts.get(i));
				
				System.out.println("columnContext " + columnContext);
				ArrayList<ColumnDimension> columnDimensions = new ArrayList<ColumnDimension>(columnContext.getColumnsDimensions());
				
				columnContext.setMask(mask);
				columnContext.getColumnsDimensions().clear();
				
				columnContext = DaoFactory.getColumnContextDao().add(columnContext);
				
				for(ColumnDimension columnDimension : columnDimensions)
				{
					System.out.println("columnDimension " + columnDimension);
					Dimension dimension = DaoFactory.getDimensionDao().findDimensionByName(columnDimension.getDimension().getName(), cube);
					
					columnDimension.setDimension(dimension);
					columnDimension.setColumnContext(columnContext);
					DaoFactory.getColumnDimensionDao().add(columnDimension);
					
					if(columnContext.getType().equals("Formula") || columnContext.getType().equals("Comment"))
						break;
				}
			}
			
			
			
			for(int i = 0; i < rowContexts.size(); i++)
			{
				RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)rowContexts.get(i));
				System.out.println("rowContext " + rowContext);
				ArrayList<RowDimension> rowDimensions = new ArrayList<RowDimension>(rowContext.getRowDimensions());
				
				rowContext.setMask(mask);
				rowContext.getRowDimensions().clear();
				
				rowContext = DaoFactory.getRowContextDao().add(rowContext);
				
				boolean isFormulaContext = false;
				for(RowDimension rowDimension : rowDimensions)
					if(rowDimension.getDimension().getName().equals("Formule") && !rowDimension.getGridElement().getValue().equals(""))
						isFormulaContext = true;
				
				for(RowDimension rowDimension : rowDimensions)
				{
					
					System.out.println("rowDimension " + rowDimension);
					if((rowDimension.getGridElement().getValue().equals("") && isFormulaContext)
						|| (rowDimension.getGridElement().getValue().equals("") && rowDimension.getDimension().getName().equals("Formule") && !isFormulaContext))
						continue;
					
					Dimension dimension = DaoFactory.getDimensionDao().findDimensionByName(rowDimension.getDimension().getName(), cube);
					
					if(dimension == null)
					{
						dimension = new Dimension();
						dimension.setCube(cube);
						dimension.setName(rowDimension.getDimension().getName());

						dimension = DaoFactory.getDimensionDao().add(dimension);
					}
					
					rowDimension.setDimension(dimension);
					rowDimension.setRowContext(rowContext);
					DaoFactory.getRowDimensionDao().add(rowDimension);
				}
			}
			
			JsonArray headerContextJSON = maskJSON.get("headerContext").getAsJsonArray();
			ArrayList<HeaderDimension> headerContext = new ArrayList<HeaderDimension>();
			for(JsonElement o : headerContextJSON)
			{
				HeaderDimension h = gson.fromJson(o , HeaderDimension.class);
				
				h.setMask(mask);
				System.out.println("h " + h.toString());
				DaoFactory.getHeaderDimensionDao().add(h);
				
				headerContext.add(h);
			}
			
			gson = new GsonBuilder().disableHtmlEscaping()
			        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
			        .serializeNulls()
			        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
			        .excludeFieldsWithoutExposeAnnotation()
			        .create();
			
			
			mask = DaoFactory.getMaskDao().findById(mask.getId());
			
			
			map.put("message", "Masque sauvegard� avec succ�s.");
			map.put("mask", gson.toJson(mask));
			map.put("id", String.valueOf(mask.getId()));
			System.out.println("mask " + gson.toJson(mask));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", e.getMessage());
		}
		finally
		{			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}