package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.GridStyle;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.dao.GridStyleDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class GridStyleDaoImpl extends AbstractJpaDao<GridStyle> implements GridStyleDao
{
	public GridStyleDaoImpl()
	{
		super(GridStyle.class);
	}
	
	@Override
	public GridStyle findGridStyleByColumnContextAndRowContextAndGrid(ColumnContext columnContext, RowContext rowContext, Grid grid)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT g FROM GridStyle g WHERE g.columnContext.id = :columnContext AND g.rowContext.id = :rowcontext AND g.grid.id = :grid");
       	query.setParameter("columnContext", columnContext.getId());
       	query.setParameter("rowcontext", rowContext.getId());
       	query.setParameter("grid", grid.getId());
    	
    	// Get all
    	try
    	{
    		return (GridStyle) query.getSingleResult();
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
