package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.google.gson.annotations.Expose;

@Entity
public class Profile implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	int idProfile;
	
	@Expose
	String name;
	
	@Expose
	boolean rapport;
	
	@Expose
	boolean masque;
	
	@Expose
	boolean isCalculAdmin;
	
	@Expose
	boolean administration;
	
	
	public Profile() {
		
	}
	
	@Override
	public String toString() {
		return "Profil [idProfile=" + idProfile + ", name=" + name + ", rapport="
				+ rapport + ", masque=" + masque + ", administration="
				+ administration + ", getIdProfil()=" + getIdProfile()
				+ ", getName()=" + getName() + ", isRapport()=" + isRapport()
				+ ", isMasque()=" + isMasque() 
				+ ", isAdministration()=" + isAdministration()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}
	public int getIdProfile() {
		return idProfile;
	}
	public void setIdProfile(int id) {
		this.idProfile = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean isRapport() {
		return rapport;
	}
	public void setRapport(boolean rapport) {
		this.rapport = rapport;
	}
	public boolean isMasque() {
		return masque;
	}
	public void setMasque(boolean masque) {
		this.masque = masque;
	}
	public boolean isAdministration() {
		return administration;
	}
	public void setAdministration(boolean administration) {
		this.administration = administration;
	}

	public boolean isCalculAdmin() {
		return isCalculAdmin;
	}

	public void setCalculAdmin(boolean isCalculAdmin) {
		this.isCalculAdmin = isCalculAdmin;
	}

}
