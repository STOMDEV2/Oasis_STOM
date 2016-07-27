package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.HistoricCalculLaunch;
import fr.stcg.oasis.dao.HistoricCalculLaunchDao;

public class HistoricCalculLaunchDaoImpl extends AbstractJpaDao<HistoricCalculLaunch> implements HistoricCalculLaunchDao
{
	public HistoricCalculLaunchDaoImpl()
	{
		super(HistoricCalculLaunch.class);
	}
}
