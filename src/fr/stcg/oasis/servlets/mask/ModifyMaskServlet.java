package fr.stcg.oasis.servlets.mask;

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
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.GridElement;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.json.HeaderDimensionAdapter;
import fr.stcg.oasis.utility.GridElementState;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/mask/modifyMask")
public class ModifyMaskServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{	
		String idString = request.getParameter("id");
		
		Mask mask = null;
		try {
			mask = DaoFactory.getMaskDao().findById(Integer.parseInt(idString));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if(mask == null)
		{
			response.sendRedirect(request.getContextPath() + "/workspace/mask/displayMask");
			return;
		}
		
		Gson gson = new GsonBuilder().disableHtmlEscaping()
							        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
							        .setPrettyPrinting()
							        .serializeNulls()
							        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
							        .excludeFieldsWithoutExposeAnnotation()
							        .create();
		
		request.setAttribute("mask", gson.toJson(mask));
		request.setAttribute("grids", gson.toJson(DaoFactory.getGridDao().findGridsByMask(mask.getId())));
		
		request.getRequestDispatcher("/workspace/mask/modifyMask.jsp").forward(request, response);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
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
		
		String maskIdString = request.getParameter("id");
		
		System.out.println("maskIdString " + maskIdString);
		
		if(maskIdString == null)
		{
			response.sendRedirect(request.getContextPath() + "/workspace/mask/displayMask");
			return;
		}
		
		String maskStringified = request.getParameter("mask");
		
		
		System.out.println(maskStringified);
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
		        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
		        .setPrettyPrinting()
		        .serializeNulls()
		        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
		        .excludeFieldsWithoutExposeAnnotation()
		        .create();
		
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
			
			/*	UPDATING MASK	*/
			Mask newMask = Mask.getMaskFromJSON(maskJSON.get("mask").getAsJsonObject());
			
			if(newMask.getNameMask().isEmpty())
			{
				map.put("error", "Please enter a mask name");
				
				out.write(gson.toJson(map));
				out.flush();
				out.close();
				return;
			}
			
			Mask mask = DaoFactory.getMaskDao().findById(Integer.parseInt(maskIdString));
			
			JsonArray modifiedGrids = maskJSON.get("modifiedGrids").getAsJsonArray();
			boolean shouldDropMask = maskJSON.get("shouldDropMask").getAsBoolean();
			boolean shouldOverwrite = maskJSON.get("shouldOverwrite").getAsBoolean();
			
			JsonArray removedColumnContext = maskJSON.get("removedColumnContext").getAsJsonArray();
			JsonArray removedColumnDimension = maskJSON.get("removedColumnDimension").getAsJsonArray();
			JsonArray removedRowContext = maskJSON.get("removedRowContext").getAsJsonArray();
			JsonArray removedRowDimension = maskJSON.get("removedRowDimension").getAsJsonArray();
			
			System.out.println("overwrite " + shouldOverwrite);
			if(!shouldOverwrite) 
			{
				int maskIdToGetRemoved = mask.getId();

				String newMaskName = maskJSON.get("newMaskName").getAsString();
				
				if( !Mask.isNameAvailable( newMaskName ) )
				{
					map.put("errorMaskName", "true");
					throw new Exception("A mask with the same name already exists!");
				}
				
				Mask brandNewMask = new Mask(); 
				BeanUtils.copyProperties(brandNewMask, mask);
				
				brandNewMask.setColumnContext(null);
				brandNewMask.setRowContext(null);
				brandNewMask.setHeaderContext(null);
				brandNewMask.setGrids(null);
				brandNewMask.setId(0);
				brandNewMask.setNameMask(newMaskName);
				
				brandNewMask.setLastEditor(null);
				brandNewMask.setAuthor(user);
				brandNewMask.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
				brandNewMask.setLastModificationDate(null);
				BeanUtils.setProperty(brandNewMask, "pcVersionInit", false);
				System.out.print("brandNewMaskName : "  + brandNewMask.getNameMask() );
				brandNewMask = DaoFactory.getMaskDao().add(brandNewMask);

				
				for(ColumnContext context: mask.getColumnContext())
				{
					ColumnContext newContext = new ColumnContext();
					BeanUtils.copyProperties(newContext, context);
					
					newContext.setId(0);
					newContext.setColumnsDimensions(null);
					
					newContext.getDefaultStyle().makeItReplicable();
					newContext.getTitle().makeItReplicable();
					newContext.getType().makeItReplicable();
					
					BeanUtils.setProperty(newContext, "pcVersionInit", false);
					newContext.setMask(brandNewMask);
					
					newContext = DaoFactory.getColumnContextDao().add(newContext);
					
					
					for(int i = 0; i < columnContexts.size(); i++)
					{
						ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)columnContexts.get(i));
						
						if(columnContext.getId() == context.getId())
							((JsonObject)columnContexts.get(i)).addProperty("id", newContext.getId());
					}
					
					/*	REMOVING FORMER COLUMNCONTEXT ID COLUMN CONTEXT	*/
					for(int i = 0; i < removedColumnContext.size(); i++)
					{
						int elementId = Integer.parseInt(removedColumnContext.get(i).getAsString());
						
						ColumnContext columnContext = DaoFactory.getColumnContextDao().findById(elementId);
						
						if(columnContext.getId() == context.getId())
						{
							JsonPrimitive primitive = new JsonPrimitive(newContext.getId());
							
							removedColumnContext.set(i, primitive);
						}
					}
					
					
					
					
					for(ColumnDimension dimension : context.getColumnsDimensions())
					{
						ColumnDimension newDimension = new ColumnDimension();
						BeanUtils.copyProperties(newDimension, dimension);
						
						newDimension.setId(0);
						newDimension.setColumnContext(newContext);
						
						newDimension.getGridElement().makeItReplicable();
//						System.out.println(newDimension.getGridElement().getStyle() + " " + dimension.getGridElement().getStyle());
						
						BeanUtils.setProperty(newDimension, "pcVersionInit", false);
						
//						System.out.println(newDimension.getScenarioParameters().size());
						
						DaoFactory.getColumnDimensionDao().add(newDimension);
						
						
						
						/*	REMOVING FORMER COLUMN DIMENSION ID	*/
						for(int i = 0; i < removedColumnDimension.size(); i++)
						{
							int elementId = Integer.parseInt(removedColumnDimension.get(i).getAsString());
							
							ColumnDimension columnDimension = DaoFactory.getColumnDimensionDao().findById(elementId);
							
							if(columnDimension.getId() == dimension.getId())
							{
								JsonPrimitive primitive = new JsonPrimitive(newDimension.getId());
								
								removedColumnDimension.set(i, primitive);
							}
						}
						
						
						

						
						
						
						
						for(int i = 0; i < columnContexts.size(); i++)
						{
							ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)columnContexts.get(i));
							
							if(columnContext.getId() == newContext.getId())
							{
								JsonArray columnDimensions = ((JsonObject)columnContexts.get(i)).getAsJsonArray("dimension");
								for(int j = 0; j < columnDimensions.size(); j++)
								{
									JsonObject columnDimensionJSON = (JsonObject)columnDimensions.get(j);
									ColumnDimension columnDimension = ColumnDimension.getColumnDimensionFromJSON(columnDimensionJSON);
									
									if(dimension.getId() == columnDimension.getId())
									{
										columnDimensionJSON.addProperty("id", newDimension.getId());
									}
								}
							}
						}
					}
				}
				
				for(RowContext context: mask.getRowContext())
				{
					RowContext newContext = new RowContext();
					BeanUtils.copyProperties(newContext, context);
					
					newContext.setId(0);
					newContext.setRowDimensions(null);
					
					newContext.getDefaultStyle().makeItReplicable();
					System.out.println(newContext.getDefaultStyle().getStyle() + " " + context.getDefaultStyle().getStyle());
					newContext.getTitle().makeItReplicable();
					System.out.println(newContext.getDefaultStyle().getStyle() + " " + context.getDefaultStyle().getStyle());
					
					BeanUtils.setProperty(newContext, "pcVersionInit", false);
					newContext.setMask(brandNewMask);
					
					newContext = DaoFactory.getRowContextDao().add(newContext);
					
					
					for(int i = 0; i < rowContexts.size(); i++)
					{
						RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)rowContexts.get(i));
						
						if(rowContext.getId() == context.getId())
							((JsonObject)rowContexts.get(i)).addProperty("id", newContext.getId());
					}
					
					
					/*	REMOVING COLUMN CONTEXT	*/
					for(int i = 0; i < removedRowContext.size(); i++)
					{
						int elementId = Integer.parseInt(removedRowContext.get(i).getAsString());
						
						RowContext rowContext = DaoFactory.getRowContextDao().findById(elementId);
						
						if(rowContext.getId() == context.getId())
						{
							JsonPrimitive primitive = new JsonPrimitive(newContext.getId());
							
							removedRowContext.set(i, primitive);
						}
					}
					
					
					
					for(RowDimension dimension : context.getRowDimensions())
					{
						RowDimension newDimension = new RowDimension();
						BeanUtils.copyProperties(newDimension, dimension);
						
						newDimension.setId(0);
						newDimension.setRowContext(newContext);
						
						newDimension.getGridElement().makeItReplicable();
//						System.out.println(newDimension.getGridElement().getStyle() + " " + dimension.getGridElement().getStyle());
						
						BeanUtils.setProperty(newDimension, "pcVersionInit", false);
						
						DaoFactory.getRowDimensionDao().add(newDimension);
						
						
						
						
						/*	REMOVING COLUMN CONTEXT	*/
						for(int i = 0; i < removedRowDimension.size(); i++)
						{
							int elementId = Integer.parseInt(removedRowDimension.get(i).getAsString());
							
							RowDimension rowDimension = DaoFactory.getRowDimensionDao().findById(elementId);
							
							if(rowDimension.getId() == dimension.getId())
							{
								JsonPrimitive primitive = new JsonPrimitive(newDimension.getId());
								
								removedRowDimension.set(i, primitive);
							}
						}
						
						
						
						
						
						
						
						
						
						
						
						for(int i = 0; i < rowContexts.size(); i++)
						{
							RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)rowContexts.get(i));
							
							if(rowContext.getId() == newContext.getId())
							{
								JsonArray rowDimensions = ((JsonObject)rowContexts.get(i)).getAsJsonArray("Retrieve");
								for(int j = 0; j < rowDimensions.size(); j++)
								{
									JsonObject rowDimensionJSON = (JsonObject)rowDimensions.get(j);
									RowDimension rowDimension = RowDimension.getRowDimensionFromJSON(rowDimensionJSON);
									
									if(dimension.getId() == rowDimension.getId())
									{
										rowDimensionJSON.addProperty("id", newDimension.getId());
									}
								}
								
								rowDimensions = ((JsonObject)rowContexts.get(i)).getAsJsonArray("Capture");
								for(int j = 0; j < rowDimensions.size(); j++)
								{
									JsonObject rowDimensionJSON = (JsonObject)rowDimensions.get(j);
									RowDimension rowDimension = RowDimension.getRowDimensionFromJSON(rowDimensionJSON);
									
									if(dimension.getId() == rowDimension.getId())
									{
										rowDimensionJSON.addProperty("id", newDimension.getId());
									}
								}
							}
						}
					}
				}
				
				
				for(HeaderDimension context: mask.getHeaderContext())
				{
					HeaderDimension newDimension = new HeaderDimension();
					BeanUtils.copyProperties(newDimension, context);
					
					newDimension.setId(0);
					
					BeanUtils.setProperty(newDimension, "pcVersionInit", false);
					context.setMask(brandNewMask);
					
					DaoFactory.getHeaderDimensionDao().add(newDimension);
				}
				
				
				
				
				
				
				
				
				
				
				
				for(JsonElement element: modifiedGrids)
				{
					String maskId = element.getAsString();
					
					Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(maskId));
					
					grid.setMask(brandNewMask);
					
					DaoFactory.getGridDao().update(grid);
				}
				
				if(shouldDropMask)
					DaoFactory.getMaskDao().remove(maskIdToGetRemoved);
				
				mask = DaoFactory.getMaskDao().findById(brandNewMask.getId());
