package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.Calcul;
import fr.stcg.oasis.beans.CalculParameter;
import fr.stcg.oasis.beans.Dimension;

public interface CalculParameterDao {

	CalculParameter findCalculParameterByCalcul(Calcul calcul);

}
