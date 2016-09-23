package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.google.gson.annotations.Expose;

@Entity
public class User implements Serializable {
	

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	int id;
	
	@Expose
	String login;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	Profile profile;
	
	@Expose
	String name;
	
	@Expose
	String firstname;
	
	@Expose
	String email;
	
	@Expose
	String tel;
	
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getLogin() {
		return login;
	}
	
	public void setLogin(String login) {
		this.login = login;
	}
	
	public Profile getProfile() {
		return profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}
	
	
	
	
	@Override
	public String toString() {
		return "Utilisateur [id=" + id + ", login =" + login + ", idProfil =" + profile + ", nom=" + name + ", prenom=" + firstname
				+ ", email=" + email + ", tel=" + tel
				+ "]";
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String forename) {
		this.firstname = forename;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}
}