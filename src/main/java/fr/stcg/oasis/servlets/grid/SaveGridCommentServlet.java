package fr.stcg.oasis.servlets.grid;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.dao.DaoFactory;


@WebServlet("/workspace/grid/saveGridComment")
public class SaveGridCommentServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

    public SaveGridCommentServlet() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String comment = request.getParameter("gridComment");
		String gridIdString = request.getParameter("id");
		
		
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements())
		{
			String paramName = parameterNames.nextElement();

			String[] paramValues = request.getParameterValues(paramName);
			for (int i = 0; i < paramValues.length; i++)
			{
				String paramValue = paramValues[i];
				System.out.println(paramName + " " + paramValue);
			}
		}
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new Gson();
		
		try
		{
			Grid grid = DaoFactory.getGridDao().findById(Integer.parseInt(gridIdString));
			
			grid.setComment(comment);
			
			DaoFactory.getGridDao().update(grid);
			
			map.put("success", "Comment successfully saved");
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
			map.put("error", e.getMessage() );
		}
		finally
		{
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
			
		
		
	}
}
