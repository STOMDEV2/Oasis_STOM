package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

@Entity
public class ColumnDimension implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_ID = "id";
	private static final String JSON_DIMENSION = "dimension";
	private static final String JSON_GRIDELEMENT = "gridElement";
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	private int id;
	
	@JoinColumn(nullable = false)
	@Expose
	@OneToOne(cascade=CascadeType.ALL, orphanRemoval = true)
	private GridElement gridElement;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private Dimension dimension;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private ColumnContext columnContext;
	
	
	
	
	
	
	public ColumnDimension()
	{
		
	}
	
	
	
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public ColumnContext getColumnContext() {
		return columnContext;
	}
	public void setColumnContext(ColumnContext columnContext) {
		this.columnContext = columnContext;
	}
	public Dimension getDimension() {
		return dimension;
	}
	public void setDimension(Dimension dimension) {
		this.dimension = dimension;
	}
	public GridElement getGridElement() {
		return gridElement;
	}
	public void setGridElement(GridElement gridElement) {
		this.gridElement = gridElement;
	}





	public static ColumnDimension getColumnDimensionFromJSON(JsonObject columnDimensionJSON)
	{
		ColumnDimension columnDimension = new ColumnDimension();

		columnDimension.setId(Integer.parseInt(columnDimensionJSON.get(JSON_ID).getAsString()));
		
		Dimension dimension = new Dimension();
		dimension.setName(columnDimensionJSON.get(JSON_DIMENSION).getAsString());
		columnDimension.setDimension(dimension);

		JsonObject gridElementJSON = columnDimensionJSON.get(JSON_GRIDELEMENT).getAsJsonObject();
		GridElement gridElement = GridElement.getGridElementFromJSON(gridElementJSON);
		columnDimension.setGridElement(gridElement);
		
		return columnDimension;
	}





	@Override
	public String toString() {
		return "ColumnDimension [id=" + id + ", gridElement=" + gridElement.getValue()
				+ ", dimension=" + dimension.getName() + "]";
	}


	


	
	
}