package fr.stcg.oasis.servlets.calculation;

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

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/modifyCalcul")
public class ModifyCalculServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ModifyCalculServlet() {
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
		String newName = request.getParameter("name").trim();
		
		try
		{
			if(id == null || newName == null)
				throw new Exception("Bullshit request!");
			
			if(newName.isEmpty())
				throw new Exception("Please enter a name!");
			
			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(id));
			if(calcul == null)
				throw new Exception("Calcul not found!");
			
			Calcul duplicateCalcul = DaoFactory.getCalculDao().findCalculByCubeAndName(calcul.getCube(), newName);
			if(duplicateCalcul != null)
				throw new Exception("A calcul with the same name already exists in this cube!");
			
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");
			
			calcul.setName(newName);
			calcul.setLastEditor(user);
			calcul.setLastUpdateDate(new Date(Calendar.getInstance().getTime().getTime()));
			DaoFactory.getCalculDao().update(calcul);
			
			map.put("success", "Calcul successfully updated!");
			map.put("object", gson.toJson(calcul));
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
