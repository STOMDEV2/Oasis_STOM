package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.annotations.Expose;

@Entity
public class Calcul implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	private int id;
	
	@Expose
	private String name;
	
	@Expose
	private Date creationDate;
	
	@Expose
	private Date lastUpdateDate;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private User creator;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private User lastEditor;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private Cube cube;
	
	@OneToMany(mappedBy = "calcul", fetch = FetchType.LAZY, orphanRemoval = true)
	@Expose
	@OrderBy("position")
	private Collection<OrderedScript> orderedScripts;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "calcul", orphanRemoval = true)
	@Expose
	private Collection<VariableParameter> variableParameters;
	
	@OneToMany(mappedBy = "calcul", fetch = FetchType.LAZY, orphanRemoval = true)
//	@Expose
	private Collection<HistoricCalculLaunch> historicCalculLaunch;
	
	@OneToMany(mappedBy = "calcul", fetch = FetchType.LAZY, orphanRemoval = true)
	@Expose
	private Collection<TreeSelection> treeSelections;
	
	
	
	
	public Calcul()
	{
		
	}
	
	
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Collection<OrderedScript> getOrderedScripts() {
		return orderedScripts;
	}
	public void setOrderedScripts(Collection<OrderedScript> orderedScripts) {
		this.orderedScripts = orderedScripts;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	public User getCreator() {
		return creator;
	}
	public void setCreator(User creator) {
		this.creator = creator;
	}
	public User getLastEditor() {
		return lastEditor;
	}
	public void setLastEditor(User lastEditor) {
		this.lastEditor = lastEditor;
	}
	public Cube getCube() {
		return cube;
	}
	public void setCube(Cube cube) {
		this.cube = cube;
	}
	public Collection<HistoricCalculLaunch> getHistoricCalculLaunch() {
		return historicCalculLaunch;
	}
	public void setHistoricCalculLaunch(
			Collection<HistoricCalculLaunch> historicCalculLaunch) {
		this.historicCalculLaunch = historicCalculLaunch;
	}
	public Collection<TreeSelection> getTreeSelections() {
		return treeSelections;
	}
	public void setTreeSelections(Collection<TreeSelection> treeSelections) {
		this.treeSelections = treeSelections;
	}
	public Collection<VariableParameter> getVariableParameters() {
		return variableParameters;
	}
	public void setVariableParameters(
			Collection<VariableParameter> variableParameters) {
		this.variableParameters = variableParameters;
	}


	
	


	public void makeItReplicable()
	{
		try
		{
			this.setId(0);
			
			BeanUtils.setProperty(this, "pcVersionInit", false);
		}
		catch (IllegalAccessException e)
		{
			e.printStackTrace();
		}
		catch (InvocationTargetException e)
		{
			e.printStackTrace();
		}
	}
}
