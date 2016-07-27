package fr.stcg.oasis.servlets.mask;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.json.BackJSONToObject;
import fr.stcg.oasis.objetMetier.MaskToGrid;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/mask/updatePreview")
public class UpdatePreviewGridServlet extends HttpServlet{
	

	private static final long serialVersionUID = 1L;

	public UpdatePreviewGridServlet()
	{
		super();
	}
	
	@Override
	protected void doPost(HttpServletRequest request , HttpServletResponse response) throws ServletException, IOException  
	{
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		PrintWriter out = response.getWriter();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
		        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
		        .serializeNulls()
		        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
		        .excludeFieldsWithoutExposeAnnotation()
		        .create();
		HttpSession session = request.getSession();
		HashMap<String, Object> map = new HashMap<String, Object>();
		
		try
		{
			HashMap<String,String> form = (HashMap<String, String>) session.getAttribute("form");
			String select = (String) session.getAttribute("applicationCube");
			String[] applicationCube = select.split("\\.");
			String maskString = request.getParameter("mask");
			
			String dataJSON = request.getParameter("mask");
			JsonParser parser = new JsonParser();
			JsonObject maskJSON = (JsonObject) parser.parse(dataJSON);
			
			Mask mask = BackJSONToObject.getMaskFromJSON(maskJSON);
			
			String[][] gridValues = MaskToGrid.maskToGrid(mask, form, applicationCube[0], applicationCube[1]);
			
			map.put("gridValues", gson.toJson(gridValues) );
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
			
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		
		
		
		
		
		
	}

}
