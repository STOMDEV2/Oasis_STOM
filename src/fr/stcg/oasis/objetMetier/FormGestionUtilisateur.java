package fr.stcg.oasis.objetMetier;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.mysql.jdbc.exceptions.MySQLIntegrityConstraintViolationException;

import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.dao.UserDao;

public class FormGestionUtilisateur {

	private static final String JSON_NOM = "name";
	private static final String JSON_LOGIN_TO_MODIFY = "loginToModify";
	private static final String JSON_LOGIN = "login";
	private static final String JSON_PROFILE = "profile";
	private static final String JSON_PRENOM = "firstname";
	private static final String JSON_EMAIL = "mail";
	private static final String JSON_TEL = "phone";

	private String resultat;
	private Map<String, String> erreurs = new HashMap<String, String>(); //!!!!! à revoir surtout avec les bails contrainte d'intégrité peut etre s'en servir non 
	

	public FormGestionUtilisateur() {
		
	}

	public Map<String, String> getErreurs() {
		return erreurs;
	}

	public String getResultat() {
		return resultat;
	}
	
	

	// Ajouter un utilisateur dans la base de données
	public String AjouteUtilisateur(HttpServletRequest request) throws SQLException, java.io.IOException, MySQLIntegrityConstraintViolationException, Exception
	{
		
    	HashMap<String,String> inputs = fr.stcg.oasis.utility.Servlet.JSONToHashMapStringString(request);
    
		String nom = inputs.get(JSON_NOM);
		String login = inputs.get(JSON_LOGIN);
		int profile = Integer.parseInt(inputs.get(JSON_PROFILE));
		String prenom = inputs.get(JSON_PRENOM);
		String email = inputs.get(JSON_EMAIL);
		String tel = inputs.get(JSON_TEL);
		
		System.out.print(nom);
		System.out.print(login);
		System.out.print(profile);
		System.out.print(prenom);
		System.out.print(email);
		System.out.print(tel);
		
		User utilisateur = new User();
		utilisateur.setName(nom);
		utilisateur.setLogin(login);
		utilisateur.setProfile(DaoFactory.getProfileDao().findById(profile));
		utilisateur.setFirstname(prenom);
		utilisateur.setEmail(email);
		utilisateur.setTel(tel);
		

		DaoFactory.getUserDao().add(utilisateur);
		
		return "Utilisateur " + login + " ajouté !";
		
	}
	
	public User isUser(HttpServletRequest request) throws  SQLException, java.io.IOException 
	{
		
		HashMap<String, String> inputs = fr.stcg.oasis.utility.Servlet.JSONToHashMapStringString(request);
		String login = inputs.get(JSON_LOGIN_TO_MODIFY);
		User user = DaoFactory.getUserDao().trouverUtilisateurParLogin(login);
		
		if (user != null )
		{
			return user;
		} 
		
		return null;
	}
	
	
	public String supprimerUtilisateur(HttpServletRequest request) throws  SQLException, java.io.IOException, Exception {
		
    	HashMap<String,String> inputs = fr.stcg.oasis.utility.Servlet.JSONToHashMapStringString(request);
    	
		String login = inputs.get(JSON_LOGIN);
		
		User user = DaoFactory.getUserDao().trouverUtilisateurParLogin(login);
		
		if(user != null)
		{
			DaoFactory.getUserDao().remove(user.getId());
			return "Utilisateur " + login + " supprimé";
		}
		
		
		return "Utilisateur introuvable";
	}


	public HashMap<String, String> modifierUtilisateur(HttpServletRequest request) throws SQLException, java.io.IOException, Exception
	{
		
		HashMap<String, String> inputs = fr.stcg.oasis.utility.Servlet.JSONToHashMapStringString(request);
		String loginToModify = inputs.get(JSON_LOGIN_TO_MODIFY);
		String login = inputs.get(JSON_LOGIN);
		HashMap<String, String> outputs = null;
		User utilisateurAModifier = DaoFactory.getUserDao().trouverUtilisateurParLogin(loginToModify);
		
		
		if(utilisateurAModifier.getLogin().equals(login))
		{
			outputs = new HashMap<String, String>();
			outputs.put("message", "Utilisateur "+ utilisateurAModifier.getLogin() +" modifié !");
		}
		else
		{
			outputs = new HashMap<String, String>();
			outputs.put("message", "Utilisateur " + utilisateurAModifier.getLogin() + " devenu " + loginToModify + " modifié !" );
			outputs.put("loginOriginal", utilisateurAModifier.getLogin());
			outputs.put("loginModified",inputs.get(JSON_LOGIN_TO_MODIFY));
		}
		 
		
		utilisateurAModifier.setLogin(inputs.get(JSON_LOGIN));
		utilisateurAModifier.setProfile(DaoFactory.getProfileDao().findById(Integer.parseInt(inputs.get(JSON_PROFILE))));
		utilisateurAModifier.setName(inputs.get(JSON_NOM));
		utilisateurAModifier.setFirstname(inputs.get(JSON_PRENOM));
		utilisateurAModifier.setEmail(inputs.get(JSON_EMAIL));
		utilisateurAModifier.setTel(inputs.get(JSON_TEL)); 
		DaoFactory.getUserDao().update(utilisateurAModifier);

		return outputs;
	}

	// à voir si bien placé et ok 
	public String getError(MySQLIntegrityConstraintViolationException e) throws java.io.IOException {
		
		
		String error = "";
		
		switch(e.getErrorCode())
		{
			case 1062 : 
						error = "Le login _ est déjà utilisé.";
						break;
			default : 
						error = "Une contrainte d'intégrité n'est pas respecté.";
						break;
		}
		
		return error;
	}
}
