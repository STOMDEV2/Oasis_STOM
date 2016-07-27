package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.Collection;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.google.gson.annotations.Expose;


@Entity
@Table(
uniqueConstraints = { @UniqueConstraint(columnNames = 
                                        { "alias", "name","cube_id" }) })
public class Dimension implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	@Expose
	private int id;
	
	@Expose
	private String name;
	
	@Column(nullable = true)
	@Expose
	private String alias;
	
//	@Expose
//	@OneToMany(mappedBy = "associatedDimension")
//	private Collection<Membre> membres;
	
	@OneToMany(mappedBy="dimension")
	private Collection<HeaderDimension> headerDimension;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="cube_id")
//	@Expose
	private Cube cube;
	
	@OneToMany(mappedBy = "associatedDimension")
	private Collection<Variable> variable;
	
	public Dimension() {
		
	}
	
	public Dimension(String name, String alias, Cube cube)
	{
		if( !name.equals(null) && !alias.equals(null) && cube != null)
		{
			this.name = name;
			this.alias = alias;
			this.cube = cube;
		}
	}
	
	
	
	

	public Collection<HeaderDimension> getHeaderDimension() {
		return headerDimension;
	}

	public void setHeaderDimension(Collection<HeaderDimension> headerDimension) {
		this.headerDimension = headerDimension;
	}

	public Cube getCube() {
		return cube;
	}

	public void setCube(Cube cube) {
		this.cube = cube;
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

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}


	public Collection<Variable> getVariable() {
		return variable;
	}

	public void setVariable(Collection<Variable> variable) {
		this.variable = variable;
	}

	
	

//	public Collection<Membre> getMembres() {
//		return membres;
//	}
//
//	public void setMembres(Collection<Membre> membres) {
//		this.membres = membres;
//	}

//	@Override
//	public String toString() {
//		return "Dimension [id=" + id + ", name=" + name + ", alias=" + alias
//				+ ",  variable=" + variable + "]";
//	}

	
	
	
	
	
}
