package fr.stcg.oasis.dao.jpa;

import java.util.ArrayList;
import java.util.HashMap;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Variable;
import fr.stcg.oasis.dao.VariableDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class VariableDaoImpl extends AbstractJpaDao<Variable> implements VariableDao {
	
	public VariableDaoImpl()
	{
		super(Variable.class);
	}

	@Override
	public Variable findVariableByNameAndCube(String variable)
	{
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT v FROM Variable v WHERE v.name = :name");
    	query.setParameter("name", variable);
    	
    	// Get all
    	try
    	{
    		return (Variable) query.getSingleResult();
    	}
    	catch(NoResultException e)
    	{
    		return null;
    	}
    	finally
    	{
    		if (em.isOpen()) 
                em.close();
    	}
	}
	
	@Override
	public ArrayList<Variable> findVariablesByCube(Cube cube) {
		/*
		 SELECT v.name, v.base  FROM ( (SELECT * FROM `dimension` where `cube_id` = 1 ) 
		 as d INNER JOIN (SELECT * FROM `variable`) as v
               ON d.`id` = v.`associatedDimension_id` )
		 */
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT v FROM Dimension d , Variable v WHERE d.cube = :cube AND v.associatedDimension.id = d.id ORDER BY d.name") ;
    	query.setParameter("cube", cube);
    	
    	// Get all
    	try
    	{
    		return (ArrayList<Variable>) query.getResultList();
    	}
    	catch(NoResultException e)
    	{
    		return null;
    	}
    	finally
    	{
    		if (em.isOpen()) 
                em.close();
    	}
	}
	
	public HashMap<String, ArrayList<Variable>> findVariablesPerDimensionByCube(Cube cube) {
		/*
		 SELECT v.name, v.base  FROM ( (SELECT * FROM `dimension` where `cube_id` = 1 ) 
		 as d INNER JOIN (SELECT * FROM `variable`) as v
               ON d.`id` = v.`associatedDimension_id` )
		 */
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT v FROM Dimension d , Variable v WHERE d.cube = :cube AND v.associatedDimension.id = d.id ORDER BY d.name") ;
    	query.setParameter("cube", cube);
    	
    	// Get all
    	try
    	{
    		ArrayList<Variable> variables = (ArrayList<Variable>) query.getResultList();
    		HashMap<String, ArrayList<Variable>> variablesPerDimension = new HashMap<String, ArrayList<Variable>>();
    		ArrayList<Variable> variableDimension = new ArrayList<>();
    		
    		System.out.println("sql variables" + variables);
    		
    		String previousDimension = null, currentDimension = null;
    		int nbVariables = variables.size(), cpt = 0;
    		
    		for(Variable v : variables)
    		{
    			if(previousDimension == null)
    				previousDimension = v.getAssociatedDimension().getName();
    			
    			currentDimension = v.getAssociatedDimension().getName();
    			
    			if( previousDimension.equals( currentDimension ) )
    			{
    				variableDimension.add( v );
    			}
    			else
    			{
    				variablesPerDimension.put(previousDimension , new ArrayList<Variable>(variableDimension));
    				variableDimension.clear();
    				variableDimension.add( v );
    				previousDimension = v.getAssociatedDimension().getName();
    			}
    			
    			if(cpt == nbVariables - 1)
    			{
    				variablesPerDimension.put(previousDimension, new ArrayList<Variable>(variableDimension));
    			}
    			
    			cpt += 1;
    			
    		}
    		
    		System.out.println(variablesPerDimension);
    		
    		return variablesPerDimension;
    	}
    	catch(NoResultException e)
    	{
    		return null;
    	}
    	finally
    	{
    		em.close();
    		
    		if (em.isOpen()) 
                em.close();
    	}
	}
	

}
