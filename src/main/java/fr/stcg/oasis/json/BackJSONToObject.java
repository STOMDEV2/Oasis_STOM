package fr.stcg.oasis.json;

import java.util.ArrayList;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.GridElement;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.beans.Style;
import fr.stcg.oasis.dao.DaoFactory;

public class BackJSONToObject {
	
	
	private static final String JSON_CELLSTYLE = "CellStyle";
	private static final String JSON_BORDERSTYLE = "BorderStyle";
	private static final String JSON_CHILDRENSTYLE = "ChildrenStyle";

	public static HeaderDimension getHeaderDimensionFromJSON( JsonObject headerContextJSON)
	{
		try
		{
			HeaderDimension h = new HeaderDimension();
			
			h.setRetrieve(headerContextJSON.get("Retrieve").getAsBoolean());
			h.setValue(headerContextJSON.get("Value").getAsString());
			
			
			JsonObject dJSON = headerContextJSON.get("Dimension").getAsJsonObject();
			
			Dimension d = DaoFactory.getDimensionDao().findById(dJSON.get("Id").getAsInt());
			
			h.setDimension(d);
			
			return h;
		}
		catch(Exception e )
		{
			e.printStackTrace();
			return null;
		}
		
	}
	
	public static Style getStyleFromJSON( JsonObject styleJSON)
	{
		Style s = new Style();
		
		
		s.setBorderStyle(styleJSON.get(JSON_BORDERSTYLE).getAsString());
		s.setCellStyle(styleJSON.get(JSON_CELLSTYLE).getAsString());
		s.setChildrenStyle(styleJSON.get(JSON_CHILDRENSTYLE).getAsString());
		
		return s;
	}
	
	public static GridElement getGridElementFromJSON(JsonObject gridElementJSON)
	{
		GridElement gridElmt = new GridElement();
		
		gridElmt.setValue(gridElementJSON.get("Value").getAsString());
		gridElmt.setStyle( getStyleFromJSON( (JsonObject) gridElementJSON.get("Style")) );
		
		return gridElmt;
	}
	
	public static ColumnDimension getColumnDimensionFromJSON( JsonObject columnDimensionJSON)
	{
		try
		{
			ColumnDimension columnDimension = new ColumnDimension();
			
			columnDimension.setGridElement(getGridElementFromJSON(columnDimensionJSON.get("GridElement").getAsJsonObject()));
			JsonObject dimensionJSON = columnDimensionJSON.get("Dimension").getAsJsonObject();
			
			Dimension d = DaoFactory.getDimensionDao().findById(dimensionJSON.get("Id").getAsInt());
			
			if(d == null)
			{
				d = new Dimension();
				d.setName(dimensionJSON.get("Name").getAsString());
			}
			
			columnDimension.setDimension(d);
			
			return columnDimension;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return null;
		}
		
	}
	
	public static ColumnContext getColumnContextFromJSON( JsonObject columnContextJSON)
	{
		ColumnContext columnContext = new ColumnContext();
		
		columnContext.setTitle(getGridElementFromJSON(columnContextJSON.get("Title").getAsJsonObject()));
		columnContext.setType(getGridElementFromJSON(columnContextJSON.get("Type").getAsJsonObject()));
		
		JsonArray columnDimensions = columnContextJSON.get("ColumnsDimensions").getAsJsonArray();
		
		for(JsonElement elt : columnDimensions)
			columnContext.getColumnsDimensions().add(getColumnDimensionFromJSON((JsonObject) elt));
		
		return columnContext;
	}
	
	public static RowDimension getRowDimensionFromJSON(JsonObject rowDimensionJSON)
	{
		try
		{
			RowDimension rowDimension = new RowDimension();
			
			rowDimension.setGridElement(getGridElementFromJSON(rowDimensionJSON.get("GridElement").getAsJsonObject()));
			
			JsonObject dimensionJSON = rowDimensionJSON.get("Dimension").getAsJsonObject();
			Dimension d = DaoFactory.getDimensionDao().findById(dimensionJSON.get("Id").getAsInt());
			
			if(d == null)
			{
				d = new Dimension();
				d.setName(dimensionJSON.get("Name").getAsString());
			}
			
			rowDimension.setType(rowDimensionJSON.get("Type").getAsString());
			rowDimension.setDimension(d);
			
			
			
			return rowDimension;
		}
		catch(Exception e)
		{	
			e.printStackTrace();
			return null;
		}
		
	}
	
	public static RowContext getRowContextFromJSON(JsonObject rowContextJSON)
	{
		RowContext rowContext = new RowContext();
		
		
		rowContext.setTitle( getGridElementFromJSON(rowContextJSON.get("Title").getAsJsonObject() ) );
		rowContext.setDefaultStyle(getGridElementFromJSON(rowContextJSON.get("DefaultStyle").getAsJsonObject() ) );
		
		
		JsonArray rowDimensions = rowContextJSON.get("RowDimensions").getAsJsonArray();
		
		for(JsonElement elt : rowDimensions )
			rowContext.getRowDimensions().add( getRowDimensionFromJSON((JsonObject) elt));
			
		return rowContext;
	}
	
	public static Mask getMaskFromJSON(JsonObject maskJSON)
	{
		Mask mask = new Mask();
		
		mask.setNameMask(maskJSON.get("NameMask").getAsString());
		mask.setHeaderContext(new ArrayList<HeaderDimension>());
		mask.setColumnContext(new ArrayList<ColumnContext>());
		mask.setRowContext(new ArrayList<RowContext>());
		
		JsonArray headerContexts = maskJSON.get("HeaderContext").getAsJsonArray();
		JsonArray columnContexts = maskJSON.get("ColumnContext").getAsJsonArray();
		JsonArray rowContexts = maskJSON.get("RowContext").getAsJsonArray();
		
		
		for(JsonElement elt : headerContexts)
			mask.getHeaderContext().add( getHeaderDimensionFromJSON((JsonObject) elt));
			
		for(JsonElement elt : columnContexts)
			mask.getColumnContext().add(getColumnContextFromJSON((JsonObject)elt));
			
		for(JsonElement elt : rowContexts)
			mask.getRowContext().add(getRowContextFromJSON((JsonObject)elt));
		
		return mask;
	}
	
	
}
