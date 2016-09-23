package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.dao.ColumnDimensionDao;

public class ColumnDimensionDaoImpl extends AbstractJpaDao<ColumnDimension> implements ColumnDimensionDao
{
	public ColumnDimensionDaoImpl()
	{
		super(ColumnDimension.class);
	}
}
