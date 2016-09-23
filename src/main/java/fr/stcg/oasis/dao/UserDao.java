package fr.stcg.oasis.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.jws.WebMethod;
import javax.jws.WebService;

import com.mysql.jdbc.exceptions.MySQLIntegrityConstraintViolationException;

import fr.stcg.oasis.beans.User;


@WebService
	public interface UserDao {

		
		public User trouverUtilisateurParLogin(String login) throws SQLException ;
		public void initUser() throws Exception;
	    
}