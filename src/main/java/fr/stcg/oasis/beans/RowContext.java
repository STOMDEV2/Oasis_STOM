package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

@Entity
public class RowContext implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_ID = "id";
	private static final String JSON_TITLE = "Title";
	private static final String JSON_RETRIEVE = "Retrieve";
	private static final String JSON_SAISIE = "Capture";
	private static final String JSON_DATA = "Data";
	private static final String JSON_STATE = "state";
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	private int id;
	
	@Expose
	@OneToOne(cascade=CascadeType.ALL, orphanRemoval = true)
	private GridElement title;
	
	@Expose
	@OneToOne(cascade=CascadeType.ALL, orphanRemoval = true)
	private GridElement defaultStyle;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private Mask mask;
	
	@Expose
	@OneToMany(mappedBy = "rowContext", orphanRemoval = true)
	private Collection<RowDimension> rowDimensions = new ArrayList<RowDimension>();
	
	
	private transient String state;
	
	
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public GridElement getTitle() {
		return title;
	}
	public void setTitle(GridElement title) {
		this.title = title;
	}
	public Collection<RowDimension> getRowDimensions() {
		return rowDimensions;
	}
	public void setRowDimensions(Collection<RowDimension> rowDimensions) {
		this.rowDimensions = rowDimensions;
	}
	public Mask setMask() {
		return mask;
	}
	public void setMask(Mask mask) {
		this.mask = mask;
	}
	public Mask getMask() {
		return mask;
	}
	public GridElement getDefaultStyle() {
		return defaultStyle;
	}
	public void setDefaultStyle(GridElement defaultStyle) {
		this.defaultStyle = defaultStyle;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	
	
	
	
	
	
	public static RowContext getRowContextFromJSON(JsonObject rowContextJSON)
	{
		RowContext rowContext = new RowContext();
		
		rowContext.setId(Integer.parseInt(rowContextJSON.get(JSON_ID).getAsString()));
		
		JsonObject titleJSON = rowContextJSON.getAsJsonObject(JSON_TITLE);
		GridElement gridElementTitle = GridElement.getGridElementFromJSON(titleJSON);
		rowContext.setTitle(gridElementTitle);
		
		JsonObject data = rowContextJSON.getAsJsonObject(JSON_DATA);
		GridElement defaultStyle = GridElement.getGridElementFromJSON(data);
		rowContext.setDefaultStyle(defaultStyle);
		
		rowContext.setState(rowContextJSON.get(JSON_STATE).getAsString());
		
		JsonArray rowDimensions = rowContextJSON.getAsJsonArray(JSON_RETRIEVE);
		for(int i = 0; i < rowDimensions.size(); i++)
		{
			JsonObject rowDimensionJSON = (JsonObject)rowDimensions.get(i);
			
			RowDimension rowDimension = RowDimension.getRowDimensionFromJSON(rowDimensionJSON);
			rowDimension.setType(JSON_RETRIEVE);
			
			rowContext.getRowDimensions().add(rowDimension);
		}
		
		rowDimensions = rowContextJSON.getAsJsonArray(JSON_SAISIE);
		for(int i = 0; i < rowDimensions.size(); i++)
		{
			JsonObject rowDimensionJSON = (JsonObject)rowDimensions.get(i);
			
			RowDimension rowDimension = RowDimension.getRowDimensionFromJSON(rowDimensionJSON);
			rowDimension.setType(JSON_SAISIE);
			
			rowContext.getRowDimensions().add(rowDimension);
		}
		
		return rowContext;
	}
	@Override
	public String toString() {
		return "RowContext [id=" + id + ", title=" + title + ", defaultStyle="
				+ defaultStyle + "]";
	}

	
	
	
}