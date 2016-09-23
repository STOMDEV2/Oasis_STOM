package fr.stcg.oasis.servlets;

import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import fr.stcg.oasis.beans.User;

@WebServlet("/workspace/workspace")
public class Workspace extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	@Override public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{	
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		
		HttpSession session = request.getSession();
		HashMap<String, String> output = new HashMap<String, String>();
		String action = request.getParameter("action");
		
		
		User user = (User) session.getAttribute("user");
		String appliCube = (String) session.getAttribute("applicationCube");
		
		if(action!=null)
		{
			if("getInfos".equals(action))
			{
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.setHeader("Cache-Control", "no-cache");
			
				output.put("appliCube", appliCube );
				output.put("login", user.getLogin());
				output.put("name", user.getName());
				output.put("firstname", user.getFirstname());
			 
			}
			
			
			out.write(gson.toJson(output));
			out.flush();
			out.close();
		}
		else
		{
			this.getServletContext().getRequestDispatcher("/workspace/workspace.jsp").forward(request, response);
		}
	}
}
