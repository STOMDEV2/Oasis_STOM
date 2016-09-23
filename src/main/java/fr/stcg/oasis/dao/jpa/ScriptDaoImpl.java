package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Script;
import fr.stcg.oasis.dao.ScriptDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class ScriptDaoImpl extends AbstractJpaDao<Script> implements ScriptDao
{
	public ScriptDaoImpl()
	{
		super(Script.class);
	}
	
	@Override
	public Script findScriptByCubeAndName(Cube cube, String name)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT s FROM Script s WHERE s.cube.id = :cube AND s.name = :name");
       	query.setParameter("cube", cube.getId());
       	query.setParameter("name", name);
    	
    	// Get all
    	try
    	{
    		return (Script) query.getSingleResult();
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
