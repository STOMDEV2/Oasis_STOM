package fr.stcg.oasis.dao.jpa;

import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.dao.DimensionDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class DimensionsDaoImpl extends AbstractJpaDao<Dimension> implements DimensionDao {
	
	public DimensionsDaoImpl()
	{
		super(Dimension.class);
	}
	
	public ArrayList<Dimension> findDimensionsByCube(Cube cube) {
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT d FROM Dimension AS d WHERE  d.cube = :cube");
    	query.setParameter("cube", cube);
    	
    	
    	
    	// Get all
    	try
    	{
    		return (ArrayList<Dimension>) query.getResultList();
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
	public Dimension findDimensionByName(String dimension, Cube cube) {
		
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT d FROM Dimension AS d WHERE  d.cube = :cube AND d.name = :dimension");
    	query.setParameter("cube", cube);
    	query.setParameter("dimension", dimension);
    	
    	
    	// Get all
    	try
    	{
    		return (Dimension) query.getSingleResult();
    	}
    	catch(NoResultException e)
    	{
    		return null;
    	}
    	finally
    	{
    		em.close();
    	}
		
	
	}
	
	

}
