package fr.stcg.oasis.utility;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;

import fr.stcg.oasis.beans.Mask;

public class Servlet {

	public static void setCookie(HttpServletResponse response, String nom,
			String valeur, int maxAge) {
		Cookie cookie = new Cookie(nom, valeur);
		cookie.setMaxAge(maxAge);
		response.addCookie(cookie);
	}

	public static String getCookieValue(HttpServletRequest request, String nom) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie != null && nom.equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}

	public static HashMap<String, String> JSONToHashMapStringString(
			HttpServletRequest request) throws java.io.IOException {
		Gson gson = new Gson();

		BufferedReader br = new BufferedReader(new InputStreamReader(
				request.getInputStream()));
		String json = "";
		if (br != null) {
			json = br.readLine();
		}

		Type stringStringMap = new TypeToken<HashMap<String, String>>() {
		}.getType();

		return gson.fromJson(json, stringStringMap);
	}

	public static Object getObjectFromJSON(HttpServletRequest request)
			throws java.io.IOException, ClassNotFoundException {

		Gson gson = new Gson();
		BufferedReader br = new BufferedReader(new InputStreamReader(
				request.getInputStream()));
		
		
		String typeObject = "beans.";

		if (br != null) 
		{
			String json = br.readLine().trim();
			JsonReader reader = new JsonReader(br);
			boolean toBreak = false;
			reader.beginArray();

			while (reader.hasNext()) {
				reader.beginObject();

				while (reader.hasNext()) {
					String keyName = reader.nextName();
					if (keyName.equals("className")) {
						
						typeObject += reader.nextString();
						toBreak = true;
						
					} else {

						reader.skipValue();
					}
				}
				
				if(toBreak)
				{
					break;
				}

				reader.endObject();
			}

			reader.endArray();
			
			reader.close();
			
			Class<?> clazz = (Class<?>) Class.forName("com.google.gson.reflect.TypeToken<java.util.ArrayList<" + typeObject + ">>");
			
			try {
				return gson.fromJson(json, clazz.newInstance().getClass());
			} catch (JsonSyntaxException | InstantiationException
					| IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		return null;

	}
	
	
		    
	public static Mask getMaskFromJSON(HttpServletRequest request)
			throws java.io.IOException {
		Gson gson = new Gson();
		BufferedReader br = new BufferedReader(new InputStreamReader(
				request.getInputStream()));
		String json = "";
		if (br != null) {
			json = br.readLine();
		}

		return gson.fromJson(json, Mask.class);
	}

	public static String getValeurChamp(HttpServletRequest request,
			String nomChamp) {
		String valeur = request.getParameter(nomChamp);

		if (valeur == null || valeur.trim().length() == 0) {
			return null;
		} else {
			return valeur;
		}
	}

}
