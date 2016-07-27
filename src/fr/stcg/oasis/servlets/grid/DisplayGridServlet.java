package fr.stcg.oasis.servlets.grid;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/grid/displayGrid")
public class DisplayGridServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public DisplayGridServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String gridIdString = request.getParameter("id");
		
		if(gridIdString == null)
		{
			response.sendRedirect(request.getContextPath() + "/workspace/displayMask");
			return;
		}
		
		Grid grid = null;
		try {
			grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdString));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Gson gson = new GsonBuilder().disableHtmlEscaping()
		        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
		        .setPrettyPrinting()
		        .serializeNulls()
		        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
		        .excludeFieldsWithoutExposeAnnotation()
		        .create();
		
		request.setAttribute("grid", gson.toJson(grid));
		
		request.getRequestDispatcher("/workspace/grid/displayGrid.jsp").forward(request, response);
	}
}
