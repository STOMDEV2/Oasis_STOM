package fr.stcg.oasis.servlets.grid;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;

@WebServlet("/workspace/myGrids")
public class MyGridsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public MyGridsServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		List<Grid> grids = null;
		List<Mask> masks = null;
		
		try {
			grids = DaoFactory.getGridDao().findGridsByUser(user.getId());
			masks = DaoFactory.getMaskDao().findAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		request.setAttribute("grids", grids);
		request.setAttribute("masks", masks);
		
		request.getRequestDispatcher("/workspace/grid/myGrids.jsp").forward(request, response);
	}
}
