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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.ScenarioParameter;
import fr.stcg.oasis.beans.Variable;
import fr.stcg.oasis.dao.DaoFactory;

@WebServlet("/workspace/grid/updateScenarioParameters")
public class UpdateScenarioParametersServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

    public UpdateScenarioParametersServlet() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String scenarioParameters = request.getParameter("data");
		String gridIdString = request.getParameter("id");
		
		Enumeration<String> parameterNames = request.getParameterNames();
		while(parameterNames.hasMoreElements())
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
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		
		ArrayList<Integer> parametersId = new ArrayList<Integer>();
		
		try
		{
			JsonArray array = (JsonArray)parser.parse(scenarioParameters);
			Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdString));
			
			for(JsonElement element: array)
			{
				JsonObject object = (JsonObject)element;
				
				JsonElement id = object.get("id");
				String value = object.get("value").getAsString();
				
				if(value.equals(""))
				{
//					System.out.println("CA VA PAS");
					map.put("warning", "Scenario parameters can't be empty!");
//					break;
				}
				
				if(id == null)
				{
					String type = object.get("type").getAsString();
					String variableId = object.get("elementId").getAsString();
					
					ScenarioParameter parameter = new ScenarioParameter();
					parameter.setValue(value);
					parameter.setGrid(grid);
					parameter.setRetrieve(type.equals("Retrieve") ? true : false);

					Variable variable = DaoFactory.getVariableDao().findById(Integer.parseInt(variableId));
					parameter.setVariable(variable);
					parameter = DaoFactory.getScenarioParametersDao().add(parameter);
					
					parametersId.add(parameter.getId());
				}
				else
				{
					String parameterId = id.getAsString();
					
					ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().findById(Integer.parseInt(parameterId));
					parameter.setValue(value);
					
					DaoFactory.getScenarioParametersDao().update(parameter);
					
					parametersId.add(parameter.getId());
				}
			}
			
			map.put("ids", gson.toJson(parametersId));
			
			grid.setLastModificationDate(new Date(Calendar.getInstance().getTime().getTime()));
			DaoFactory.getGridDao().update(grid);
			
			if(!map.containsKey("error"))
				map.put("success", "Parameters updated!");
		}
		catch (NumberFormatException e)
		{
			e.printStackTrace();
			
			map.put("error", "Error during update! Try again later");
		}
		catch (Exception e) 
		{
			e.printStackTrace();
			
			map.put("error", "Error during update! Try again later");
		}
		
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		out.write(gson.toJson(map));
		out.flush();
		out.close();
	}
}
