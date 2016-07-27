package fr.stcg.oasis.servlets.grid;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;

@WebServlet("/workspace/grid/removeGrid")
public class RemoveGridServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public RemoveGridServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String gridIdString = (String)request.getParameter("id");
		
		System.out.println(gridIdString);
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");		//	FOR FUTURE SECUTRITY ACCESS CHECKS
		
		try {
			Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdString));
			
			
			
			if(grid == null)
			{
				response.sendRedirect(request.getContextPath() + "/workspace/myGrids");
				return;
			}
			
			DaoFactory.getGridDao().remove(grid.getId());
			
			response.sendRedirect(request.getContextPath() + "/workspace/myGrids");
			return;
		}
		catch (NumberFormatException e)
		{
			e.printStackTrace();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		response.sendRedirect(request.getContextPath() + "/workspace/myGrids");
		return;
	}
}
