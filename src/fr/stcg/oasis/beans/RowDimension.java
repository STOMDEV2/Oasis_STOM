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
public class RowDimension implements Serializable
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
	
	@Expose
	private String type;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private RowContext rowContext;
	
	
	
	
	public RowDimension()
	{
		
	}
	

	
	

	public RowContext getRowContext() {
		return rowContext;
	}
	public void setRowContext(RowContext rowContext) {
		this.rowContext = rowContext;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Dimension getDimension() {
		return dimension;
	}
	public void setDimension(Dimension dimension) {
		this.dimension = dimension;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public GridElement getGridElement() {
		return gridElement;
	}
	public void setGridElement(GridElement gridElement) {
		this.gridElement = gridElement;
	}



	
	


	public static RowDimension getRowDimensionFromJSON(JsonObject rowDimensionJSON)
	{
		RowDimension rowDimension = new RowDimension();
		
		rowDimension.setId(Integer.parseInt(rowDimensionJSON.get(JSON_ID).getAsString()));

		Dimension dimension = new Dimension();
		dimension.setName(rowDimensionJSON.get(JSON_DIMENSION).getAsString());
		rowDimension.setDimension(dimension);
		
		JsonObject gridElementJSON = rowDimensionJSON.get(JSON_GRIDELEMENT).getAsJsonObject();
		GridElement gridElement = GridElement.getGridElementFromJSON(gridElementJSON);
		rowDimension.setGridElement(gridElement);
		
		return rowDimension;
	}





	@Override
	public String toString() {
		return "RowDimension [id=" + id + ", gridElement=" + gridElement.getValue()
				+ ", dimension=" + dimension.getName() + ", type=" + type
				+ "]";
	}


	


	
	
}