package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.ScenarioParameter;

public interface ScenarioParameterDao {

	ScenarioParameter getScenarioParameterByVariableAndGrid(String value,
			Grid grid, boolean isRetrieve);
}
