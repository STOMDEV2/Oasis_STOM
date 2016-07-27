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

import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/script/removeScript")
public class RemoveScriptServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public RemoveScriptServlet() {
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
		
		String id = request.getParameter("id");
		
		try
		{
			Script script = DaoFactory.getScriptDao().findById(Integer.parseInt(id));
			
			if(script == null)
			{
				map.put("error", "Script not found!");
				
				out.write(gson.toJson(map));
				out.flush();
				out.close();
				return;
			}
			
			DaoFactory.getScriptDao().remove(script.getId());
			
			map.put("success", "Script successfully removed!");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", "An error occured during the remove. Try again later.");
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}
