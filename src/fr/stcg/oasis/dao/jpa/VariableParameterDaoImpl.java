package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.VariableParameter;
import fr.stcg.oasis.dao.VariableParameterDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class VariableParameterDaoImpl extends AbstractJpaDao<VariableParameter> implements VariableParameterDao
{
	public VariableParameterDaoImpl()
	{
		super(VariableParameter.class);
	}
	
	@Override
	public VariableParameter findVariableParameterByCalculAndName(Calcul calcul, String variableName)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT v FROM VariableParameter v WHERE v.calcul.id = :calcul AND v.variable = :variable");
       	query.setParameter("calcul", calcul.getId());
       	query.setParameter("variable", variableName);
    	
    	// Get all
    	try
    	{
    		return (VariableParameter) query.getSingleResult();
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
