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

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/script/createScript")
public class CreateScriptServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
      
    public CreateScriptServlet() {
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
		
		String name = request.getParameter("name").trim();
		String cubeIdString = request.getParameter("cubeId");
		
		try
		{
			if(name == null || name.isEmpty())
				throw new Exception("Please enter a name!");
			
			System.out.println(name);
		
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");

			Cube cube = DaoFactory.getCubeDao().findById(Integer.parseInt(cubeIdString));
			
			Script script = DaoFactory.getScriptDao().findScriptByCubeAndName(cube, name);
			if(script != null)
				throw new Exception("A script with the same name already exists in this cube!");
			
			script = new Script();
				script.setName(name);
				script.setCreator(user);
				script.setCube(cube);
				script.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
			
			script = DaoFactory.getScriptDao().add(script);
			
			map.put("success", "Script successfully created!");
			map.put("object", gson.toJson(script));
		}
		catch(Exception e)
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
