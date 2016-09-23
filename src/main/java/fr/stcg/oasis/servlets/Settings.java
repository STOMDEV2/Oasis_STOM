package fr.stcg.oasis.servlets;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Variable;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.json.VariableAdapter;

@WebServlet("/workspace/settings")
public class Settings extends HttpServlet
{
	private static final long serialVersionUID = -4675201700266687077L;
	
	private static final String VUE = "/workspace/settings.jsp";
	

	@SuppressWarnings("unchecked")
	@Override public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		HttpSession session = request.getSession();
		
		Cube cube = (Cube) session.getAttribute("cube");
		
		String action = request.getParameter("action");
		Gson gson = new GsonBuilder().registerTypeAdapter(Variable.class, new VariableAdapter() ).create();
		PrintWriter out = response.getWriter();
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		if(action != null) 
		{
			if( "getDimensions".equals(action) ) 
			{
				ArrayList<String> dimensions = null;
				dimensions = (ArrayList<String>) session.getAttribute("dimensions"); // unchecked cast, chercher pk 
				HashMap<String,Object> output = new HashMap<String, Object>();
				
				output.put("dimensions", dimensions);
				out.write(gson.toJson(output));
			} 
			else if( "getVariables".equals(action) )
			{
				HashMap<String,Object> output = new HashMap<String, Object>();
				ArrayList<Variable> variables = null;
				variables = DaoFactory.getVariableDao().findVariablesByCube(cube);
				
				output.put("variables", variables);
				out.write(gson.toJson(output));
			}
			else if ( "getIdCube".equals(action) )
			{
				
				HashMap<String, Integer> output = new HashMap<>();
				
				output.put("idCube", cube.getId());
				out.write(gson.toJson(output));
			}
			
		}
		else
		{
			this.getServletContext().getRequestDispatcher(VUE).forward(request, response);
		}
	}
	
	
	@Override protected void doPost(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		PrintWriter out = response.getWriter();
		String action = request.getParameter("action");
		HashMap<String,Object> output = new HashMap<String, Object>();
		
		Gson gson = new GsonBuilder().registerTypeAdapter(Variable.class, new VariableAdapter()).create();
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		try
		{
			if(action != null)
			{
				if("saveDimensionsVars".equals(action))
				{
					String json = request.getParameter("data");
					System.out.println(json);
					JsonParser parser = new JsonParser();
				    JsonArray jArray = parser.parse(json).getAsJsonArray();
				    
				    int nbVar = 0, nbVarDuplicated = 0;
				   
				    ArrayList<Variable> variables = new ArrayList<Variable>();
				    ArrayList<Variable> varsNotSaved = new ArrayList<Variable>();
				    ArrayList<String> errors = new ArrayList<String>();
				    String varsSaved = "", nameVarToAdd = null , varDuplicated = "";
				    
				    System.out.println("size variables " + variables.size());
				    
				    for(JsonElement obj : jArray)
				    {
				        Variable varToAdd = gson.fromJson(obj, Variable.class);
				        nameVarToAdd = varToAdd.getName();
				        
						try
						{
					        DaoFactory.getVariableDao().add(varToAdd);
					        variables.add(varToAdd);
					        System.out.println("varToAdd " + nameVarToAdd);
					        //Efzezez
				        	varsSaved += nameVarToAdd + ", ";
					        
					        nbVar += 1;
						}
				        catch(Exception e)
						{
							e.printStackTrace();
							
							if(e.getMessage().indexOf("Duplicate") > 0)
							{
								varDuplicated += nameVarToAdd + ", ";
									
								nbVarDuplicated += 1;
							}
							
							varsNotSaved.add(varToAdd);
							errors.add(e.getMessage());
						}
				    }

				    if(varsSaved.length() > ", ".length())
				    	varsSaved = varsSaved.substring(0, varsSaved.length() - ", ".length());
				    if(varDuplicated.length() > ", ".length())
				    	varDuplicated = varDuplicated.substring(0, varDuplicated.length() - ", ".length());
				    
				    String message = null, duplicated = null;
					
				    if(nbVar > 1 || nbVar == 1)
				    	message = varsSaved;
				    
				    if(nbVarDuplicated > 1 || nbVarDuplicated == 1)
				    	duplicated = varDuplicated;
				    
				    System.out.println("saved " + message);
				    output.put("saved", message);
				    System.out.println("variables " + variables);
				    output.put("variables", variables);
				    
				    if(!varsNotSaved.isEmpty())
				    {
				    	output.put("unsaved", varsNotSaved);
				    	System.out.println("unsaved " + varsNotSaved);
				    }
				    
				    if(!errors.isEmpty())
				    {
				    	output.put("error", errors);
				    	System.out.println("errors " + errors);
				    }
				    
				    if( nbVarDuplicated > 0 )
				    {
				    	output.put("duplicated", duplicated);
				    } 
				 }
				 else if( "removeVar".equals(action) )
				 {
						String json = request.getParameter("data");
						System.out.println("json" + json);
						JsonParser parser = new JsonParser();
					    JsonArray jArray = parser.parse(json).getAsJsonArray();
					    
						for( JsonElement obj : jArray )
					    {
					        Variable varToDelete = gson.fromJson( obj , Variable.class);
					        String nameVar = varToDelete.getName();
					        System.out.println("vtd" + varToDelete.toString());
					        
					        try {
					        	
								DaoFactory.getVariableDao().remove(varToDelete.getId());
								
								String message = nameVar;
								output.put("message", message);
								
							} catch (Exception e) {
								
								e.printStackTrace();
							}
					    }
						
				 }
				 else if( "modifyVars".equals(action))
				 {
						String json = request.getParameter("data");
						
						System.out.println("modifyVars JSON " + json);
						ArrayList<Variable> variablesModified = new ArrayList<Variable>();
						JsonParser parser = new JsonParser();
					    JsonArray jArray = parser.parse(json).getAsJsonArray();
	
					    String varsModified = "";
					    
						for( JsonElement obj : jArray )
					    {   // the variable here is received with the right id but name' or base's values are to update in database
					        Variable varToModify = gson.fromJson( obj , Variable.class);
					        
					        System.out.println("vtm " + varToModify.toString());
					        
					        try {
					        	
					        	Variable initialVar = DaoFactory.getVariableDao().findById(varToModify.getId());
					        	
					        	System.out.println("iv ante " + initialVar.toString());
					        	
					        	if( !initialVar.getName().equals( varToModify.getName() ) )
					        	{
					        		initialVar.setName(varToModify.getName());
					        	}
					        	
					        	DaoFactory.getVariableDao().update(initialVar);
								
								variablesModified.add(initialVar);
								
								System.out.println("iv post " + initialVar.toString());
								
								varsModified += initialVar.getName() + ", ";
								
							} catch (Exception e) {
								
								e.printStackTrace();
							}
					    }
						
					    if(varsModified.length() > ", ".length())
					    	varsModified = varsModified.substring(0, varsModified.length() - ", ".length());
					    
//						String message = "Mise à jour : " + varsModified + '.';
						
						output.put("saved", varsModified);
						output.put("variables", variablesModified);
						
	
				 }
			}
		}
		finally
		{
			String outputString = gson.toJson(output);
			System.out.println("output " + outputString);
			out.write(outputString);
			
			out.flush();
			out.close();
		}
	}
}