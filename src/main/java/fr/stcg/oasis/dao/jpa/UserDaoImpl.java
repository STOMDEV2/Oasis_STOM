package fr.stcg.oasis.dao.jpa;

import java.sql.SQLException;

import javax.jws.WebService;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.dao.UserDao;
import fr.stcg.oasis.utility.PersistenceManager;

//@WebService(endpointInterface = "DAO.UtilisateurDao")
public class UserDaoImpl extends AbstractJpaDao<User> implements UserDao {

	
	
	private static final String SQL_SELECT_TOUT = "Select * from utilisateur;";
	private static final String SQL_SELECT_LOGIN = "Select * from utilisateur where login = ?;";
	private static final String SQL_SELECT_TOUS_LOGIN = "Select login from utilisateur;";
	private static final String SQL_SELECT_UTILISATEUR = "Select * from utilisateur where idUtilisateur = ?;";
	private static final String SQL_INSERT = "INSERT INTO utilisateur (login,idProfil,nom,prenom,email,tel) VALUES (?, ?, ?, ?, ?, ?)";
	private static final String SQL_UPDATE_UTILISATEUR = "UPDATE utilisateur SET login = ?, idProfil = ?, nom = ?, prenom = ?, email = ?, tel = ? WHERE idUtilisateur=?";
	private static final String SQL_DELETE_UTILISATEUR = "DELETE FROM utilisateur WHERE login = ?";
	private static final String SQL_SELECT_USER_PAR_LOGIN = "select * from utilisateur where login = ?";
	
	public UserDaoImpl() {
		super(User.class);
	}	
	
	@Override
	public User trouverUtilisateurParLogin(String login) throws SQLException 
	{
		// Init
    	EntityManager em = PersistenceManager.getEntityManagerFactory().createEntityManager();
    	Query query = em.createQuery("SELECT c FROM User AS c WHERE c.login = :login");
    	query.setParameter("login", login);
    	
    	// Get all
    	try
    	{
    		return (User) query.getSingleResult();
    	}
    	catch(NoResultException e)
    	{
    		return null;
    	}
    	finally
    	{
    		if (em.isOpen()) 
                em.close();
    	}
	}

	@Override
	public void initUser() throws Exception {
		if(this.findAll().size() == 0)
		{
			User user = new User();
			
			user.setLogin("admin");
			user.setFirstname("admin");
			user.setName("administrateur");
			user.setEmail("admin@stcg.fr");
			user.setTel("0606060606");
			user.setProfile(DaoFactory.getProfileDao().findAll().get(0));
			
			this.add(user);
			
			// Add second user to the DB...
			
			User user2 = new User();
			
			user2.setLogin("test");
			user2.setFirstname("testoLeRobot");
			user2.setName("testeur");
			user2.setEmail("test@stcg.fr");
			user2.setTel("0606060606");
			user2.setProfile(DaoFactory.getProfileDao().findAll().get(0));
			
			this.add(user2);
		}
		
	}

		
}

			

	
	
	
