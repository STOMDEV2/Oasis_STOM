package fr.stcg.oasis.servlets.calculation;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.jstl.core.Config;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.HistoricCalculLaunch;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.GsonDateAdapter;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/calcul/getHistoricCalculLaunch")
public class GetHistoricCalculLaunchServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public GetHistoricCalculLaunchServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String actionParameter = request.getParameter("action");
		try
		{
			if(actionParameter != null && actionParameter.equals("getData"))
			{
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.setHeader("Cache-Control", "no-cache");

				Locale locale = (Locale)Config.get(request.getSession(), Config.FMT_LOCALE);
				
				PrintWriter out = response.getWriter();
				HashMap<String,String> map = new HashMap<String, String>();
				Gson gson = new GsonBuilder().disableHtmlEscaping()
									        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
									        .setPrettyPrinting()
									        .serializeNulls()
									        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
									        .registerTypeAdapter(HistoricCalculLaunch.class, new GsonDateAdapter(locale))
									        .excludeFieldsWithoutExposeAnnotation()
									        .create();
				
				List<HistoricCalculLaunch> historicCalculLaunchs = DaoFactory.getHistoricCalculLaunchDao().findAll();
				for(HistoricCalculLaunch hcl: historicCalculLaunchs)
				{
					Calendar dateBeginCalendar = Calendar.getInstance();
					dateBeginCalendar.setTimeInMillis(hcl.getDateBegin().getTime() + hcl.getTimeBegin().getTime());
					
					Calendar dateEndCalendar = Calendar.getInstance();
					dateEndCalendar.setTimeInMillis(hcl.getDateEnd().getTime() + hcl.getTimeEnd().getTime());
					
					long duration = dateEndCalendar.getTime().getTime() - dateBeginCalendar.getTime().getTime();
					
					int secondsNumber = (int)(duration / 1000);
					
					int hour = secondsNumber / 3600;
					int minutes = (secondsNumber % 3600) / 60;
					int seconds = (secondsNumber % 3600) % 60;
					
					hcl.setDuration(hour + "h " + minutes + "min " + seconds + "s");
				}
				
				map.put("object", gson.toJson(historicCalculLaunchs));
				
				out.write(gson.toJson(map));
				out.flush();
				out.close();				
			}
			else
			{
				request.getRequestDispatcher("/workspace/calculation/historicCalculLaunch.jsp").forward(request, response);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
