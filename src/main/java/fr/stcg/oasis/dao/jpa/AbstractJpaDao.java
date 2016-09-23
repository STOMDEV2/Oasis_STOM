package fr.stcg.oasis.dao.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import fr.stcg.oasis.dao.Dao;
import fr.stcg.oasis.utility.PersistenceManager;

public class AbstractJpaDao<T> implements Dao<T> 
{
	private Class<T> object;

	protected AbstractJpaDao(Class<T> object)
	{
		this.object = object;
	}
	
	@Override
	public T add(T newObject) throws Exception
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	
        // Persist
        try
        {
        	System.out.println(object.getSimpleName());
        	
        	em.getTransaction().begin();
        	em.persist(newObject);
        	em.getTransaction().commit();
        	
        	return newObject;
        }
        finally
        {
        	if(em.getTransaction().isActive())
                em.getTransaction().rollback();

            if (em.isOpen()) {
                em.close();
            }
            
        }
	}

	@Override
	public void update(T object)  throws Exception
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();

        // Update
        try
        {
        	em.getTransaction().begin();
        	em.merge(object);
        	em.getTransaction().commit();
        }
        finally
        {
        	if(em.getTransaction().isActive()) 
        	{ 
                em.getTransaction().rollback();
            }
            
        	if (em.isOpen()) {
                em.close();
            }
        }	
	}

	@Override
	public void remove(int id) throws Exception
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
        
        // Remove
        try
        {
        	em.getTransaction().begin();
        	em.remove(em.find(object, id));
        	em.getTransaction().commit();
        }
        finally
        {
        	if(em.getTransaction().isActive()) 
        	{ 
                em.getTransaction().rollback();
            }
            
        	if (em.isOpen()) 
                em.close();
            
        }			
	}

	@Override
	public T findById(int id) throws Exception
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
        
        // Get
        try
        {
        	T find = (T) em.find(object, id);
        	
        	return find;
        }
        finally
        {      	
        	if (em.isOpen()) 
                em.close();
            
        }	
	}

	@Override
	public List<T> findAll() throws Exception
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT p FROM " + object.getSimpleName()+" AS p");
    	
    	// Get all
    	try
    	{
    		@SuppressWarnings("unchecked")
    		List<T> list = query.getResultList();
    		return list;
    	}
    	finally
    	{
    		if (em.isOpen()) 
                em.close();
            
    	}
	}
}