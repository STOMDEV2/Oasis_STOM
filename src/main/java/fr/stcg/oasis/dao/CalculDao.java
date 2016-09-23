package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.Cube;

public interface CalculDao {

	Calcul findCalculByCubeAndName(Cube cube, String name);

}
