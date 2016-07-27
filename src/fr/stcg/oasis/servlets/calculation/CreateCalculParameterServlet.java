package fr.stcg.oasis.servlets.calculation;

import java.io.IOException;
import java.io.PrintWriter;
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

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.beans.VariableParameter;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/createCalculParameter")
public class CreateCalculParameterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public CreateCalculParameterServlet() {
        super();
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");

//		Enumeration<String> parameterNames = request.getParameterNames();
//		while (parameterNames.hasMoreElements())
//		{
//			String paramName = parameterNames.nextElement();
//
//			String[] paramValues = request.getParameterValues(paramName);
//			for (int i = 0; i < paramValues.length; i++) {
//				String paramValue = paramValues[i];
//				System.out.println(paramName + " " + paramValue);
//			}
//		}
		
		String dataStringified = request.getParameter("data");
		String calculIdStringfied = request.getParameter("id");
		
		System.out.println(dataStringified);
		
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
//			HttpSession session = request.getSession();
//			User user = (User)session.getAttribute("user");
//			String[] applicationCube = ((String)session.getAttribute("applicationCube")).split("\\.");

//			Cube cube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
			
			JsonParser parser = new JsonParser();
			JsonArray dataJson = (JsonArray)parser.parse(dataStringified);
			
			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculIdStringfied));
			
			String variables = "";

			for(JsonElement element : dataJson)
			{
				JsonObject object = (JsonObject)element;
				
				VariableParameter parameter = VariableParameter.getVariableParameterFromJSON(object);
				
				VariableParameter parameterTest = DaoFactory.getVariableParameterDao().findVariableParameterByCalculAndName(calcul, parameter.getVariable());
				
				if(parameterTest == null)
				{
					Dimension dimension = DaoFactory.getDimensionDao().findDimensionByName(parameter.getDimension().getName(), calcul.getCube()/*cube*/);
					
					parameterTest = new VariableParameter();
						parameterTest.setCalcul(calcul);
						parameterTest.setUDAs(parameter.getUDAs());
						parameterTest.setLevels(parameter.getLevels());
						parameterTest.setGens(parameter.getGens());
						parameterTest.setVariable(parameter.getVariable());
						parameterTest.setDimension(dimension);
						parameterTest.setSimpleValue(parameter.isSimpleValue());
					parameterTest = DaoFactory.getVariableParameterDao().add(parameterTest);
				}
				else
				{
					parameterTest.setGens(parameter.getGens());
					parameterTest.setLevels(parameter.getLevels());
					parameterTest.setUDAs(parameter.getUDAs());
					parameterTest.setSimpleValue(parameter.isSimpleValue());
					DaoFactory.getVariableParameterDao().update(parameterTest);
				}
				
				variables += parameterTest.getVariable();
			}
			
			for(VariableParameter parameter: calcul.getVariableParameters())
			{
				boolean itsok = false;
				for(JsonElement element : dataJson)
				{
					JsonObject object = (JsonObject)element;
					
					VariableParameter currentParam = VariableParameter.getVariableParameterFromJSON(object);
					
					if(currentParam.getVariable().equals(parameter.getVariable()))
					{
						itsok = true;
						break;
					}
				}
				
				if(!itsok)
					DaoFactory.getVariableParameterDao().remove(parameter.getId());
			}
			
			
			loop:
				for(OrderedScript orderedScript: calcul.getOrderedScripts())
				{
					Script script = orderedScript.getScript();
					
					String scriptToCheck = script.getContent();
					
					int percentIndex = 0;
					while((percentIndex = scriptToCheck.indexOf("%", percentIndex)) != -1)
					{
						int nextPercentIndex = scriptToCheck.indexOf("%", percentIndex + 1);
						
						String variable = scriptToCheck.substring(percentIndex, nextPercentIndex + 1);
						
						if(variables.indexOf(variable) == -1)
						{
							map.put("warning", "All the variables has not been parametered! Ths script will not work until you parameter it!");
							break loop;
						}
						
						percentIndex = nextPercentIndex + 1;
					}
				}
			
			map.put("success", "a");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", "An error occured during the save. Try again later!");
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
