package fr.stcg.oasis.utility;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.RowDimension;

public class ContextChecker
{
	public static boolean checkIfColumnContextHasEmptyColumns(JsonArray array)
	{
		for(JsonElement element : array)
		{
			ColumnContext columnContext = ColumnContext.getColumnContextFromJSON((JsonObject)element);
			
			if(columnContext.getTitle().equals(""))
				return true;
			
			for(ColumnDimension columnDimension : columnContext.getColumnsDimensions())
				if(columnDimension.getGridElement().getValue().equals("") && !columnContext.getType().equals("Comment")
						&& (!columnContext.getType().equals("Formula") || 
								(columnContext.getType().equals("Formula") && checkIfFormulaContextHasAllEmptyFields(columnContext))))
					return true;
		}
		
		return false;
	}
	
	private static boolean checkIfFormulaContextHasAllEmptyFields(ColumnContext columnContext)
	{
		if(!columnContext.getType().equals("Formula"))
			return false;
		
		for(ColumnDimension columnDimension : columnContext.getColumnsDimensions())
			if(!columnDimension.getGridElement().getValue().equals(""))
				return false;
		
		return true;
	}
	
	
	
	public static boolean checkIfRowContextHasEmptyColumns(JsonArray array)
	{
		for(JsonElement element : array)
		{
			RowContext rowContext = RowContext.getRowContextFromJSON((JsonObject)element);
			
			if(rowContext.getTitle().equals(""))
				return true;
			
			boolean isFormulaContext = false;
			for(RowDimension rowDimension : rowContext.getRowDimensions())
				if(rowDimension.getDimension().getName().equals("Formule") && !rowDimension.getGridElement().getValue().equals(""))
					isFormulaContext = true;
			
			for(RowDimension rowDimension : rowContext.getRowDimensions())
				if((rowDimension.getGridElement().getValue().equals("") && !rowDimension.getDimension().getName().equals("Formule") 
						&& !isFormulaContext)
						|| (rowDimension.getGridElement().getValue().equals("") && rowDimension.getDimension().getName().equals("Formule") 
								&& isFormulaContext))
					return true;
		}
		
		return false;
	}
}