package fr.stcg.oasis.servlets.i18n;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.jstl.core.Config;

import com.google.gson.Gson;

@WebServlet("/GetInternationalizedMessage")
public class GetInternationalizedMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;
      
    public GetInternationalizedMessage() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String key = (String)request.getParameter("key");
		String pckg = (String)request.getParameter("pckg");
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new Gson();
		
		Locale currentLocale = (Locale)Config.get(request.getSession(), Config.FMT_LOCALE);
		
		if(currentLocale == null)
		{
	    	String cookieName = "locale";
	    	Cookie[] cookies = request.getCookies();
	    	
	    	boolean hasLocaleBeenSet = false;
	    	
	    	if (cookies != null) 
	    	{
	    	    for(int i=0; i<cookies.length; i++) 
	    	    {
	    	        Cookie cookie = cookies[i];
	    	        if (cookieName.equals(cookie.getName())) 
	    	        {
	    	        	Config.set(request.getSession(), Config.FMT_LOCALE, cookie.getValue());
	    	        	
	    	        	hasLocaleBeenSet = true;
	    	        }
	    	    }
	    	}
	    	
	    	if(!hasLocaleBeenSet)
	    		Config.set(request.getSession(), Config.FMT_LOCALE, Locale.ENGLISH);
		}
		
		currentLocale = (Locale)Config.get(request.getSession(), Config.FMT_LOCALE);
		
		System.out.println(currentLocale.getDisplayName());
		
		ResourceBundle labels = ResourceBundle.getBundle("fr.stcg.oasis.i18n." + pckg + "." + pckg, currentLocale);
		
		String message = labels.getString(key);
		map.put("message", message);
		
		System.out.println(message);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		out.write(gson.toJson(map));
		out.flush();
		out.close();
	}
}
