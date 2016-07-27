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
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/moveItem")
public class MoveItemServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public MoveItemServlet() {
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
		
		String scriptId = request.getParameter("scriptId");
		String calculId = request.getParameter("calculId");
		String cubeId = request.getParameter("cubeId");
		
		try
		{
//			HttpSession session = request.getSession();
//			User user = (User)session.getAttribute("user");
			
			if(cubeId == null || (scriptId == null && calculId == null))
				throw new Exception("Bullshit request!");
			
			System.out.println(calculId);
			System.out.println(scriptId);
			System.out.println(cubeId);
			
			Cube cube = DaoFactory.getCubeDao().findById(Integer.parseInt(cubeId));
			
			if(scriptId != null)
			{
				Script script = DaoFactory.getScriptDao().findById(Integer.parseInt(scriptId));
				
				Script duplicateScript = DaoFactory.getScriptDao().findScriptByCubeAndName(cube, script.getName());
				if(duplicateScript != null)
					throw new Exception("A script with the same name already exists in this cube!");
				
				script.setCube(cube);
				DaoFactory.getScriptDao().update(script);
				
				map.put("object", gson.toJson(script));
				map.put("type", "script");
				map.put("success", "Script successfully moved!");
			}
			else
			{
				Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculId));
				if(calcul == null)
					throw new Exception("Calcul not found!");
				
				Calcul duplicateCalcul = DaoFactory.getCalculDao().findCalculByCubeAndName(cube, calcul.getName());
				if(duplicateCalcul != null)
					throw new Exception("A calcul with the same name already exists in this cube!");
				
//				calcul.setCube(cube);
//				DaoFactory.getCalculDao().update(calcul);
				
				for(OrderedScript orderedScript: calcul.getOrderedScripts())
				{
					Script script = orderedScript.getScript();
					Script duplicateScript = DaoFactory.getScriptDao().findScriptByCubeAndName(cube, script.getName());
					if(duplicateScript != null)
						throw new Exception("A script (" + script.getName() + ") that belong to the calcul you want to move already exists in this cube!");
					
					script.makeItReplicable();
						script.setCube(cube);
					
					script = DaoFactory.getScriptDao().add(script);
					
					orderedScript.setScript(script);
					DaoFactory.getOrderedScriptDao().update(orderedScript);
				}
				
				calcul.setCube(cube);
				DaoFactory.getCalculDao().update(calcul);
				
				map.put("object", gson.toJson(calcul));
				map.put("type", "calcul");
				map.put("success", "Calcul successfully moved!");
			}
		}
		catch (Exception e)
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
