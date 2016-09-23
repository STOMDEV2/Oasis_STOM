package fr.stcg.oasis.essbase;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import com.essbase.api.base.EssException;
import com.essbase.api.base.IEssBaseObject;
import com.essbase.api.base.IEssIterator;
import com.essbase.api.datasource.IEssCube;
import com.essbase.api.datasource.IEssOlapApplication;
import com.essbase.api.datasource.IEssOlapServer;
import com.essbase.api.domain.IEssDomain;
import com.essbase.api.metadata.IEssCubeOutline;
import com.essbase.api.metadata.IEssDimension;
import com.essbase.api.metadata.IEssMember;
import com.essbase.api.metadata.IEssMemberSelection;
import com.essbase.api.session.IEssbase;
import com.google.gson.Gson;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.Member;

public class Essbase implements Serializable {
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	

	//Essbase 
	private IEssbase essbase;
	private IEssOlapServer olapServer;
	Cube cube;
	

	//Infos connexion
	private static final String provider = "Embedded";//http://localhost:13080/aps/JAPI";//"Embedded";//"http://169.254.203.22:13800/aps/API";
	private String login;
	private String password;
	private String server;
	private ArrayList<String> appsCubes = null;
	
	//Constantes
	private static final String ALIAS_TABLE = "Default";
	
	
	public Essbase(HttpServletRequest request) throws EssException, IOException
	{
		this.login = request.getParameter("login");
		this.password = request.getParameter("password");
		this.server = request.getParameter("server");
		this.server += ":1423"; // prévoir en paramètres application
		this.olapServer = this.connectToServer();
	}
	
	public Essbase(HashMap<String,String> inputsConnexion) throws EssException, IOException
	{
		
				    
		  this.login = inputsConnexion.get("login");
		  this.password = inputsConnexion.get("password");
		  this.server = inputsConnexion.get("server");
		  this.server += ":1423"; // prévoir en paramètres application
		  this.olapServer = this.connectToServer();
		
	}
	
	

	
	// connection au serveur Essbase
	public IEssOlapServer connectToServer() throws EssException , java.io.IOException {
		
		this.essbase = IEssbase.Home.create(IEssbase.JAPI_VERSION);

		IEssDomain domain = this.essbase.signOn(this.login, this.password, false,
				null, provider);

		this.olapServer = domain.getOlapServer(this.server);

		this.olapServer.connect();
		
		return olapServer;
	}

	// connexion au cube:database
	public IEssCube connectToCube(IEssOlapServer olapServer,
			String application, String database)  throws EssException {
		IEssCube cube = null;
		try {
			if (essbase.isSignedOn() == true) {
				// Se connecter à l'appli et au cube
				cube = olapServer.getApplication(application).getCube(database);
				cube.setActive();
			}
		} catch (EssException e) {
			e.printStackTrace();
			throw new EssException(e.getMessage());
		}
		return cube;
	}
	
	public IEssIterator getApplications() throws EssException
	{
		return this.olapServer.getApplications();
	}
	
	public String getError(int code)
	{
		Gson gson = new Gson();
		String errorJSON = null;
		HashMap<String, ArrayList<String>> error = new HashMap<String, ArrayList<String>>();
		ArrayList<String> errorMessages = new ArrayList<String>();
		
		//!!!!!! voir pourquoi le code retourné est zéro
		switch(code)
		{
			case 1042006: 	errorMessages.add("Délai d'attente maximal dépassé. Connexion au serveur spécifié impossible. Vérifiez votre connexion internet.");
							error.put("error",errorMessages);
							break;
							
			case 1051293:   errorMessages.add("Identifiants erronés.");
			error.put("error",errorMessages);
							break;
			
			default: 		errorMessages.add("Connexion échouée. Une erreur est survenue.");
			error.put("error", errorMessages);
							break;
			
		}
		
		errorJSON = gson.toJson(error);
		
		return errorJSON;
		
	}
	
