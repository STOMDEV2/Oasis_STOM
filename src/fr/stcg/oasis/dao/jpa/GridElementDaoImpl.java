package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.GridElement;
import fr.stcg.oasis.dao.GridElementDao;

public class GridElementDaoImpl extends AbstractJpaDao<GridElement> implements GridElementDao
{
	public GridElementDaoImpl()
	{
		super(GridElement.class);
	}
	
	
}
