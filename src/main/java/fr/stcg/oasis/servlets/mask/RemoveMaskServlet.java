package fr.stcg.oasis.servlets.mask;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.dao.DaoFactory;

@WebServlet("/workspace/mask/removeMask")
public class RemoveMaskServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public RemoveMaskServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String maskIdString = request.getParameter("id");
		
		if(maskIdString == null)
		{
			response.sendRedirect(request.getContextPath() + "/workspace/mask/myMasks");
			return;
		}
		
		try
		{
			Mask maskToRemove = DaoFactory.getMaskDao().findById(Integer.parseInt(maskIdString));
			
			DaoFactory.getMaskDao().remove(maskToRemove.getId());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		response.sendRedirect(request.getContextPath() + "/workspace/mask/myMasks");
	}
}
