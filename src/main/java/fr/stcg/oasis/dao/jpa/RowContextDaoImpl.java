package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.dao.RowContextDao;

public class RowContextDaoImpl extends AbstractJpaDao<RowContext> implements RowContextDao
{
	public RowContextDaoImpl()
	{
		super(RowContext.class);
	}
	
	
}
