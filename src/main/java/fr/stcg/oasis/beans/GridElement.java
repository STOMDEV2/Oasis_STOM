package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

@Entity
public class GridElement implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_VALUE = "value";
	private static final String JSON_STYLE = "style";
	private static final String JSON_STATE = "state";

	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	@JoinColumn(nullable = false)
	@Expose
	private String value;
	
	@Expose
	@OneToOne(cascade=CascadeType.ALL, orphanRemoval = true, mappedBy = "gridElement")
	private Style style;
	
	
	private transient String state;
	
	
	public GridElement()
	{
		
	}



	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public Style getStyle() {
		return style;
	}
	public void setStyle(Style style) {
		this.style = style;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}



	
	


	@Override
	public String toString() {
		return "GridElement [id=" + id + ", value=" + value + ", state="
				+ state + "]";
	}





	public static GridElement getGridElementFromJSON(JsonObject gridElementJSON)
	{
		GridElement gridElement = new GridElement();

		JsonObject styleJSON = gridElementJSON.get(JSON_STYLE).getAsJsonObject();
		Style style = Style.getStyleFromJSON(styleJSON);
		gridElement.setStyle(style);
		gridElement.getStyle().setGridElement(gridElement);
		gridElement.setValue(gridElementJSON.get(JSON_VALUE).getAsString());
		gridElement.setState(gridElementJSON.get(JSON_STATE).getAsString());
		
		return gridElement;
	}
	
	public void assignNewGridElement(GridElement newOne)
	{
		this.setValue(newOne.getValue());
//		this.style = new Style();
//		System.out.println(this.getStyle());
		
		if(newOne.getStyle() != null)
		{
			this.getStyle().setCellStyle(newOne.getStyle().getCellStyle());
			this.getStyle().setChildrenStyle(newOne.getStyle().getChildrenStyle());
			this.getStyle().setBorderStyle(newOne.getStyle().getBorderStyle());
		}
		else
			this.setStyle(null);
		
		this.getStyle().setGridElement(this);
	}
	
	public void makeItReplicable()
	{
		this.setId(0);
		
		try
		{
			BeanUtils.setProperty(this, "pcVersionInit", false);
			
			if(this.getStyle() != null)
				this.getStyle().makeItReplicable();
		}
		catch (IllegalAccessException e)
		{
			e.printStackTrace();
		}
		catch (InvocationTargetException e)
		{
			e.printStackTrace();
		}
	}
}
