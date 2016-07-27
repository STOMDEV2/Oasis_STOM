package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.dao.HeaderDimensionDao;

public class HeaderDimensionDaoImpl extends AbstractJpaDao<HeaderDimension> implements HeaderDimensionDao {
	
	public HeaderDimensionDaoImpl()
	{
		super(HeaderDimension.class);
	}
}
