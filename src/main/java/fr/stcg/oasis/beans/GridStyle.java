package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

@Entity
public class GridStyle implements Serializable
{
	private static final long serialVersionUID = 1L;

	private static final String JSON_COLUMNCONTEXT = "columnContextId";
	private static final String JSON_ROWCONTEXT = "rowContextId";
//	private static final String JSON_GRID = "grid";
	private static final String JSON_STYLE = "style";
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@Expose
	private Style style;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private ColumnContext columnContext;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private RowContext rowContext;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Grid grid;
	
	
	
	
	
	public GridStyle()
	{
		
	}


	
	
	

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Style getStyle() {
		return style;
	}
	public void setStyle(Style style) {
		this.style = style;
	}
	public ColumnContext getColumnContext() {
		return columnContext;
	}
	public void setColumnContext(ColumnContext columnContext) {
		this.columnContext = columnContext;
	}
	public RowContext getRowContext() {
		return rowContext;
	}
	public void setRowContext(RowContext rowContext) {
		this.rowContext = rowContext;
	}
	public Grid getGrid() {
		return grid;
	}
	public void setGrid(Grid grid) {
		this.grid = grid;
	}






	public static GridStyle getStyleFromJSON(JsonObject gridStyleJSON)
	{
		System.out.println(gridStyleJSON);
		
		GridStyle gridStyle = new GridStyle();
		
		RowContext rowContext = new RowContext();
		rowContext.setId(gridStyleJSON.get(JSON_ROWCONTEXT).getAsInt());
		gridStyle.setRowContext(rowContext);
		
		ColumnContext columnContext = new ColumnContext();
		columnContext.setId(gridStyleJSON.get(JSON_COLUMNCONTEXT).getAsInt());
		gridStyle.setColumnContext(columnContext);

		JsonObject styleJSON = gridStyleJSON.get(JSON_STYLE).getAsJsonObject();
		Style style = Style.getStyleFromJSON(styleJSON);
		gridStyle.setStyle(style);
		
		return gridStyle;
	}
}
