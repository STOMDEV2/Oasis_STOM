package fr.stcg.oasis.dao.jpa;

import java.sql.SQLException;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.dao.CubeDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class CubeDaoImpl extends AbstractJpaDao<Cube> implements CubeDao {
	
	public CubeDaoImpl() 
	{
		super(Cube.class);
	}

	@Override
	public Cube findCubeByApplicationName(String application, String name)
			throws SQLException {
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM Cube AS c WHERE  c.application = :application AND c.name = :name");
    	query.setParameter("application", application);
    	query.setParameter("name", name);
    	
    	
    	// Get all
    	try
    	{
    		return (Cube) query.getSingleResult();
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
	
}
