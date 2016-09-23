package fr.stcg.oasis.objetMetier;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.dao.DaoFactory;

public class CubeMetier {
	
	public static boolean isCube(Cube cube)
	{
		try
		{
			Cube cubeExist = DaoFactory.getCubeDao().findCubeByApplicationName(cube.getApplication(), cube.getName());
			
			if(!cubeExist.equals(null))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		catch(Exception e)
		{
			System.err.println(e.getMessage());
		}
		
		return false;
	}
	
	public static Cube addCube(Cube cube)
	{
		try
		{
			if(!isCube(cube))
			{
				return DaoFactory.getCubeDao().add(cube);
			
			}
			
		}
		catch(Exception e)
		{
			System.err.println(e.getMessage());
		}
		
		return null;
	}
}
