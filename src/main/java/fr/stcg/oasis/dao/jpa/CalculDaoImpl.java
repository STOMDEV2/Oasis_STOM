package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.dao.CalculDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class CalculDaoImpl extends AbstractJpaDao<Calcul> implements CalculDao
{
	public CalculDaoImpl()
	{
		super(Calcul.class);
	}
	
	@Override
	public Calcul findCalculByCubeAndName(Cube cube, String name)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM Calcul c WHERE c.cube.id = :cube AND c.name = :name");
       	query.setParameter("cube", cube.getId());
       	query.setParameter("name", name);
    	
    	// Get all
    	try
    	{
    		return (Calcul) query.getSingleResult();
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
