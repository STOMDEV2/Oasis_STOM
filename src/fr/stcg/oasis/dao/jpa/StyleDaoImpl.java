package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.Style;
import fr.stcg.oasis.dao.StyleDao;

public class StyleDaoImpl extends AbstractJpaDao<Style> implements StyleDao
{
	public StyleDaoImpl()
	{
		super(Style.class);
	}
}
