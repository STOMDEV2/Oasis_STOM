package fr.stcg.oasis.servlets.mask;

import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;

@WebServlet(urlPatterns = "/workspace/mask/myMasks")
public class MyMasksServlet extends HttpServlet 
{
	private static final long serialVersionUID = 6934211670914813016L;
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		HttpSession session = request.getSession();
		User utilisateurAdmin = (User) session.getAttribute("user");
		String[] applicationCube = ((String) session.getAttribute("applicationCube")).split("\\.");
		
		try
		{
			Cube cube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
			
			ArrayList<Mask> adminsMasks = DaoFactory.getMaskDao().findMaskByUser(utilisateurAdmin.getId(), cube);
			
			request.setAttribute("masks", adminsMasks);
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
				
		request.getRequestDispatcher("/workspace/mask/myMasks.jsp").forward(request, response);
	}
}
