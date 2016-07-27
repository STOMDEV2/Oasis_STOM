package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.annotations.Expose;

@Entity
public class ScenarioParameter implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private Variable variable;
	
	@Expose
	private boolean isRetrieve;
	
	@Expose
	private String value;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Grid grid;
	
	
	
	
	public ScenarioParameter()
	{
		
	}


	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public Grid getGrid() {
		return grid;
	}
	public void setGrid(Grid grid) {
		this.grid = grid;
	}
	public Variable getVariable() {
		return variable;
	}
	public void setVariable(Variable variable) {
		this.variable = variable;
	}
	public boolean isRetrieve() {
		return isRetrieve;
	}
	public void setRetrieve(boolean isRetrieve) {
		this.isRetrieve = isRetrieve;
	}




	public void makeItReplicable()
	{
		this.setId(0);
		
		try
		{
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