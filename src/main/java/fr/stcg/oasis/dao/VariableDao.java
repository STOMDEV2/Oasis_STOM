package fr.stcg.oasis.dao;

import java.util.ArrayList;
import java.util.HashMap;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Variable;

public interface VariableDao {
	
	public ArrayList<Variable> findVariablesByCube(Cube cube);
	public HashMap<String, ArrayList<Variable>> findVariablesPerDimensionByCube(Cube cube);
	Variable findVariableByNameAndCube(String variable);
}
