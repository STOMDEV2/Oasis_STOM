package fr.stcg.oasis.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/workspace/logout")
public class LogoutServlet extends HttpServlet 
{
	private static final long serialVersionUID = 4991345827022994663L;
	public static final String HOME_PAGE = "/login";

    public void doGet( HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException
    {
        /* Récupération et destruction de la session en cours */
        HttpSession session = request.getSession();
        
        session.invalidate();

        /* Redirection vers page d'accueil ! */
        response.sendRedirect(request.getContextPath() + HOME_PAGE);
    }
}