	public String getCubesApplicationsString() throws EssException
	{
		Gson gson = new Gson();
		HashMap<String, ArrayList<String>> applications = new HashMap<String, ArrayList<String>>();
		ArrayList<String> appCubes = new ArrayList<String>();
		IEssIterator itApps = getApplications();
		IEssIterator cubes;
		IEssOlapApplication app;
		IEssCube cube;
		String appJSON = null;
		
		for( int i = 0, cpt = itApps.getCount();i<cpt;i++)
		{
			app = (IEssOlapApplication) itApps.getAt(i);
			
			cubes = app.getCubes(); 
			
			for(int j = 0, jCpt = cubes.getCount() ; j < jCpt; j++ )
			{
				cube = (IEssCube) cubes.getAt(j);
				appCubes.add(app.getName() + "." +  cube.getName());
				
			}
		}
		
		this.setAppsCubes(appCubes);
		
		
		applications.put("applications", appCubes);
		
		appJSON = gson.toJson(applications);
		
		return appJSON;
		        
	}

	/**
	 * 
	 * @param cube
	 * @return
	 */
	// Retourne les dimensions du cube sous forme d'une liste
	public ArrayList<String> getDimensionsCube(IEssCube cube) {
		ArrayList<String> dimensionsList = new ArrayList<String>();

		try 
		{
			
			IEssIterator iterator = cube.getDimensions();
			for (int index = 0; index < iterator.getCount(); index++) 
			{	
				IEssDimension dimension = (IEssDimension) iterator.getAt(index);
				
				/*System.out.println("dim cat type : " + dimension.getAttributeDimensionDataType());
				System.out.println("description " + dimension.getDescription());
				System.out.println("toString " + dimension.toString());
				System.out.println("category" + dimension.getCategory());
				System.out.println("propertynames " + dimension.getPropertyNames());
				System.out.println("" + dimension.getStorageType().toString());
				System.out.println("" + dimension.getTag().toString());*/
				
				
				if(dimension.getAttributeDimensionDataType().toString().equals("None")) 
				{
					dimensionsList.add(iterator.getAll()[index].toString());
				}
				
			}

		} 
		catch (EssException ex) 
		{
			System.err.println("Error: " + ex.getMessage());
		}
		
		return dimensionsList;
	}
	
	

	/**
	 * 
	 * @param cube
	 * @return
	 */
	// Retourne les dimensions du cube sous forme d'une liste
	public ArrayList<String> getAllUDAs(IEssCube cube)
	{
		ArrayList<String> dimensionsList = new ArrayList<String>();

		try 
		{
			IEssCubeOutline outline = cube.openOutline();
			IEssIterator iterator = outline.getDimensions();
			for (int index = 0; index < iterator.getCount(); index++) 
			{	
				IEssDimension dimension = (IEssDimension) iterator.getAt(index);
				
				/*System.out.println("dim cat type : " + dimension.getAttributeDimensionDataType());
				System.out.println("description " + dimension.getDescription());
				System.out.println("toString " + dimension.toString());
				System.out.println("category" + dimension.getCategory());
				System.out.println("propertynames " + dimension.getPropertyNames());
				System.out.println("" + dimension.getStorageType().toString());
				System.out.println("" + dimension.getTag().toString());*/
				
				for(int i = 0; i < dimension.getUDAs().length; i++)
					dimensionsList.add(dimension.getUDAs()[i]);
			}

		} 
		catch (EssException ex) 
		{
			System.err.println("Error: " + ex.getMessage());
		}
		
		return dimensionsList;
	}
	
	
	/**
	 * 
	 * @param cube
	 * @return
	 */
	// Retourne les dimensions du cube sous forme d'une liste
	public HashMap<String, ArrayList<Integer>> getGenerationAndNumberLevelOfDimensionServlet(IEssCube cube) {
		HashMap<String, ArrayList<Integer>> infos = new HashMap<String, ArrayList<Integer>>();

		try 
		{
			IEssCubeOutline outline = cube.openOutline();
			IEssIterator iterator = outline.getDimensions();
			for (int index = 0; index < iterator.getCount(); index++) 
			{	
				final IEssDimension dimension = (IEssDimension) iterator.getAt(index);
				
				/*System.out.println("dim cat type : " + dimension.getAttributeDimensionDataType());
				System.out.println("description " + dimension.getDescription());
				System.out.println("toString " + dimension.toString());
				System.out.println("category" + dimension.getCategory());
				System.out.println("propertynames " + dimension.getPropertyNames());
				System.out.println("" + dimension.getStorageType().toString());
				System.out.println("" + dimension.getTag().toString());*/
//				System.out.println(dimension.getName());
				ArrayList<Integer> values = new ArrayList<Integer>();
				values.add(dimension.getGenerations().getCount());
				values.add(dimension.getLevels().getCount());
				infos.put(dimension.getName(), values);
			}
		} 
		catch (EssException ex) 
		{
			System.err.println("Error: " + ex.getMessage());
		}
		
		return infos;
	}
	
