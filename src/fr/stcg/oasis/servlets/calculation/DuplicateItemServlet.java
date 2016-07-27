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

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/duplicateItem")
public class DuplicateItemServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public DuplicateItemServlet() {
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
		
		Calcul newCalcul = null;
		try
		{
			if(cubeId == null || (scriptId == null && calculId == null))
				throw new Exception("Bullshit request!");
			
			System.out.println(calculId);
			System.out.println(scriptId);
			System.out.println(cubeId);
			
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");
			
			Cube cube = DaoFactory.getCubeDao().findById(Integer.parseInt(cubeId));
			
			if(scriptId != null)
			{
				Script script = DaoFactory.getScriptDao().findById(Integer.parseInt(scriptId));
				if(script == null)
					throw new Exception("Script not found!");
				
				Script duplicateScript = DaoFactory.getScriptDao().findScriptByCubeAndName(cube, script.getName());
				if(duplicateScript != null)
					throw new Exception("A script with the same name already exists in this cube!");
				
				Script newScript = new Script();
				BeanUtils.copyProperties(newScript, script);
				newScript.makeItReplicable();
					newScript.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
					newScript.setCreator(user);
					newScript.setLastEditor(null);
					newScript.setLastUpdateDate(null);
					newScript.setOrderedScripts(null);
					newScript.setCube(cube);
				newScript = DaoFactory.getScriptDao().add(newScript);
				
				map.put("object", gson.toJson(newScript));
				map.put("type", "script");
				map.put("success", "Script successfully duplicated!");
			}
			else
			{
				Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculId));
				if(calcul == null)
					throw new Exception("Calcul not found!");
				
				Calcul duplicateCalcul = DaoFactory.getCalculDao().findCalculByCubeAndName(cube, calcul.getName());
				if(duplicateCalcul != null)
					throw new Exception("A calcul with the same name already exists in this cube!");
				
				ArrayList<OrderedScript> scripts = new ArrayList<OrderedScript>(calcul.getOrderedScripts());
				
				newCalcul = new Calcul();
				BeanUtils.copyProperties(newCalcul, calcul);
				newCalcul.makeItReplicable();
					newCalcul.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
					newCalcul.setCreator(user);
					newCalcul.setLastEditor(null);
					newCalcul.setLastUpdateDate(null);
					newCalcul.setOrderedScripts(null);
					newCalcul.setVariableParameters(null);
					newCalcul.setHistoricCalculLaunch(null);
					newCalcul.setTreeSelections(null);
					newCalcul.setCube(cube);
				newCalcul = DaoFactory.getCalculDao().add(newCalcul);
				
				newCalcul.setOrderedScripts(new ArrayList<OrderedScript>());
				
				for(OrderedScript orderedScript: scripts)
				{
					orderedScript.makeItReplicable();
					
					Script script = orderedScript.getScript();
					Script duplicateScript = DaoFactory.getScriptDao().findScriptByCubeAndName(cube, script.getName());
					if(duplicateScript != null)
						throw new Exception("A script (" + script.getName() + ") that belong to the calcul you want to duplicate already exists in this cube!");

						script.setCube(cube);
					script = DaoFactory.getScriptDao().add(script);
					
					orderedScript.setCalcul(newCalcul);
					orderedScript.setScript(script);
					
					System.out.println(orderedScript.getScript().getId());
					
					orderedScript = DaoFactory.getOrderedScriptDao().add(orderedScript);
					
					newCalcul.getOrderedScripts().add(orderedScript);
				}
				
				map.put("object", gson.toJson(newCalcul));
				map.put("type", "calcul");
				map.put("success", "Calcul successfully duplicated!");
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			map.put("error", e.getMessage());
			
			if(newCalcul != null)
				try {
					DaoFactory.getCalculDao().remove(newCalcul.getId());
				} catch (Exception e1) {
					e1.printStackTrace();
				}
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
