package fr.stcg.oasis.servlets;


import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.mysql.jdbc.exceptions.MySQLIntegrityConstraintViolationException;

import fr.stcg.oasis.beans.Profile;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.dao.ProfileDao;
import fr.stcg.oasis.objetMetier.FormGestionUtilisateur;


@WebServlet("/workspace/gestionUtilisateur")
public class GestionUtilisateur extends HttpServlet {
	

	
	
	private static final long serialVersionUID = -8141638906732795953L;
	
	private ArrayList<String> getAllLogins() throws Exception 
	{
		ArrayList<String> logins = new ArrayList<String>();
		
		for(User user: DaoFactory.getUserDao().findAll())
		{
			logins.add(user.getLogin());
		}
		
		return logins;
	}

	@Override public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{	
		String action = request.getParameter("action");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		HashMap<String,ArrayList<String>> dataJSON = new HashMap<String, ArrayList<String>>();
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		if("getUsersLogins".equals(action))
		{
			try
			{
				dataJSON.put("usersLogins", getAllLogins());
				out.write(gson.toJson(dataJSON));
				out.flush();
				out.close();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}
		else
		{	
			try {
				request.setAttribute("profiles", DaoFactory.getProfileDao().findAll());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			this.getServletContext().getRequestDispatcher("/workspace/gestionUtilisateur.jsp").forward(request, response);
			
		}
		
	}
	
	
	@Override protected void doPost(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		/* Préparation de l'objet formulaire (objet metier) */
		FormGestionUtilisateur form = new FormGestionUtilisateur();
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		HashMap<String,String> messageJSON = new HashMap<String, String>();
		String action = request.getParameter("action");
		String message = null;
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		try
		{
			
			
			// Bouton == Ajouter
			if ("add".equals(action)) {
				message = form.AjouteUtilisateur(request);
				messageJSON.put("message",message);
				out.write(gson.toJson(messageJSON));
				
			}
			else if("delete".equals(action))
			{
				message = form.supprimerUtilisateur(request);
				messageJSON.put("message", message);
				out.write(gson.toJson(messageJSON));
			}
			else if("isUser".equals(action)) 
			{
				User user = form.isUser(request);
				
				if(user != null)
				{
					messageJSON.put("message", "OK");
					out.write(gson.toJson(messageJSON));
				}
			}
			else if("modify".equals(action))
			{
				messageJSON.putAll(form.modifierUtilisateur(request));
				out.write(gson.toJson(messageJSON));
			}

		}
		catch(MySQLIntegrityConstraintViolationException e)
		{
			
			e.printStackTrace();
			messageJSON.put("erreur",form.getError(e));
			out.write(gson.toJson(messageJSON));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			messageJSON.put("erreur",e.getMessage());
			out.write(gson.toJson(messageJSON));
			
		}
		finally
		{
			out.flush();
			out.close();
		}

	}	
	
	
}
