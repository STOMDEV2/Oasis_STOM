package fr.stcg.oasis.dao;

import java.sql.SQLException;

import fr.stcg.oasis.beans.Cube;

public interface CubeDao {
	
	public Cube findCubeByApplicationName(String application, String name) throws SQLException;
}
