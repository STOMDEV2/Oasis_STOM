package fr.stcg.oasis.dao;

import java.util.ArrayList;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;

public interface DimensionDao {
	
	public ArrayList<Dimension> findDimensionsByCube(Cube cube);
	public Dimension findDimensionByName(String dimension, Cube cube);
}
