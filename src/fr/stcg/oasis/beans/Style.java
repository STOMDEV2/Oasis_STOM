package fr.stcg.oasis.beans; 

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;
import com.sun.istack.internal.Nullable;

@Entity
public class Style implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_CELLSTYLE = "cellStyle";
	private static final String JSON_BORDERSTYLE = "borderStyle";
	private static final String JSON_CHILDRENSTYLE = "childrenStyle";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	@Expose
	private String cellStyle;

	@Expose
	private String borderStyle;
	
	@Expose
	private String childrenStyle;
	
	@OneToOne(cascade = CascadeType.ALL)
	@Nullable
	private GridElement gridElement;
	
	
	public Style()
	{
		
	}
	
	
	

	public String getCellStyle() {
		return cellStyle;
	}
	public void setCellStyle(String cellStyle) {
		this.cellStyle = cellStyle;
	}
	public String getBorderStyle() {
		return borderStyle;
	}
	public void setBorderStyle(String borderStyle) {
		this.borderStyle = borderStyle;
	}
	public String getChildrenStyle() {
		return childrenStyle;
	}
	public void setChildrenStyle(String childrenStyle) {
		this.childrenStyle = childrenStyle;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public GridElement getGridElement() {
		return gridElement;
	}
	public void setGridElement(GridElement gridElement) {
		this.gridElement = gridElement;
	}


	


	public static Style getStyleFromJSON(JsonObject styleJSON)
	{
//		System.out.println(styleJSON);
		
		Style style = new Style();
		
		style.setCellStyle(styleJSON.get(JSON_CELLSTYLE).getAsString());
		style.setBorderStyle(styleJSON.get(JSON_BORDERSTYLE).getAsString());
		style.setChildrenStyle(styleJSON.get(JSON_CHILDRENSTYLE).getAsString());
		
		return style;
	}
	
	public void makeItReplicable()
	{
		this.setId(0);
		
		try
		{
			BeanUtils.setProperty(this, "pcVersionInit", false);
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
