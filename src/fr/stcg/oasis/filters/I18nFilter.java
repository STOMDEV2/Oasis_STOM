package fr.stcg.oasis.filters;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.jstl.core.Config;

@WebFilter("/*")
public class I18nFilter implements Filter {

    public I18nFilter() {
    }

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException
	{
		HttpServletRequest req = (HttpServletRequest)request;
		Locale locale = (Locale)Config.get(req.getSession(), Config.FMT_LOCALE);
		
		if(locale == null)
		{
			String cookieName = "locale";
					
			Cookie[] cookies = req.getCookies();
			if (cookies != null)
			{
			    for(int i=0; i<cookies.length; i++) 
			    {
			        Cookie cookie = cookies[i];
			        if (cookieName.equals(cookie.getName())) 
			        {
			        	System.out.println(cookie.getValue());
			        	
			            Config.set(req.getSession(), Config.FMT_LOCALE, new Locale(cookie.getValue()));
			        }
			    }
			} 
		}
		
		chain.doFilter(request, response);
	}

	public void init(FilterConfig fConfig) throws ServletException
	{
		
	}
}