	public ArrayList<Dimension> getDimensions(Cube cube, ArrayList<Dimension> dimensions)
	{
		 //Collection de Dimension
		
		try
		{
			//On récupère le cube via l'olapServer de l'instance Essbase
			IEssCube iessCube = this.olapServer.getApplication(cube.getApplication()).getCube(cube.getName());
			
			//ouverture de l'outline et stockage des dimensions dans collection essbase
            IEssCubeOutline otl = iessCube.openOutline();
            IEssIterator itDimensions = otl.getDimensions();
                        
            for(int i = 0, cpt = itDimensions.getCount(); i < cpt ; i += 1)
            {
            	//Récupération de la dimension dans l'objet essbase (interface)
            	IEssDimension dimension = (IEssDimension) itDimensions.getAt(i);
            	
            	System.out.println("dim cat type : " + dimension.getAttributeDimensionDataType());
				System.out.println("toString " + dimension.toString());
				System.out.println("tag is " + dimension.getTag().toString());
				
				//Création d'un Bean Dimension pour sauvegarder la dimensions essbase
				Dimension theDimension = new Dimension(dimension.toString(), dimension.getTag().stringValue(), cube);
                
				//DaoFactory.getDimensionDao().add(theDimension);
                dimensions.add(theDimension);
            }
            
    
			
		}
		catch(EssException ex)
		{
			System.err.println( "Error: " + ex.getMessage() );
		}
		
		return dimensions;
	}
	
	

	    public ArrayList<Member> getMembers(Dimension originalDimension, Cube cube) throws Exception
	    {
	        //Collection de Membre
	        ArrayList<Member> theMembers = new ArrayList<Member>();
	        
	        try
	        {
	            //récupération du cube essbase connecté
	            IEssCube iessCube = this.olapServer.getApplication(cube.getApplication()).getCube(cube.getName());
	            
	            //objets pour permettre la requete
	            IEssMemberSelection mbrSel = null;
	            IEssCubeOutline otl = iessCube.openOutline();
	            
	            //la dimension essbase
	            IEssDimension dimension = iessCube.getDimension(originalDimension.getName());
	                
	            //Ouverture de la sélection de membre pour la dimension essbase 
	            mbrSel = iessCube.openMemberSelection(originalDimension.getName());
	                
	            IEssIterator itMembers = null;
	                
	            mbrSel.executeQuery(originalDimension.getName(),IEssMemberSelection.QUERY_TYPE_DESCENDANTS,
	                  IEssMemberSelection.QUERY_OPTION_MEMBERSONLY, "", "", "");
	                
	            itMembers = mbrSel.getMembers();
	               
	            
	            
	            ArrayList<Integer> firstGeneration = new ArrayList<Integer>();
	            System.out.println(itMembers.getCount());
	            
	            for (int j = 0; j < itMembers.getCount(); j += 1)
	            {	
	            	
	            	System.out.println("gen n" + ((IEssMember) itMembers.getAt(j)).getGenerationNumber());
	                if( ((IEssMember) itMembers.getAt(j)).getGenerationNumber() == 2)
	                {
	                	firstGeneration.add(j);
	                	System.out.println("I GAT A LEVEL 0");
	                }
	            }
	            
	            
	            
	            ArrayList<IEssBaseObject> al = new ArrayList<IEssBaseObject>(Arrays.asList(itMembers.getAll()) );
	            
	            
	            
	            for(IEssBaseObject o: al)
	            {
	            	System.out.println(o);
	            	
	            }
	            
	            
	            
	            for(int i = 0; i < firstGeneration.size(); i++)
	                saveMember((IEssMember) itMembers.getAt(firstGeneration.get(i)), originalDimension, al, null);
	            
	            
	            System.out.println("size" + al.size());
	         
	        }
	        catch(EssException ex)
	        {
	            System.err.println( "Error: " + ex.getMessage() );
	        }
	        
	        //System.out.println("members " + theMembers.toString());
	        return theMembers;
	    }
	    
