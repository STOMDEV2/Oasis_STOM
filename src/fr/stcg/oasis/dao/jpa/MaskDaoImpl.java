package fr.stcg.oasis.dao.jpa;

import java.sql.SQLException;
import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.dao.MaskDao;
import fr.stcg.oasis.utility.PersistenceManager;



public class MaskDaoImpl extends AbstractJpaDao<Mask> implements MaskDao {
	

	
	// Requete SQL Style
	private static final String SQL_SELECT_STYLE_PAR_ID = "select * from style where idStyle = ?";
	private static final String SQL_SELECT_STYLE_PAR_NOM = "select * from style where nomStyle = ?";
	private static final String SQL_UPDATE_STYLE = "UPDATE style(nomStyle,selector) VALUES(?,?) WHERE idStyle =?";
	private static final String SQL_INSERT_STYLE = "INSERT INTO style(nomStyle,selector) VALUES(?,?)";
	

	public MaskDaoImpl() {
		super(Mask.class);
	}


	@Override
	public ArrayList<Mask> findMaskByCube(String cube) throws SQLException {
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM Mask AS c WHERE c.cube = :cube");
    	query.setParameter("cube", cube);
    	
    	// Get all
    	try
    	{
    		return (ArrayList<Mask>) query.getResultList();
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
	public ArrayList<Mask> findMaskByUser(int idUser, Cube cube) throws SQLException {
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM Mask AS c WHERE c.author.id = :id AND c.cube = :cube");
    	query.setParameter("id", idUser);
    	query.setParameter("cube", cube);
    	
    	// Get all
    	try
    	{
    		return (ArrayList<Mask>) query.getResultList();
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
	public Mask findMaskByName(String nameMask) throws SQLException {
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM Mask AS c WHERE c.nameMask = :nameMask");
    	query.setParameter("nameMask", nameMask);
    	
    	
    	// Get all
    	try
    	{
    		return (Mask) query.getSingleResult();
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
	public ArrayList<ColumnContext> findTypeColumnContext(Mask mask, String type) throws SQLException {
		
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();

    	Query query = em.createQuery("select cc from ColumnContext cc where cc.mask = :mask and cc.type.value = :type");

    	query.setParameter("mask", mask);
    	query.setParameter("type", type);
    	
    	// Get all
    	try
    	{	
    		ArrayList<ColumnContext> columnContexts = new ArrayList<ColumnContext>(query.getResultList());
    		

//    		for(ColumnContext cc : columnContexts)
//    		{
//    			for(ColumnDimension c : cc.getColumnsDimensions())
//    			{
//    				c.getId();
//    				c.getValue();
//    				c.getDimension();
//    				c.getState();
//    			}
//    		}

    			
    		return columnContexts;
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
    	

//		return null;

//		return null;

	}


	@Override
	public ArrayList<HeaderDimension> findTypeHeaderDimension(Mask mask, boolean retrieve) throws SQLException {
		
		
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("select hd from HeaderDimension hd where hd.mask = :mask and hd.retrieve = :retrieve");
    	query.setParameter("mask", mask);
    	query.setParameter("retrieve",retrieve);
    	// Get all
    	try
    	{
    		return (ArrayList<HeaderDimension>) query.getResultList();
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
