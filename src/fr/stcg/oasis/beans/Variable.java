package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.Collection;

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

import fr.stcg.oasis.dao.DaoFactory;

@Entity
@Table(
		uniqueConstraints = { @UniqueConstraint(columnNames = 
    {"name","associatedDimension_id"}) })

public class Variable implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	private int id;
	
	@Expose
	private String name;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	@Expose
	private Dimension associatedDimension;
	
	@OneToMany(mappedBy = "variable", orphanRemoval = true)
	private Collection<ScenarioParameter> scenarioParemeters;
	
	
	
	public Variable() {
		
	}
	
	
	public Variable(int id, String name, String associatedDimension, int idCube) throws Exception
	{
		this.id = id;
		this.name = name;
		Cube cube = DaoFactory.getCubeDao().findById(idCube);
		this.associatedDimension = DaoFactory.getDimensionDao().findDimensionByName(associatedDimension, cube);
	
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
	public Dimension getAssociatedDimension() {
		return associatedDimension;
	}
	public void setAssociatedDimension(Dimension associatedDimension) {
		this.associatedDimension = associatedDimension;
	}
	public Collection<ScenarioParameter> getScenarioParemeters() {
		return scenarioParemeters;
	}
	public void setScenarioParemeters(Collection<ScenarioParameter> scenarioParemeters) {
		this.scenarioParemeters = scenarioParemeters;
	}

	
	
	

//	@Override
//	public String toString() {
//		return "Variable [id=" + id + ", name=" + name + ", " + associatedDimension + " =" + associatedDimension.getName() + "]";
//	}
}
