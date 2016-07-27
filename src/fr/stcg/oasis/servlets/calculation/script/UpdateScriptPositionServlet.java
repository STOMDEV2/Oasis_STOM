package fr.stcg.oasis.servlets.calculation.script;

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

@WebServlet("/workspace/calcul/script/updateScriptPosition")
public class UpdateScriptPositionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public UpdateScriptPositionServlet() {
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
		String[] scriptIds = request.getParameterValues("scriptIds[]");
		
		System.out.println(calculId);
		System.out.println(scriptIds);
		
		if(calculId == null || scriptIds == null)
		{
			map.put("error", "Bullshit request!");
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
			return;
		}
		
		System.out.println(calculId);
		System.out.println(scriptIds);
		
		try
		{
			for(int i = 0; i < scriptIds.length; i++)
			{
				OrderedScript orderedScript = DaoFactory.getOrderedScriptDao().findById(Integer.parseInt(scriptIds[i]));
					orderedScript.setPosition(i + 1);
				DaoFactory.getOrderedScriptDao().update(orderedScript);
			}
			
			map.put("success", "Script position successfully updated!");
		}
		catch (Exception e)
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
