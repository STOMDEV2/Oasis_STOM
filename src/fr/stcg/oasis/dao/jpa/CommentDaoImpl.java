package fr.stcg.oasis.dao.jpa;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Comment;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.dao.CommentDao;
import fr.stcg.oasis.utility.PersistenceManager;

public class CommentDaoImpl extends AbstractJpaDao<Comment> implements CommentDao 
{
	public CommentDaoImpl()
	{
		super(Comment.class);
	}
	
	@Override
	public Comment findCommentByColumnAndRowAndGrid(ColumnContext columnContext, RowContext rowContext, Grid grid)
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM Comment AS c WHERE c.columnContext.id = :columnContext AND c.rowContext.id = :rowContext AND c.grid.id = :grid");
    	query.setParameter("columnContext", columnContext.getId());
    	query.setParameter("rowContext", rowContext.getId());
    	query.setParameter("grid", grid.getId());
    	
    	
    	// Get all
    	try
    	{
    		return (Comment) query.getSingleResult();
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
