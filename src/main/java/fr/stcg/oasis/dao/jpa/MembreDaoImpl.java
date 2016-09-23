package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.Member;
import fr.stcg.oasis.dao.MembreDao;

public class MembreDaoImpl extends AbstractJpaDao<Member> implements MembreDao {
	
	public MembreDaoImpl() 
	{
		super(Member.class);
	}
}
