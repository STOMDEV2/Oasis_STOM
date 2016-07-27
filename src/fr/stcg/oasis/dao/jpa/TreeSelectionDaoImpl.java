package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.TreeSelection;
import fr.stcg.oasis.dao.TreeSelectionDao;

public class TreeSelectionDaoImpl extends AbstractJpaDao<TreeSelection> implements TreeSelectionDao
{
	public TreeSelectionDaoImpl()
	{
		super(TreeSelection.class);
	}
}
