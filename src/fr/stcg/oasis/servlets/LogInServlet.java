package fr.stcg.oasis.servlets;

import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.hibernate.exception.ConstraintViolationException;

import com.essbase.api.base.EssException;
import com.essbase.api.datasource.IEssCube;
import com.essbase.api.metadata.IEssMemberSelection;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.Member;
import fr.stcg.oasis.beans.Profile;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.beans.Variable;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.essbase.Essbase;
import fr.stcg.oasis.json.VariableAdapter;
import fr.stcg.oasis.objetMetier.DimensionMetier;
import fr.stcg.oasis.utility.Servlet;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;


@WebServlet("/login")
public class LogInServlet extends HttpServlet
{
	private static final long serialVersionUID = -4675201700266687077L;
	
	private static final String ATT_SESSION_USER = "user";
	private static final String HOME_PAGE = "/workspace/workspace.jsp";
	private static final String PAGE = "Home";
	private static final String COOKIE_CREDENTIALS = "saveCredentials";
	private static final int COOKIE_MAX_AGE = 60*60*24*365;
	private static final String VUE = "/connexion.jsp";

	@Override public void doGet(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{	
		
		HttpSession session = request.getSession();
		String action = request.getParameter("action");
		PrintWriter out = response.getWriter();
		
		
		if (session.getAttribute(ATT_SESSION_USER) != null) 
		{
			response.sendRedirect(request.getContextPath() + HOME_PAGE);
			return;
		}	
		
		System.out.println("myAction " + action);
		 
		
		if(action != null)
		{
			if("load".equals(action))
			{
				String credentialString = fr.stcg.oasis.utility.Servlet.getCookieValue(request, COOKIE_CREDENTIALS);
				
				if(credentialString != null)
				{
					String[] credentials = credentialString.split("_");
					HashMap<String,String[]> credentialJSON = new HashMap<String, String[]>();
					credentialJSON.put("credentials", credentials);
					
					
					for(Entry<String, String[]> entry : credentialJSON.entrySet()) {
					    String[] valeur = entry.getValue();
					    
					    for(int i=0,cpt = valeur.length;i<cpt;i+=1)
					    {
					    	System.out.println("valeur " + i + " " + valeur[i]);					    
					    }
					}
					
					Gson gson = new Gson();
					out.write(gson.toJson(credentialJSON));
					out.flush();
					out.close();
					
				}
			}
			
			
		}
		else
		{
			this.getServletContext().getRequestDispatcher(VUE).forward(request, response);
		}
		
		
	}
	
	
	@Override protected void doPost(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException
	{
		HttpSession session = request.getSession();
		PrintWriter out = response.getWriter();
		Essbase essbase = null;
		String action = null;
		HashMap<String,String> form = null;
		HashMap<String,Object> output = new HashMap<String, Object>();
		Gson gson = new GsonBuilder().disableHtmlEscaping()
		        .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
		        .serializeNulls()
		        .registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
		        .registerTypeAdapter(Variable.class, new VariableAdapter())
		        .excludeFieldsWithoutExposeAnnotation()
		        .create();
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		
		action = request.getParameter("action");
		
		System.out.println("myAction " + action);
		
		if(action!= null)
		{
			if( "connexion".equals(action) )
			{
				Type stringStringMap = new TypeToken<HashMap<String, String>>() {
				}.getType();
				HashMap<String, String> datas = gson.fromJson(request.getParameter("datas"), stringStringMap);
				
				if( datas.get("inputSaveCredentials") != null )
				{
					
					fr.stcg.oasis.utility.Servlet.setCookie(response, COOKIE_CREDENTIALS, datas.get("login")+"_"+ datas.get("server"), COOKIE_MAX_AGE);
				}
				else
				{
					fr.stcg.oasis.utility.Servlet.setCookie(response, COOKIE_CREDENTIALS, "", 0);
				}
				
				
				
				
				
				
				
				if( datas != null && !datas.isEmpty())
				{
					
					User user = null;
					Profile userProfile = null;
					try
					{
						user = DaoFactory.getUserDao().trouverUtilisateurParLogin( datas.get("login") );
						userProfile = user.getProfile();
						
						System.out.println("userProfile" + userProfile.toString());
					}
					catch(Exception e)
					{
						e.printStackTrace();
					}
					
					
					
					String[] applicationCube = datas.get("application").split("\\.");
					
					for(int i = 0;i < applicationCube.length; i += 1)
					{
						System.out.println("applicationCube" + i + " :" +applicationCube[i]);
					}
					
					
					
					try
					{
						essbase = (Essbase) session.getAttribute("essbase");
						
						//Connexion au cube Essbase
						IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationCube[0], applicationCube[1]);
						Cube theCube = null;
						
						
//						Cube theCube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
//						
//						if ( theCube == null)
//						{
//							theCube = new Cube(applicationCube[1],applicationCube[0],null);
//							DaoFactory.getCubeDao().add(theCube);
//						}
						
						if( userProfile.getName().equals("administrateur") )
						{
							ArrayList<String> appsCubes =  essbase.getAppsCubes();
							
							for( int i = 0, cpt = appsCubes.size(); i < cpt; i++)
							{
								String[] appCube = appsCubes.get(i).split("\\.");
								
								
								System.out.println("app : " + appCube[0] + " \n cube : " + appCube[1]);
								
								Cube cub = DaoFactory.getCubeDao().findCubeByApplicationName(appCube[0], appCube[1]);
								
								if(cub == null)
								{
									cub = new Cube(appCube[1],appCube[0],null);
									DaoFactory.getCubeDao().add(cub);
								}
								
								
								
							}
							
							theCube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
							
						}
						else
						{
							
							//Save cube
							theCube = DaoFactory.getCubeDao().findCubeByApplicationName(applicationCube[0], applicationCube[1]);
							
							if ( theCube == null)
							{
								theCube = new Cube(applicationCube[1],applicationCube[0],null);
								DaoFactory.getCubeDao().add(theCube);
								
							}
						}
						
		
						
		
						
						//Save dimension
						ArrayList<Dimension> dim = DaoFactory.getDimensionDao().findDimensionsByCube( theCube );
						System.out.println(dim.toString());
						if( dim.isEmpty())
						{
							
							essbase.getDimensions(theCube, dim);//bizarre quand même
							DimensionMetier.saveDimensions( dim , theCube);
						}
						
						
						
						
						
						/*super duper weird hereeeeee spider is in the room*/
						//System.out.println("in saveDimensions " + dim.size() + " " + dim.toString());
						
						
						
						
						
						
						//save members 
						/*ArrayList<Membre> members = null;
						
						System.out.println("dim" + dim.toString());
						
						
						for(Dimension dimension : dim)
						{
							System.out.println("name dimension "+ dimension.getName());
							members = essbase.getMembers(dimension, theCube);
							//MembreMetier.saveMembers(members, dimension);
						}*/
						
						
						ArrayList<String> dimensions = essbase.getDimensionsCube(cube);
						HashMap<String, ArrayList<Member>> membersPerDimension = essbase.getMembersPerDimension(applicationCube[0], applicationCube[1],IEssMemberSelection.QUERY_TYPE_DESCENDANTS);
//						HashMap<String, ArrayList<String>> bottomLevelPerDimension = essbase.getMembersPerDimension(applicationCube[0], applicationCube[1],IEssMemberSelection.QUERY_TYPE_BOTTOMLEVEL);
						HashMap<String, ArrayList<Variable>> variablesPerDimension = DaoFactory.getVariableDao().findVariablesPerDimensionByCube(theCube);
						
						
						
						session.setAttribute("cube", theCube); 
						session.setAttribute("dimensions", dimensions);
						session.setAttribute("membersPerDimension", membersPerDimension);
//						session.setAttribute("bottomLevelPerDimension", bottomLevelPerDimension);
						
						if(userProfile.getName().equals("administrateur"))
						{
							ArrayList<Cube> cubes = new ArrayList<Cube>(DaoFactory.getCubeDao().findAll());
							output.put("cubes", cubes);
							System.out.println("elts " + cubes.size() );
						}
						
					
						output.put("cube",theCube);
						output.put("variablesPerDimension", variablesPerDimension);
						output.put("dimensions", dimensions );
						output.put("membersPerDimension", membersPerDimension);
//						output.put("bottomLevelPerDimension", bottomLevelPerDimension);
						
						session.setAttribute("applicationCube", datas.get("application"));
						
						
						session.setAttribute("user", user);
						session.setAttribute("userProfile", userProfile);
						
						session.setAttribute("page", PAGE);
						
						essbase.disconnectServer();
						
						out.write( gson.toJson ( output ) );
						
						System.out.print(session);
					}
					catch(ConstraintViolationException e) {
						
					}
					catch(MySQLIntegrityConstraintViolationException e) {
						System.err.println(e.getMessage());
					}
					catch(Exception e)
					{
						e.printStackTrace();
						out.write(e.getMessage());
					}
					finally
					{
						out.flush();
						out.close();
					}
					

				}
				
				
			}
			else if( "redirect".equals( action ))
			{
				
				String finalUrl = response.encodeRedirectURL(request.getContextPath() + HOME_PAGE + "?getCurrentInfos");
				
				output.put("redirect", finalUrl);
				
				out.write(gson .toJson(output));
				
				
//				response.sendRedirect(finalUrl);
				
				
			}
			else if( "getApplications".equals(action) )
			{
				
				form = fr.stcg.oasis.utility.Servlet.JSONToHashMapStringString(request); 
				
				try
				{
					essbase = new Essbase( form );
					
					
					
					System.out.println(" " + essbase.getOlapServer().isConnected());
					
					String applicationsString = essbase.getCubesApplicationsString(); // on initialise appsCubes
					
					session.setAttribute("essbase", essbase);
					session.setAttribute("form",form);
					
					System.out.println( applicationsString );
					
					
					out.write( applicationsString );
				}
				catch( EssException e )
				{
					e.printStackTrace();
					System.out.print( e.getNativeCode() );
					out.write( essbase.getError( e.getNativeCode() ) );
					
				}
				catch( Exception e )
				{
					e.printStackTrace();
					out.write( e.getMessage() );
					
				}
				finally
				{
					out.flush();
					out.close();
				}
			}
		}		
	}
}

