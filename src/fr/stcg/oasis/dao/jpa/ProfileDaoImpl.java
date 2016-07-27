package fr.stcg.oasis.dao.jpa;

import fr.stcg.oasis.beans.Profile;
import fr.stcg.oasis.dao.ProfileDao;

public class ProfileDaoImpl extends AbstractJpaDao<Profile> implements ProfileDao {
	
	public ProfileDaoImpl() 
	{
		super(Profile.class);
	}

	@Override
	public void initProfile() throws Exception {
		
		System.out.println(this.findAll().size());
		
		if( this.findAll().size() == 0) 
		{
			Profile profile = new Profile();
			
			profile.setAdministration(true);
			profile.setCalculAdmin(true);
			profile.setMasque(true);
			profile.setName("administrateur");
			profile.setRapport(true);
			
			this.add(profile);
			
			profile = new Profile();
			
			profile.setAdministration(false);
			profile.setCalculAdmin(false);
			profile.setMasque(false);
			profile.setName("utilisateur");
			profile.setRapport(true);
			
			this.add(profile);
			
			profile = new Profile();
			
			profile.setAdministration(false);
			profile.setCalculAdmin(true);
			profile.setMasque(false);
			profile.setName("super utilisateur");
			profile.setRapport(true);
			
			this.add(profile);
		}
		
	}
	
	

}
