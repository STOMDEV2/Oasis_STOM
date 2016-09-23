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
public class ColumnContext implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_ID = "id";
	private static final String JSON_TITLE = "Title";
	private static final String JSON_TYPE = "Type";
	private static final String JSON_DIMENSION = "dimension";
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
	private GridElement type;
	
	@Expose
	@OneToOne(cascade=CascadeType.ALL, orphanRemoval = true)
	private GridElement defaultStyle;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private Mask mask;
	
	@Expose
	@OneToMany(mappedBy = "columnContext", orphanRemoval = true)
	private Collection<ColumnDimension> columnsDimensions = new ArrayList<ColumnDimension>();
	
	
	private transient String state;

	
	public ColumnContext()
	{
		
	}
	
	
	
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
	public Mask getMask() {
		return mask;
	}
	public void setMask(Mask mask) {
		this.mask = mask;
	}
	public GridElement getType() {
		return type;
	}
	public void setType(GridElement type) {
		this.type = type;
	}
	public Collection<ColumnDimension> getColumnsDimensions() {
		return columnsDimensions;
	}
	public void setColumnsDimensions(Collection<ColumnDimension> columnsDimensions) {
		this.columnsDimensions = columnsDimensions;
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

	
	
	


	public static ColumnContext getColumnContextFromJSON(JsonObject columnContextJSON)
	{
		ColumnContext columnContext = new ColumnContext();
		
		columnContext.setId(Integer.parseInt(columnContextJSON.get(JSON_ID).getAsString()));
		
		JsonObject title = columnContextJSON.getAsJsonObject(JSON_TITLE);
		GridElement gridElementTitle = GridElement.getGridElementFromJSON(title);
		columnContext.setTitle(gridElementTitle);
		
		JsonObject type = columnContextJSON.getAsJsonObject(JSON_TYPE);
		GridElement gridElementValue = GridElement.getGridElementFromJSON(type);
		columnContext.setType(gridElementValue);
		
		JsonObject data = columnContextJSON.getAsJsonObject(JSON_DATA);
		GridElement defaultStyle = GridElement.getGridElementFromJSON(data);
		columnContext.setDefaultStyle(defaultStyle);
		
		columnContext.setState(columnContextJSON.get(JSON_STATE).getAsString());
		
		JsonArray columnDimensions = columnContextJSON.getAsJsonArray(JSON_DIMENSION);
		for(int i = 0; i < columnDimensions.size(); i++)
		{
			JsonObject columnDimensionJSON = (JsonObject)columnDimensions.get(i);
			
			ColumnDimension columnDimension = ColumnDimension.getColumnDimensionFromJSON(columnDimensionJSON);
			
			columnContext.getColumnsDimensions().add(columnDimension);
		}
		
		return columnContext;
	}



	@Override
	public String toString() {
		return "ColumnContext [id=" + id + ", title=" + title + ", type="
				+ type + ", state=" + state + "]";
	}

	

	
	
}