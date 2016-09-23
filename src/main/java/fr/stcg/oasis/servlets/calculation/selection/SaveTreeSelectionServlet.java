package fr.stcg.oasis.servlets.calculation.selection;

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
import fr.stcg.oasis.beans.TreeSelection;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/selection/saveTreeSelection")
public class SaveTreeSelectionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public SaveTreeSelectionServlet() {
        super();
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");

//		Enumeration<String> parameterNames = request.getParameterNames();
//		while (parameterNames.hasMoreElements())
//		{
//			String paramName = parameterNames.nextElement();
//
//			String[] paramValues = request.getParameterValues(paramName);
//			for (int i = 0; i < paramValues.length; i++) {
//				String paramValue = paramValues[i];
//				System.out.println(paramName + " " + paramValue);
//			}
//		}
		
		String dataStringified = request.getParameter("data");
		String name = request.getParameter("name");
		String calculIdStringified = request.getParameter("id");
		
		System.out.println(dataStringified);
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
								        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
								        .setPrettyPrinting()
								        .serializeNulls()
								        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
								        .excludeFieldsWithoutExposeAnnotation()
								        .create();
		
		try
		{
			Calcul calcul = DaoFactory.getCalculDao().findById(Integer.parseInt(calculIdStringified));
			
			TreeSelection treeSelection = new TreeSelection();
				treeSelection.setCalcul(calcul);
				treeSelection.setMembers(dataStringified);
				treeSelection.setName(name);
			treeSelection = DaoFactory.getTreeSelectionDao().add(treeSelection);
			
			map.put("success", "Selection successfully launched!");
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
