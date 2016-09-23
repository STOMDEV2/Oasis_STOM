package fr.stcg.oasis.servlets.calculation;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
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
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.HistoricCalculLaunch;
import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.essbase.Essbase;
import fr.stcg.oasis.utility.CalculState;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/launchCalcul")
public class LaunchCalculServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public LaunchCalculServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");
			String[] applicationCube = ((String)session.getAttribute("applicationCube")).split("\\.");
			
			if(user.getProfile().isCalculAdmin())
				request.setAttribute("data", DaoFactory.getCubeDao().findAll());
			else
			{
				ArrayList<Cube> cubes = new ArrayList<Cube>();
				cubes.add(DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]));
				request.setAttribute("data", cubes);
			}
			
			request.getRequestDispatcher("/workspace/calculation/launchCalculation.jsp").forward(request, response);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
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
		String calculIdStringified = request.getParameter("id");
		
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

		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		String[] applicationCube = ((String)session.getAttribute("applicationCube")).split("\\.");
		HashMap<String, String> form = (HashMap<String, String>) session.getAttribute("form");
		
		Essbase essbase = null;
		IEssCubeView cubeView = null;
		HistoricCalculLaunch hcl = null;
		String comments = "";
		try
		{
			essbase = new Essbase(form);
			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationCube[0], applicationCube[1]);
			cubeView = cube.openCubeView("default");
			
			JsonParser parser = new JsonParser();
			JsonArray dataJson = (JsonArray)parser.parse(dataStringified);
			
			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculIdStringified));
			
			/*	HISTORIC CALCUL LAUNCH	*/
			hcl = new HistoricCalculLaunch();
				hcl.setCalcul(calcul);
				hcl.setDateBegin(new Date(Calendar.getInstance().getTime().getTime()));
				hcl.setTimeBegin(new Date(Calendar.getInstance().getTime().getTime()));
				hcl.setLauncher(user);
				hcl.setState(CalculState.CALCUL_ONGOING);
			hcl = DaoFactory.getHistoricCalculLaunchDao().add(hcl);
			
			ArrayList<Script> scripts = new ArrayList<Script>();
			for(OrderedScript orderedScript: calcul.getOrderedScripts())
				scripts.add(orderedScript.getScript());
			
			hcl.setParameters("");
			for(JsonElement element: dataJson)
			{
				JsonObject object = (JsonObject)element;
				
				String variable = object.get("variable").getAsString();
				JsonArray members = object.get("members").getAsJsonArray();
				String membersString = "";
				for(JsonElement mmbr: members)
					membersString += "\"" + mmbr.getAsString() + "\",";
				
				hcl.setParameters(hcl.getParameters() + membersString + " ");
				
				if(membersString.indexOf(",") != -1)
					membersString = membersString.substring(0, membersString.length() - ",".length());
				
				for(Script script: scripts)
					script.setContent(script.getContent().replaceAll(variable, membersString));
			}
			hcl.setParameters(hcl.getParameters().replaceAll("\"", ""));
			if(hcl.getParameters().indexOf(", ") != -1)
				hcl.setParameters(hcl.getParameters().substring(0, hcl.getParameters().length() - ", ".length()));
			
			IEssOpCalculate calculate = cubeView.createIEssOpCalculate();
			for(Script script: scripts)
			{
				comments += script.getName() + ": ";
				
				System.out.println("JE TEST !");
				System.out.println(script.getContent());
				calculate.set(script.getContent(), false);
				cubeView.performOperation(calculate);
				
				comments += "OK\n";
			}
			
			hcl.setState(CalculState.CALCUL_SUCCESS);
			map.put("success", "Calcul successfully executed!");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", e.getMessage());
			hcl.setState(CalculState.CALCUL_FAIL);
			comments += "FAILED: " + e.getMessage() + "\n";
		}
		finally
		{
			hcl.setComments(comments);
			hcl.setDateEnd(new Date(Calendar.getInstance().getTime().getTime()));
			hcl.setTimeEnd(new Date(Calendar.getInstance().getTime().getTime()));
			
			try {
				DaoFactory.getHistoricCalculLaunchDao().update(hcl);
				cubeView.close();
				essbase.disconnectServer();
			} catch (EssException e) {
				e.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
