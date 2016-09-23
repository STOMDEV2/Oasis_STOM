package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.beans.ScenarioParameter;
import fr.stcg.oasis.dao.ScenarioParameterDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class ScenarioParameterImplDao extends AbstractJpaDao<ScenarioParameter> implements ScenarioParameterDao
{
	public ScenarioParameterImplDao()
	{
		super(ScenarioParameter.class);
	}
	
	@Override
	public ScenarioParameter getScenarioParameterByVariableAndGrid(String value, Grid grid, boolean isRetrieve)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT s FROM ScenarioParameter AS s WHERE s.variable.name = :variable AND s.grid.id = :grid AND s.isRetrieve = :isRetrieve");
    	query.setParameter("variable", value.substring(1, value.length()).split("_")[0]);
    	query.setParameter("grid", grid.getId());
    	query.setParameter("isRetrieve", isRetrieve);
   	
    	// Get all
    	try
    	{
    		return (ScenarioParameter) query.getSingleResult();
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
