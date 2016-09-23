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
public class TreeSelection implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@Expose
	private String name;
	
	@Expose
	private String members;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Calcul calcul;
	
	
	
	
	public TreeSelection()
	{
		
	}




	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMembers() {
		return members;
	}
	public void setMembers(String members) {
		this.members = members;
	}
	public Calcul getCalcul() {
		return calcul;
	}
	public void setCalcul(Calcul calcul) {
		this.calcul = calcul;
	}
}
