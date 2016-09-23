package fr.stcg.oasis.servlets.grid;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.json.HeaderDimensionAdapter;

@WebServlet("/workspace/grid/createGrid")
public class CreateGridServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

    public CreateGridServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		List<Mask> masks = null;
		
		try
		{
			masks = DaoFactory.getMaskDao().findAll();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		request.setAttribute("masks", masks);
		
		request.getRequestDispatcher("/workspace/grid/createGrid.jsp").forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		String gridName = request.getParameter("name");
		String maskIdString = request.getParameter("mask");
		
		if(gridName == null || maskIdString == null)
		{
			response.sendRedirect(request.getContextPath() + "/workspace/displayMask");
			return;
		}


		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new GsonBuilder().registerTypeAdapter(HeaderDimension.class, new HeaderDimensionAdapter()).create();
		
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		String[] applicationCube = ((String)session.getAttribute("applicationCube")).split("\\.");
		Cube cube = null;
		Mask mask = null;
		try
		{
			cube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
			mask = DaoFactory.getMaskDao().findById(Integer.parseInt(maskIdString));
		
		
			Grid grid = new Grid();
				grid.setCreator(user);
				grid.setCube(cube);
				grid.setMask(mask);
				grid.setName(gridName);
				grid.setCreationDate(new Date(Calendar.getInstance().getTime().getTime()));
				grid = DaoFactory.getGridDao().add(grid);
			
//			Enumeration keys = request.getParameterNames();
//			while (keys.hasMoreElements())
//			{
//				String key = (String)keys.nextElement();
//				System.out.println(key);
//		  
//				if(key.indexOf("scenario_") == -1)
//					continue;
//				
//				//To retrieve a single value
//				String value = request.getParameter(key);
//				System.out.println(value);
//				
//				ScenarioParameter param = new ScenarioParameter();
//				
//				String[] keySplitted = key.split("_");
//				if(keySplitted[1].equals("columns"))
//				{
//					ColumnDimension dimension = null;
//					dimension = DaoFactory.getColumnDimensionDao().findById(Integer.parseInt(keySplitted[2]));
//					
//					param.setColumnDimension(dimension);
//				}
//				else if(keySplitted[1].equals("rows"))
//				{
//					RowDimension dimension = null;
//					dimension = DaoFactory.getRowDimensionDao().findById(Integer.parseInt(keySplitted[2]));
//					
//					param.setRowDimension(dimension);
//				}
//				
//				param.setValue(value);
//				param.setGrid(grid);
//				DaoFactory.getScenarioParametersDao().add(param);
//			}
		
			response.sendRedirect(request.getContextPath() + "/workspace/grid/displayGrid?id=" + grid.getId());
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		catch (NumberFormatException e)
		{
			e.printStackTrace();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}