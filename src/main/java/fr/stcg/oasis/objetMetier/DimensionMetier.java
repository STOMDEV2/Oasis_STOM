package fr.stcg.oasis.objetMetier;

import java.util.ArrayList;
import java.util.Iterator;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.dao.DaoFactory;

public class DimensionMetier {
	
	public static ArrayList<Dimension> saveDimensions(ArrayList<Dimension> dimensions, Cube cube)
	{
		try
		{
			
			Iterator<Dimension> itDimensions = dimensions.iterator();
			int i = 0;
			
			while(itDimensions.hasNext())
			{
				
				Dimension dimensionToAdd = (Dimension) itDimensions.next();
				
				dimensionToAdd.setCube(cube);
				dimensionToAdd = DaoFactory.getDimensionDao().add(dimensionToAdd);
				dimensions.set(i, dimensionToAdd);
				
				i++;
			}
			
			return dimensions;
		}
		catch(Exception e)
		{
			System.err.println(e.getMessage());
		}
		return null;
	}
}
