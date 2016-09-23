package fr.stcg.oasis.objetMetier;

import java.sql.SQLException;

import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.dao.UserDao;

public class UtilisateurObjetMetier {
	
	private UserDao utilisateurDao;
	private String resultat;
	
	public UtilisateurObjetMetier(UserDao utilisateurDao) {
		this.utilisateurDao = utilisateurDao;
	}
	
	public User trouverId(int id) throws  SQLException
	{
		
		User utilisateur = new User();
		
		try
		{
			utilisateur = DaoFactory.getUserDao().findById(id);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			resultat = "échec de la recherche";
		}
		
		return utilisateur;
	}
	
	public User trouverUtilisateurParLogin(String login) throws  SQLException
	{
		User utilisateur = new User();
		
		try
		{
			utilisateur = DaoFactory.getUserDao().trouverUtilisateurParLogin(login);
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
			resultat = "échec de la recherche";
			
		}
		
		return utilisateur;
	}

}
