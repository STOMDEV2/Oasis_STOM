package fr.stcg.oasis.servlets.calculation;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.dao.DaoFactory;

@WebServlet("/workspace/calcul/myCalculs")
public class MyCalculsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public MyCalculsServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			List<Cube> cubes = DaoFactory.getCubeDao().findAll();
			
			request.setAttribute("data", cubes);
			
			request.getRequestDispatcher("/workspace/calculation/myCalculations.jsp").forward(request, response);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
