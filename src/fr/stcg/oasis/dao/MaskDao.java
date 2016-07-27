package fr.stcg.oasis.dao;

import java.sql.SQLException;
import java.util.ArrayList;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.RowContext;

public interface MaskDao {

	// Masque
	
	public ArrayList<Mask> findMaskByCube(String cube) throws  SQLException;
	
	public Mask findMaskByName(String nameMask) throws SQLException;

	ArrayList<Mask> findMaskByUser(int idUser, Cube cube) throws SQLException;
	
	ArrayList<ColumnContext> findTypeColumnContext(Mask mask, String type) throws SQLException;
	
	ArrayList<HeaderDimension> findTypeHeaderDimension(Mask mask, boolean retrieve) throws SQLException;
	
}
