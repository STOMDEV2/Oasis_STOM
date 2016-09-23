package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

@Entity
public class VariableParameter implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_DIMENSION = "dimension";
	private static final String JSON_VARIABLE = "variable";
	private static final String JSON_ISSIMPLEVALUE = "isSimpleValue";
	private static final String JSON_LEVELS = "levels";
	private static final String JSON_GENS = "gens";
	private static final String JSON_UDAS = "udas";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@Expose
	private String variable;
	
	@Expose
	private boolean isSimpleValue;
	
	@Expose
	private String levels;
	
	@Expose
	private String gens;
	
	@Expose
	private String UDAs;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private Dimension dimension;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Calcul calcul;
	
	
	
	
	
	
	public VariableParameter()
	{
		
	}


	
	
	
	
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getVariable() {
		return variable;
	}
	public void setVariable(String variable) {
		this.variable = variable;
	}
	public boolean isSimpleValue() {
		return isSimpleValue;
	}
	public void setSimpleValue(boolean isSimpleValue) {
		this.isSimpleValue = isSimpleValue;
	}
	public String getLevels() {
		return levels;
	}
	public void setLevels(String levels) {
		this.levels = levels;
	}
	public String getGens() {
		return gens;
	}
	public void setGens(String gens) {
		this.gens = gens;
	}
	public String getUDAs() {
		return UDAs;
	}
	public void setUDAs(String uDAs) {
		UDAs = uDAs;
	}
	public Dimension getDimension() {
		return dimension;
	}
	public void setDimension(Dimension dimension) {
		this.dimension = dimension;
	}
	public Calcul getCalcul() {
		return calcul;
	}
	public void setCalcul(Calcul calcul) {
		this.calcul = calcul;
	}



	
	
	





	public static VariableParameter getVariableParameterFromJSON(JsonObject variableParameterJSON)
	{
		VariableParameter variableParameter = new VariableParameter();
		
		Dimension dimension = new Dimension();
		dimension.setName(variableParameterJSON.get(JSON_DIMENSION).getAsString());
		variableParameter.setDimension(dimension);
		
		variableParameter.setVariable(variableParameterJSON.get(JSON_VARIABLE).getAsString());
		variableParameter.setSimpleValue(variableParameterJSON.get(JSON_ISSIMPLEVALUE).getAsBoolean());
		variableParameter.setLevels(variableParameterJSON.get(JSON_LEVELS).getAsString());
		variableParameter.setGens(variableParameterJSON.get(JSON_GENS).getAsString());
		variableParameter.setUDAs(variableParameterJSON.get(JSON_UDAS).getAsString());
		
		return variableParameter;
	}
}
