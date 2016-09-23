package fr.stcg.oasis.dao.jpa;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.dao.GridDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class GridDaoImpl extends AbstractJpaDao<Grid> implements GridDao
{
	public GridDaoImpl()
	{
		super(Grid.class);
	}
	
	@Override
	public List<Grid> findGridsByMask(int maskId)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT g FROM Grid g WHERE g.mask.id = :maskId");
    	query.setParameter("maskId", maskId);
    	
    	// Get all
    	try
    	{
    		return (ArrayList<Grid>) query.getResultList();
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
	public List<Grid> findGridsByUser(int userId)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT g FROM Grid g WHERE g.creator.id = :userId");
    	query.setParameter("userId", userId);
    	
    	// Get all
    	try
    	{
    		return (ArrayList<Grid>) query.getResultList();
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
