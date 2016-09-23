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

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/addScriptToCalcul")
public class AddScriptToCalculServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public AddScriptToCalculServlet() {
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
		
		String calculId = request.getParameter("calculId");
		String scriptId = request.getParameter("scriptId");
				
		if(calculId == null || scriptId == null)
		{
			map.put("error", "Bullshit request!");
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
			return;
		}
		
		System.out.println(calculId);
		System.out.println(scriptId);
		
		try
		{
			Script script = DaoFactory.getScriptDao().findById(Integer.parseInt(scriptId));
			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculId));
			
			OrderedScript orderedScript = new OrderedScript();
				orderedScript.setScript(script);
				orderedScript.setPosition(calcul.getOrderedScripts().size() + 1);
				orderedScript.setCalcul(calcul);
			orderedScript = DaoFactory.getOrderedScriptDao().add(orderedScript);
//			orderedScript.setCalculs(new ArrayList<Calcul>());
//			orderedScript.getCalculs().add(calcul);
			
//			calcul.getOrderedScripts().add(orderedScript);
//			DaoFactory.getCalculDao().update(calcul);
			
			map.put("success", "Script successfully added to calcul!");
			map.put("object", gson.toJson(orderedScript));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			map.put("error", "An error occured during the save. Try again later.");
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