	    private void saveMember(IEssMember member, Dimension dimension, ArrayList<IEssBaseObject> liste, Member parent) throws Exception
	    {
	    	System.out.println("JE PASSE LA DEDANS");
	    	System.out.println("dim " + dimension);
	    	
//	    	Membre mbr = new Membre(member.getAlias(ALIAS_TABLE),member.getUniqueName(), member.getLevelNumber(),
//	    		parent, dimension, member.getConsolidationType().toString(),member.getChildCount());
//	        
	    	
	    	
	        
//	        mbr = DaoFactory.getMembreDao().add(mbr);
	        
	        
//	        int nbChild = 0;
//	        for(int i = 0; i < member.getChildCount(); i++)
//	        {
//	            IEssMember son = (IEssMember) liste.get(liste.indexOf(member) + nbChild +1);
//	            saveMember(son, dimension, liste,mbr);
//	            nbChild += getDescendantsMemberCount(liste.indexOf(son), liste) + 1;
//	        }
	    }
	    
	    private int getDescendantsMemberCount(int indexMember, ArrayList<IEssBaseObject> liste) throws EssException
	    {
	    	int nbDescendants = 0, generationMember = ((IEssMember) liste.get(indexMember)).getGenerationNumber();
	    	
	    	
	    	for(int i = indexMember + 1, limit = liste.size();i<limit;i++)
	    	{
	    		if( ((IEssMember)liste.get(i)).getGenerationNumber() == generationMember)
	    		{
	    			break;
	    		}
	    		
	    		nbDescendants++;
	    	}
	    	
	    	return nbDescendants;
	    }
	    
	
	//ezfezfe
	
	
	/***
	 * 
	 * @param applicationString a string to specify on which application the members are from 
	 * @param cubeString a string to specify on which cube the members are from
	 * @param queryType an int to specify how to pick the members from dimensions. Values are from IEssMemberSelection.QUERY_TYPE_ constants
	 * @return null or HashMap<String,ArrayList<String>>. The HashMap contains a key string which is a dimension name, and an ArrayList<String> of the members associated with the dimension.
	 * @throws EssException
	 */
	public HashMap<String, ArrayList<Member>> getMembersPerDimension(String applicationString, String cubeString, int queryType ) throws EssException
	{
		IEssMemberSelection mbrSel = null;

		IEssCube cube = this.olapServer.getApplication(applicationString)
				.getCube(cubeString);
		
		IEssCubeOutline outline = cube.openOutline();
		ArrayList<String> dimensions = this.getDimensionsCube(cube);

		HashMap<String, ArrayList<Member>> membersPerDimension = new HashMap<String, ArrayList<Member>>();

		for (int i = 0, cpt = dimensions.size(); i < cpt; i += 1) {
			mbrSel = cube.openMemberSelection(dimensions.get(i));

			IEssIterator it = null;
			mbrSel.executeQuery(dimensions.get(i),
					queryType,
					IEssMemberSelection.QUERY_OPTION_MEMBERSANDALIASES, "", "", "");

			it = mbrSel.getMembers();

			ArrayList<Member> members = new ArrayList<Member>();

			for (int j = 0; j < it.getCount(); j += 1) {

				IEssMember mbr = (IEssMember) it.getAt(j);
				
				Member member = new Member();
					member.setUniqueName(mbr.getUniqueName());
					member.setAlias(mbr.getAlias(ALIAS_TABLE));
					member.setLevelNumber(mbr.getLevelNumber());
					member.setGenerationNumber(mbr.getGenerationNumber());
					member.setUDAs(mbr.getUDAs());
					member.setSharedMember(mbr.getPropertyValueAny("Share option").toString().indexOf("Shared member") != -1);
					member.setDynamicCalc(mbr.getPropertyValueAny("Share option").toString().indexOf("Dynamic calc") != -1);
					
//					System.out.println(mbr.getOriginalMemberName());
					
//					for(String prop: mbr.getPropertyNames())
//						System.out.println(prop + ": " + mbr.getPropertyValueAny(prop));
					
//					if(mbr.getUniqueName().equals("CLBI"))
//						System.out.println("SHARE OPTION CLBI: " + mbr.getPropertyValueAny("Share option"));
					
//				System.out.println(mbr.getAttributeMemberDataType());
//				System.out.println(mbr.isAttributesAssociated());
//				if(mbr.isAttributesAssociated())
//				{
//					IEssIterator attr = mbr.getAssociatedAttributes();
//					for (int k = 0; k < attr.getCount(); k += 1) {
//						IEssMember essAtmem = (IEssMember) attr.getAt(k);
//						System.out.println("Attribute Dimension = " + essAtmem.getDimensionName());
//						System.out.println("Attribute Associated Member = " + essAtmem.getName());
//						System.out.println("Attribute Type = " + essAtmem.getAttributeMemberDataType().toString());
//					}
//				}
					
				members.add(member);


			}

			membersPerDimension.put(dimensions.get(i), members);

		}

		
//		IEssMember essMem = outline.findMember("OACT");
//		System.out.println("OACT LA");
//		System.out.println(essMem.getOriginalMemberName() == null);
//		System.out.println(essMem.isAttributesAssociated());
//		System.out.println(essMem.getAttributeValue());
//		System.out.println(essMem.getPropertyNames().length);
		
//		for(IEssValueAny.EEssDataType prop: essMem.getPropertyDataTypes())
//			System.out.println(prop.stringValue());
//		for(IEssProperties.EEssPropertyMode prop: essMem.getPropertyModes())
//			System.out.println(prop.stringValue());
//		for(String prop: essMem.getPropertyNames())
//			System.out.println(prop + ": " + essMem.getPropertyValueAny(prop));
//		if(essMem.isAttributesAssociated()){
//			IEssIterator essAttribs = essMem.getAssociatedAttributes();
//	
//			for(int i=0;i < essAttribs.getCount();i++){
//				IEssMember essAtmem = (IEssMember) essAttribs.getAt(i);
//				System.out.println("Attribute Dimension = " + essAtmem.getDimensionName());
//				System.out.println("Attribute Associated Member = " + essAtmem.getName());
//				System.out.println("Attribute Type = " + essAtmem.getAttributeMemberDataType().toString());
//				
//			}
//		}
		
		
//		essMem = outline.findMember("LBI");
//		System.out.println(essMem.getOriginalMemberName() == null);
//		System.out.println("LBI LA");
//		for(String prop: essMem.getPropertyNames())
//			System.out.println(prop + ": " + essMem.getPropertyValueAny(prop));
//		
//		essMem = outline.findMember("CLBI");
//		System.out.println(essMem.getOriginalMemberName() == null);
//		System.out.println("CLBI LA");
//		for(String prop: essMem.getPropertyNames())
//			System.out.println(prop + ": " + essMem.getPropertyValueAny(prop));
//		
//
//		essMem = outline.findMember("P0");
//		System.out.println(essMem.getOriginalMemberName() == null);
//		System.out.println("P0 LA");
//		for(String prop: essMem.getPropertyNames())
//			System.out.println(prop + ": " + essMem.getPropertyValueAny(prop));
		
		return membersPerDimension;
	}
	
	
	
