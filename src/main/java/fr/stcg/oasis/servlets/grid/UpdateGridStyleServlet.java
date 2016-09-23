package fr.stcg.oasis.servlets.grid;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.GridStyle;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/grid/updateGridStyle")
public class UpdateGridStyleServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
      
    public UpdateGridStyleServlet() {
        super();
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
		        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
		        .setPrettyPrinting()
		        .serializeNulls()
		        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
		        .excludeFieldsWithoutExposeAnnotation()
		        .create();
		
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
		
		String gridIdStringified = request.getParameter("id");
		String dataStringified = request.getParameter("data");
		
		try
		{
			Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdStringified));
			
			JsonParser parser = new JsonParser();
			JsonArray dataJSON = (JsonArray)parser.parse(dataStringified);
			
			for(JsonElement element: dataJSON)
			{
				JsonObject object = (JsonObject)element;
				
				GridStyle gridStyle = GridStyle.getStyleFromJSON(object);
				
				GridStyle tmpGridStyle = DaoFactory.getGridStyleDao().findGridStyleByColumnContextAndRowContextAndGrid(gridStyle.getColumnContext(), gridStyle.getRowContext(), grid);
				
				if(tmpGridStyle == null)
				{
					tmpGridStyle = new GridStyle();
					
					RowContext rowContext = DaoFactory.getRowContextDao().findById(gridStyle.getRowContext().getId());
					tmpGridStyle.setRowContext(rowContext);
					
					ColumnContext columnContext = DaoFactory.getColumnContextDao().findById(gridStyle.getColumnContext().getId());
					tmpGridStyle.setColumnContext(columnContext);
					
					tmpGridStyle.setGrid(grid);
					tmpGridStyle.setStyle(gridStyle.getStyle());
					
					DaoFactory.getGridStyleDao().add(tmpGridStyle);
				}
				else
				{
					tmpGridStyle.getStyle().setCellStyle(gridStyle.getStyle().getCellStyle());
					tmpGridStyle.getStyle().setChildrenStyle(gridStyle.getStyle().getChildrenStyle());
					tmpGridStyle.getStyle().setBorderStyle(gridStyle.getStyle().getBorderStyle());
						
					DaoFactory.getGridStyleDao().update(tmpGridStyle);
				}
			}
			
			map.put("success", "Style successfully updated!");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", "An error occured during the update. Try again later.");
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
