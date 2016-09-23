package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.dao.ColumnContextDao;

public class ColumnContextDaoImpl extends AbstractJpaDao<ColumnContext> implements ColumnContextDao {

	public ColumnContextDaoImpl()
	{
		super(ColumnContext.class);
	}
}
