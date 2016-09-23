package fr.stcg.oasis.servlets.grid;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.objetMetier.MaskToGrid;

@WebServlet("/workspace/grid/getGridValues")
public class GetGridValuesServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

    public GetGridValuesServlet() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new Gson();
		
		try
		{
			String gridIdString = request.getParameter("id");
			HttpSession session = request.getSession();
			
			Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdString));
			
			HashMap<String, String> form = (HashMap<String, String>) session.getAttribute("form");
			String select = (String) session.getAttribute("applicationCube");
			String[] applicationCube = select.split("\\.");
			
			String[][] gridValues = MaskToGrid.maskToGrid(grid, form, applicationCube[0], applicationCube[1]);
			
			map.put("gridValues", gson.toJson(gridValues));
			map.put("success", "Updating values!");
		}
		catch (Exception e)
		{
			e.printStackTrace();
			
			map.put("error", "Error retrieving data! Try again later!");
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		out.write(gson.toJson(map));
		out.flush();
		out.close();
	}
}