//				map.put('brandNewMaskId',)
			}
			else
			{
				mask.setNameMask(newMask.getNameMask());
				mask.setLastEditor(user);
				mask.setLastModificationDate(new Date(Calendar.getInstance().getTime().getTime()));
				System.out.println("maskName to be updated : " + mask.getNameMask());
				DaoFactory.getMaskDao().update(mask);
			}
			
			
			
			
			
			
			/*	REMOVING COLUMN CONTEXT	*/
			for(JsonElement idString : removedColumnContext)
			{
				int elementId = Integer.parseInt(idString.getAsString());
				
				ColumnContext context = DaoFactory.getColumnContextDao().findById(elementId);
				
				if(context == null)
					continue;
				
//				for(ColumnDimension dimension : context.getColumnsDimensions())
//				{
//					try
//					{
//						DaoFactory.getColumnDimensionDao().remove(dimension.getId());
//					}
//					catch(Exception e)
//					{
//						e.printStackTrace();
//						
//						ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByColumnContext(dimension);
//						Grid grid = parameter.getGrid();
//						
//						DaoFactory.getGridDao().remove(grid.getId());
//						
//						DaoFactory.getColumnDimensionDao().remove(dimension.getId());
//					}
//				}
				
				DaoFactory.getColumnContextDao().remove(context.getId());
			}
			

			
			
			/*	REMOVING COLUMN DIMENSION	*/
			for(JsonElement idString : removedColumnDimension)
			{
				int elementId = Integer.parseInt(idString.getAsString());
				
				ColumnDimension dimension = DaoFactory.getColumnDimensionDao().findById(elementId);
				
				if(dimension == null)
					continue;
				
//				try
//				{
					DaoFactory.getColumnDimensionDao().remove(dimension.getId());
//				}
//				catch(Exception e)
//				{
////					e.printStackTrace();
//					
//					ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByColumnContext(dimension);
//					Grid grid = parameter.getGrid();
//					
//					DaoFactory.getGridDao().remove(grid.getId());
//					
//					DaoFactory.getColumnDimensionDao().remove(dimension.getId());
//				}
			}
			
			
			
			
			/*	REMOVING ROW CONTEXT	*/
			for(JsonElement idString : removedRowContext)
			{
				int elementId = Integer.parseInt(idString.getAsString());
				
				RowContext context = DaoFactory.getRowContextDao().findById(elementId);
				
				if(context == null)
					continue;
				
//				for(RowDimension dimension : context.getRowDimensions())
//				{
//					try
//					{
//						DaoFactory.getRowDimensionDao().remove(dimension.getId());
//					}
//					catch(Exception e)
//					{
////						e.printStackTrace();
//						
//						ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByRowContext(dimension);
//						Grid grid = parameter.getGrid();
//						
//						DaoFactory.getGridDao().remove(grid.getId());
//						
//						DaoFactory.getRowDimensionDao().remove(dimension.getId());
//					}
//				}
				
				DaoFactory.getRowContextDao().remove(context.getId());
			}
			
			
			
			
			/*	REMOVING ROW DIMENSION	*/
			for(JsonElement idString : removedRowDimension)
			{
				int elementId = Integer.parseInt(idString.getAsString());
				
				RowDimension dimension = DaoFactory.getRowDimensionDao().findById(elementId);
				
				if(dimension == null)
					continue;
				
//				try
//				{
					DaoFactory.getRowDimensionDao().remove(dimension.getId());
//				}
//				catch(Exception e)
//				{
////					e.printStackTrace();
//					
//					ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByRowContext(dimension);
//					Grid grid = parameter.getGrid();
//					
//					DaoFactory.getGridDao().remove(grid.getId());
//					
//					DaoFactory.getRowDimensionDao().remove(dimension.getId());
//				}
			}
			
			/*	REMOVING HEADER CONTEXT	*/
			for(HeaderDimension dimension : mask.getHeaderContext())
			{
//				try
//				{
					DaoFactory.getHeaderDimensionDao().remove(dimension.getId());
//				}
//				catch(Exception e)
//				{
////					e.printStackTrace();
//					
//					ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByHeaderContext(dimension);
//					Grid grid = parameter.getGrid();
//					
//					DaoFactory.getGridDao().remove(grid.getId());
//					
//					DaoFactory.getHeaderDimensionDao().remove(dimension.getId());
//				}
			}
			
		
			
			
			for(int i = 0, cpt = columnContexts.size(); i < cpt; i+=1)
			{
				ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)columnContexts.get(i));
				
				ArrayList<ColumnDimension> columnDimensions = new ArrayList<ColumnDimension>(columnContext.getColumnsDimensions());
				
				
				
				for(int j = 0 , cpteur = columnDimensions.size(); j < cpteur; j+= 1)
				{
					System.out.println("columnDimensions " + j  + " i:" + i + " " + columnDimensions.get(j).getDimension().getName()  );
				}
			}
			
			for( int i = 0, cpt = rowContexts.size(); i < cpt; i+=1)
			{
				RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)rowContexts.get(i));
				System.out.println("rowContext " + i );
				ArrayList<RowDimension> rowDimensions = new ArrayList<RowDimension>(rowContext.getRowDimensions());
				
				for(int j = 0, cpteur = rowDimensions.size(); j < cpteur; j+=1)
				{
					System.out.println("rowDimensions " + j  + " i:" + i + " " + rowDimensions.get(i).getDimension().getName()  );
				}
				
			}
			
			
			
			
			int m = 0;
			for(int i = 0; i < columnContexts.size(); i++)
			{
				ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)columnContexts.get(i));
				System.out.println("columnContext " + i );
				ArrayList<ColumnDimension> columnDimensions = new ArrayList<ColumnDimension>(columnContext.getColumnsDimensions());
				
				columnContext.setMask(mask);
				
				columnContext.getColumnsDimensions().clear();
				
				System.out.println(columnContext.getTitle() + " " + columnContext.getState());

				GridElement title = columnContext.getTitle();
				GridElement type = columnContext.getType();
				GridElement defaultStyle = columnContext.getDefaultStyle();
				
				if(columnContext.getState().equals(GridElementState.CREATED))
					columnContext = DaoFactory.getColumnContextDao().add(columnContext);
				else if(columnContext.getState().equals(GridElementState.MODIFIED))
				{
					columnContext = DaoFactory.getColumnContextDao().findById(columnContext.getId());
					
					if(columnContext == null)
						continue;
					
					System.out.println(columnContext.getTitle());
					
					if(title.getState().equals(GridElementState.MODIFIED))
						columnContext.getTitle().assignNewGridElement(title);
					if(type.getState().equals(GridElementState.MODIFIED))
						columnContext.getType().assignNewGridElement(type);

					columnContext.getDefaultStyle().assignNewGridElement(defaultStyle);
					
					DaoFactory.getColumnContextDao().update(columnContext);
				}
				
				
				for(ColumnDimension columnDimension : columnDimensions)
				{
					
					System.out.println("columnDimension " + (m++) );
					GridElement value = columnDimension.getGridElement();
					
					Dimension dimension = DaoFactory.getDimensionDao().findDimensionByName(columnDimension.getDimension().getName(), cube);
					
					columnDimension.setDimension(dimension);
					columnDimension.setColumnContext(columnContext);
					
					System.out.println(value.getValue() + " " + value.getState());
					
					if(value.getState().equals(GridElementState.CREATED))
						columnDimension = DaoFactory.getColumnDimensionDao().add(columnDimension);
					else if(value.getState().equals(GridElementState.MODIFIED))
					{
						columnDimension = DaoFactory.getColumnDimensionDao().findById(columnDimension.getId());
						
						if(columnDimension == null)
							continue;
						
						System.out.println(value.getValue());
						
						columnDimension.getGridElement().assignNewGridElement(value);
						
						DaoFactory.getColumnDimensionDao().update(columnDimension);
					}
					
					if(columnContext.getType().equals("Formula") || columnContext.getType().equals("Comment"))
						break;
				}
			}
			
			m = 0;
			for(int i = 0; i < rowContexts.size(); i++)
			{
				RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)rowContexts.get(i));
				System.out.println("rowContext " + i );
				ArrayList<RowDimension> rowDimensions = new ArrayList<RowDimension>(rowContext.getRowDimensions());
				
				rowContext.setMask(mask);
				rowContext.getRowDimensions().clear();
				
				GridElement title = rowContext.getTitle();
				GridElement defaultStyle = rowContext.getDefaultStyle();
				
				if(rowContext.getState().equals(GridElementState.CREATED))
					rowContext = DaoFactory.getRowContextDao().add(rowContext);
				else if(rowContext.getState().equals(GridElementState.MODIFIED))
				{
					rowContext = DaoFactory.getRowContextDao().findById(rowContext.getId());
					
					if(rowContext == null)
						continue;
					
					System.out.println(rowContext.getTitle().getValue());
					
					if(title.getState().equals(GridElementState.MODIFIED))
						rowContext.getTitle().assignNewGridElement(title);
					
					rowContext.getDefaultStyle().assignNewGridElement(defaultStyle);
					
					DaoFactory.getRowContextDao().update(rowContext);
				}
				
				for(RowDimension rowDimension : rowDimensions)
				{
//					if(rowDimension.getGridElement().getValue().equals(""))
//						continue;
					System.out.println("rowDimension " + (m++));
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
					
					
					GridElement value = rowDimension.getGridElement();
					
					if(value.getState().equals(GridElementState.CREATED))
						rowDimension = DaoFactory.getRowDimensionDao().add(rowDimension);
					else if(value.getState().equals(GridElementState.MODIFIED))
					{
						rowDimension = DaoFactory.getRowDimensionDao().findById(rowDimension.getId());
						
						if(rowDimension == null)
							continue;
						
						System.out.println(rowDimension.getGridElement().getValue());
						
						rowDimension.getGridElement().assignNewGridElement(value);
						
						DaoFactory.getRowDimensionDao().update(rowDimension);
					}
				}
			}
			
			
			
			
			
			
			map.put("mask", gson.toJson(mask));
			map.put("grids", gson.toJson(DaoFactory.getGridDao().findGridsByMask(mask.getId()))); 
			
			gson = new GsonBuilder().registerTypeAdapter(HeaderDimension.class, new HeaderDimensionAdapter()).create();
			
			/*	HEADER CONTEXT	*/
			JsonArray headerContextJSON = maskJSON.get("headerContext").getAsJsonArray();
			ArrayList<HeaderDimension> headerContext = new ArrayList<HeaderDimension>();
			for(JsonElement o : headerContextJSON)
			{
				HeaderDimension h = gson.fromJson(o, HeaderDimension.class);
				
				h.setMask(mask);
				System.out.println("h " + h.toString());
				DaoFactory.getHeaderDimensionDao().add(h);
				
				headerContext.add(h);
			}
	
			
			map.put("message", "Masque sauvegard� avec succ�s.");
			map.put("id", String.valueOf(mask.getId()));
			
		}
		catch( Exception e )
		{
			e.printStackTrace();
			map.put("error", e.getMessage() );
			
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
