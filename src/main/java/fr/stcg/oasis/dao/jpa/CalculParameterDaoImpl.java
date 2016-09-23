package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.CalculParameter;
import fr.stcg.oasis.dao.CalculParameterDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class CalculParameterDaoImpl extends AbstractJpaDao<CalculParameter> implements CalculParameterDao
{
	public CalculParameterDaoImpl()
	{
		super(CalculParameter.class);
	}
	
	@Override
	public CalculParameter findCalculParameterByCalcul(Calcul calcul)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM CalculParameter c WHERE c.calcul.id = :calcul");
       	query.setParameter("calcul", calcul.getId());
    	
    	// Get all
    	try
    	{
    		return (CalculParameter) query.getSingleResult();
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