	// Verifier la connexion au serveur Essbase
	public boolean isConnected() {
		boolean isConnected = false;
		
		try {
			if (essbase != null && essbase.isSignedOn() == true) {
				isConnected = true;
			} else {
				isConnected = false;
			}
		} catch (EssException ex) {
			System.err.println("Error: " + ex.getMessage());
		}
		return isConnected;
	}
		
	// déconnexion du serveur
	public void disconnectServer() /* throws EssException */{
		try {
			if (essbase != null && essbase.isSignedOn() == true)
				essbase.signOff();
		} catch (EssException ex) {
			System.err.println("Error: " + ex.getMessage());
		}
	}

	
	/*** GETTERS & SETTERS ***/
	public IEssbase getEssbase() {
		return essbase;
	}

	public void setEssbase(IEssbase essbase) {
		this.essbase = essbase;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getServer() {
		return server;
	}

	public void setServer(String server) {
		this.server = server;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public static String getProvider() {
		return provider;
	}
		
	public IEssOlapServer getOlapServer() {
		return olapServer;
	}

	public void setOlapServer(IEssOlapServer olapServer) {
		this.olapServer = olapServer;
	}

	public Cube getCube() {
		return cube;
	}

	public void setCube(Cube cube) {
		this.cube = cube;
	}

	public ArrayList<String> getAppsCubes() {
		return appsCubes;
	}

	public void setAppsCubes(ArrayList<String> appsCubes) {
		this.appsCubes = new ArrayList<String>(appsCubes);
	}
	
	
	
		
}
