package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.VariableParameter;

public interface VariableParameterDao {

	VariableParameter findVariableParameterByCalculAndName(Calcul calcul,
			String variableName);

}
