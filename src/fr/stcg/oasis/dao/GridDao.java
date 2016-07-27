package fr.stcg.oasis.dao;

import java.util.List;

import fr.stcg.oasis.beans.Grid;

public interface GridDao
{
	public List<Grid> findGridsByUser(int userId);

	List<Grid> findGridsByMask(int maskId);
}
