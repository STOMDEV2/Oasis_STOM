package fr.stcg.oasis.servlets.calculation.script;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.essbase.api.base.EssException;
import com.essbase.api.dataquery.IEssCubeView;
import com.essbase.api.dataquery.IEssOpCalculate;
import com.essbase.api.datasource.IEssCube;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.Variable;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.essbase.Essbase;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/script/testScript")
public class TestScriptServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public TestScriptServlet() {
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
		
		String scriptToTest = request.getParameter("content");
		
		HttpSession session = request.getSession();
		HashMap<String, String> form = (HashMap<String, String>) session.getAttribute("form");
		String select = (String) session.getAttribute("applicationCube");
		String[] applicationCube = select.split("\\.");
		
		Essbase essbase = null;
		IEssCubeView cubeView = null;
		try
		{
			essbase = new Essbase(form);
			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationCube[0], applicationCube[1]);
			cubeView = cube.openCubeView("default");
			
			//	REPLACING VARIABLES
			int percentIndex = 0;
			while((percentIndex = scriptToTest.indexOf("%", percentIndex)) != -1)
			{
				int nextPercentIndex = scriptToTest.indexOf("%", percentIndex + 1);
				
				String stringToDelete = scriptToTest.substring(percentIndex, nextPercentIndex + 1);
				String variableString = stringToDelete.replaceAll("%", "").split("_")[0];
				
				Variable variable = DaoFactory.getVariableDao().findVariableByNameAndCube(variableString);
				if(variable == null)
					throw new Exception(stringToDelete + " does not exist! Please create the variable!");
				scriptToTest = scriptToTest.replace(stringToDelete, "\"" + variable.getAssociatedDimension().getName() + "\"");
				
//				scriptToTest = scriptToTest.substring(0, percentIndex) + scriptToTest.substring(nextPercentIndex + 1);
//				
//				int nextClosingParenthesisIndex = scriptToTest.indexOf(")", percentIndex);
//				
//				System.out.println("CURRENT REPLACING: " + scriptToTest);
//				
//				if(nextClosingParenthesisIndex >= 0)
//				{
//					String stringToCommaTest = scriptToTest.substring(percentIndex, nextClosingParenthesisIndex);
//					
//					System.out.println(stringToCommaTest);
//					
//					if(stringToCommaTest.indexOf(",") != -1 && (stringToCommaTest.indexOf(",") < nextClosingParenthesisIndex))
//					{
//						int nextCommaIndex = scriptToTest.indexOf(",", percentIndex);
//						
//						scriptToTest = scriptToTest.substring(0, nextCommaIndex) + scriptToTest.substring(nextCommaIndex + 1);
//					}
//				}
			}
			
			System.out.println(scriptToTest);
			
			IEssOpCalculate calculate = cubeView.createIEssOpCalculate();
			calculate.set(scriptToTest, true);
			cubeView.performOperation(calculate);
			
			map.put("success", "Script without any errors!");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", e.getMessage());
		}
		finally
		{
			try {
				cubeView.close();
				essbase.disconnectServer();
			} catch (EssException e) {
				e.printStackTrace();
			}
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
