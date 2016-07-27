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
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/createCalcul")
public class CreateCalculServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public CreateCalculServlet() {
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
		
		String calculName = request.getParameter("name").trim();
		String cubeIdString = request.getParameter("cubeId");
		
		try
		{
			if(calculName == null || calculName.isEmpty())
				throw new Exception("Please enter a name");
			
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute("user");
		
			Cube cube = DaoFactory.getCubeDao().findById(Integer.parseInt(cubeIdString));
			
			Calcul calcul = DaoFactory.getCalculDao().findCalculByCubeAndName(cube, calculName);
			if(calcul != null)
				throw new Exception("A calcul with the same name already exists in this cube!");
			
			calcul = new Calcul();
				calcul.setName(calculName);
				calcul.setCreator(user);
				calcul.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
				calcul.setCube(cube);
			calcul = DaoFactory.getCalculDao().add(calcul);
			
			map.put("success", "Calcul successfully saved!");
			map.put("object", gson.toJson(calcul));
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
