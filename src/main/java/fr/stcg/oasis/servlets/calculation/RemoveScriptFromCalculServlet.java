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

import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/removeScriptFromCalcul")
public class RemoveScriptFromCalculServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public RemoveScriptFromCalculServlet() {
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
		String orderedScriptId = request.getParameter("orderedScript");
				
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
		System.out.println(orderedScriptId);
		
		try
		{
//			Script script = DaoFactory.getScriptDao().findById(Integer.parseInt(scriptId));
			OrderedScript orderedScript = DaoFactory.getOrderedScriptDao().findById(Integer.parseInt(orderedScriptId));
//			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculId));
//			
//			Collection<OrderedScript> orderedScripts = calcul.getOrderedScripts();
//
//			Iterator<OrderedScript> itr = orderedScripts.iterator();
//			while(itr.hasNext())
//			{
//				OrderedScript oS = (OrderedScript)itr.next();
//				if(oS.getId() == orderedScript.getId())
//				{
//					itr.remove();
//					break;
//				}
//			}
//			DaoFactory.getCalculDao().update(calcul);
			
			DaoFactory.getOrderedScriptDao().remove(orderedScript.getId());
			
			map.put("success", "Script successfully removed from calcul!");
//			map.put("object", gson.toJson(script));
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
