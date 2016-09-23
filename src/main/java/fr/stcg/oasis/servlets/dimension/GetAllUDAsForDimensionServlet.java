package fr.stcg.oasis.servlets.dimension;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.essbase.api.datasource.IEssCube;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.essbase.Essbase;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@WebServlet("/workspace/dimension/getAllUDAsForDimension")
public class GetAllUDAsForDimensionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public GetAllUDAsForDimensionServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		PrintWriter out = response.getWriter();
		HashMap<String,String> map = new HashMap<String, String>();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
								        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
								        .setPrettyPrinting()
								        .serializeNulls()
								        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
								        .excludeFieldsWithoutExposeAnnotation()
								        .create();
		
		HttpSession session = request.getSession();
		HashMap<String, String> form = (HashMap<String, String>) session.getAttribute("form");
		String select = (String) session.getAttribute("applicationCube");
		String[] applicationCube = select.split("\\.");
		
		Essbase essbase = null;
		
		try
		{
			essbase = new Essbase(form);
			
			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationCube[0], applicationCube[1]);
			
			ArrayList<String> infos = essbase.getAllUDAs(cube);
			
			map.put("object", gson.toJson(infos));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			map.put("error", "An error occured during the save. Try again later!");
		}
		finally
		{
			essbase.disconnectServer();
			
			out.write(gson.toJson(map));
			out.flush();
			out.close();
		}
	}
}