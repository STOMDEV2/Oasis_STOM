package com.stcg.oasis.front.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.essbase.api.base.EssException;
import com.google.gson.Gson;

import fr.stcg.oasis.essbase.Essbase;


@Controller
@RequestMapping("/login")
public class LoginController {
	
	public HashMap<String,String> form = new HashMap<String, String>();
	public Essbase essbase = null;
	
	
	/**
	 * Use to return in json format all the cube which are containing in the server specified by argument. 
	 * @param request
	 * @param response
	 * @param login
	 * @param password
	 * @param server
	 * @return
	 */
	@RequestMapping(path = "/applications", produces = "application/json", method = RequestMethod.GET) 
	@ResponseBody
	public String getApplications(HttpServletRequest request, HttpServletResponse response, @RequestParam("login") String login, @RequestParam("password") String password,  @RequestParam("server") String server)  {
		
		Gson gson = new Gson();
		String applicationsString = "";
		
		System.out.println("Server >> " + server);
		System.out.println("Server >> " + login);
		System.out.println("Server >> " + password);
		
		// get parameters in the request which are: login, server and password to start a session with the server..
		form.put("login", login);
		form.put("password", password);
		form.put("server", server);
		try {
			essbase = new Essbase( form );
			System.out.println(" is connected to essbase server " + essbase.getOlapServer().isConnected());
			applicationsString = essbase.getCubesApplicationsString(); // on initialise appsCubes			
			System.out.println( applicationsString );
		}
		catch( EssException e )
		{
			e.printStackTrace();
			System.out.print( e.getNativeCode() );
			
		}
		catch( Exception e )
		{
			e.printStackTrace();
			System.out.println("Error..");
		}
		finally
		{
		}
		
		System.out.println(applicationsString);
		// gson.toJson(applicationsString)
		return applicationsString;
	}

	
}
