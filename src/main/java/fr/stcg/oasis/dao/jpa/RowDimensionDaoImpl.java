package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.dao.RowDimensionDao;

public class RowDimensionDaoImpl extends AbstractJpaDao<RowDimension> implements RowDimensionDao
{
	public RowDimensionDaoImpl()
	{
		super(RowDimension.class);
	}
}
