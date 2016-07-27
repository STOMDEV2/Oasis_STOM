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
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/getCalcul")
public class GetCalculServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public GetCalculServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
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
		
		String calculId = request.getParameter("id");
		
		if(calculId == null)
		{
			map.put("error", "Bullshit request");
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
			return;
		}
		
		System.out.println(calculId);
		
		try
		{
			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculId));
			
			map.put("object", gson.toJson(calcul));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", "An error occured during the retrieve. Try again later!");
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}	

	}
}
