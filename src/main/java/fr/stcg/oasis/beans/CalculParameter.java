package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

@Entity
public class CalculParameter implements Serializable
{
	private static final long serialVersionUID = 1L;

	private static final String JSON_VARIABLEPARAMETERS = "variableParameters";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@OneToOne(fetch = FetchType.LAZY)
	private Calcul calcul;
	
//	@OneToMany(fetch = FetchType.LAZY, mappedBy = "calculParameter", orphanRemoval = true)
//	@Expose
//	private Collection<VariableParameter> variableParameters;

	
	
	
	
	
	public CalculParameter()
	{
		
	}





	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Calcul getCalcul() {
		return calcul;
	}
	public void setCalcul(Calcul calcul) {
		this.calcul = calcul;
	}
//	public Collection<VariableParameter> getVariableParameters() {
//		return variableParameters;
//	}
//	public void setVariableParameters(Collection<VariableParameter> variableParameters) {
//		this.variableParameters = variableParameters;
//	}



	
	


	public static CalculParameter getCalculParameterFromJSON(JsonObject calculParameterJSON)
	{
		CalculParameter calculParameter = new CalculParameter();
//		calculParameter.setVariableParameters(new ArrayList<VariableParameter>());
//		
//		JsonArray variablesParameters = calculParameterJSON.getAsJsonArray(JSON_VARIABLEPARAMETERS);
//		for(int i = 0; i < variablesParameters.size(); i++)
//		{
//			JsonObject variableParameterJSON = (JsonObject)variablesParameters.get(i);
//			
//			VariableParameter variableParameter = VariableParameter.getVariableParameterFromJSON(variableParameterJSON);
//			
//			calculParameter.getVariableParameters().add(variableParameter);
//		}
		
		return calculParameter;
	}
}
