package fr.stcg.oasis.servlets.calculation.script;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.util.Calendar;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/script/saveScript")
public class SaveScriptServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    public SaveScriptServlet() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		PrintWriter out = response.getWriter();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
								        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
								        .setPrettyPrinting()
								        .serializeNulls()
								        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
								        .excludeFieldsWithoutExposeAnnotation()
								        .create();
		
		String id = request.getParameter("id");
		HashMap<String,String> map = new HashMap<String, String>();
		String content = request.getParameter("content");
		
		if(id == null || content == null)
		{
			map.put("error", "Please enter a name");
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
			return;
		}
		
		System.out.println(id);
		System.out.println(content);
		
		try
		{
			Script script = DaoFactory.getScriptDao().findById(Integer.parseInt(id));
			
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");
			
			script.setContent(content);
			script.setLastEditor(user);
			script.setLastUpdateDate(new Date(Calendar.getInstance().getTime().getTime()));
			
			DaoFactory.getScriptDao().update(script);
			
			map.put("success", "Script successfully modified!");
			map.put("object", gson.toJson(script));
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
