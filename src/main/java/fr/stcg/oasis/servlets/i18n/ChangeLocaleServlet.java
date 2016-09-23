package fr.stcg.oasis.servlets.i18n;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.jstl.core.Config;

@WebServlet("/changeLocale")
public class ChangeLocaleServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ChangeLocaleServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String localeParameter = (String)request.getParameter("loc");
		
		System.out.println(localeParameter);
		
		Locale locale = null;
		
		switch(localeParameter)
		{
			case "fr":
				locale = Locale.FRENCH;
				break;
			case "en":
				locale = Locale.ENGLISH;
				break;
			default:
				break;
		}
		
		Config.set(request.getSession(), Config.FMT_LOCALE, locale);
		
		Cookie cookie = new Cookie("locale", locale.toString());
		cookie.setMaxAge(60*60*24*365); //Store cookie for 1 year
		response.addCookie(cookie);
		
//		Locale locale = new Locale.Builder().setLanguage("en").setRegion("US").build();
//		Locale.setDefault(locale);
		
		String referer = request.getHeader("Referer");
		
		System.out.println(referer);
		
		System.out.println("CC" + Locale.getDefault());
		
		String finalURL = response.encodeRedirectURL(referer + (referer.indexOf("getCurrentInfos") >= 0 ? "" : "?getCurrentInfos"));
		System.out.println(finalURL);
		response.sendRedirect(finalURL);
	}
}
