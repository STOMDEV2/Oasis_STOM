package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.OrderedScript;
import fr.stcg.oasis.dao.OrderedScriptDao;

public class OrderedScriptDaoImpl extends AbstractJpaDao<OrderedScript> implements OrderedScriptDao
{
	public OrderedScriptDaoImpl()
	{
		super(OrderedScript.class);
	}
}
