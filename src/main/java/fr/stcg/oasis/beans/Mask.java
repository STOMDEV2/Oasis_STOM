package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

import fr.stcg.oasis.dao.DaoFactory;

@Entity
public class Mask implements Serializable
{	
	private static final long serialVersionUID = 1L;
	
	private static final String JSON_NAMEMASK = "nameMask";
	private static final String JSON_DURATION = "duration";
	private static final String JSON_AUTOSAVE = "autoSave";
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	int id;
	
	@Column(unique = true)
	@JoinColumn(nullable = false)
	@Expose
	String nameMask;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	@Expose
	Cube cube;
	
	@Expose
	Date lastModificationDate;
	
	@JoinColumn(nullable = false)
	@Expose
	Date creationDate;
	
	@ManyToOne(cascade = {CascadeType.MERGE}, fetch = FetchType.LAZY)
	@JoinColumn(name = "author")
	@Expose
	User author;
	
	@ManyToOne(cascade = {CascadeType.REMOVE}, fetch = FetchType.LAZY)
	@JoinColumn(name = "lastEditor")
	@Expose
	User lastEditor;
	
	@OneToMany(cascade = {CascadeType.REMOVE}, mappedBy = "mask", orphanRemoval = true)
	@Expose
	Collection<ColumnContext> columnContext;
	
	@OneToMany(cascade = {CascadeType.REMOVE}, mappedBy = "mask", orphanRemoval = true)
	@Expose
	Collection<RowContext> rowContext;
	
	@OneToMany(cascade = {CascadeType.REMOVE}, mappedBy = "mask", orphanRemoval = true)
	@Expose
	Collection<HeaderDimension> headerContext;
	
	@OneToMany(cascade = {CascadeType.REMOVE}, mappedBy = "mask", orphanRemoval = true)
	Collection<Grid> grids;
	
	public Mask()
	{
		
	}
	
	public Mask(String nameMask, ArrayList<ColumnContext> columnContext, ArrayList<RowContext> rowContext, ArrayList<HeaderDimension> headerContext)
	{
		this.nameMask = nameMask;
		this.columnContext = new ArrayList<ColumnContext>(columnContext);
		this.rowContext = new ArrayList<RowContext>(rowContext);
		this.headerContext = new ArrayList<HeaderDimension>(headerContext);
	}
	
	public Mask(Mask mask)
	{
		this.setAuthor(mask.getAuthor());
		this.setCreationDate(mask.getCreationDate());
		this.setCube(mask.getCube());
		this.setLastEditor(mask.getLastEditor());
		this.setLastModificationDate(mask.getLastModificationDate());
	}

	public Cube getCube() {
		return cube;
	}
	
	public Collection<HeaderDimension> getHeaderContext() {
		return headerContext;
	}
	
	public void setHeaderContext(Collection<HeaderDimension> headerContext) {
		this.headerContext = headerContext;
	}
	
	public void setCube(Cube cube) {
		this.cube = cube;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNameMask() {
		return nameMask;
	}
	public void setNameMask(String nameMask) {
		this.nameMask = nameMask;
	}
	public Date getLastModificationDate() {
		return lastModificationDate;
	}
	public void setLastModificationDate(Date lastModificationDate) {
		this.lastModificationDate = lastModificationDate;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public User getAuthor() {
		return author;
	}
	public void setAuthor(User author) {
		this.author = author;
	}
	public User getLastEditor() {
		return lastEditor;
	}
	public void setLastEditor(User lastEditor) {
		this.lastEditor = lastEditor;
	}
	public Collection<ColumnContext> getColumnContext() {
		return columnContext;
	}
	public void setColumnContext(Collection<ColumnContext> columnContext) {
		this.columnContext = columnContext;
	}
	public Collection<RowContext> getRowContext() {
		return rowContext;
	}
	public void setRowContext(Collection<RowContext> rowContext) {
		this.rowContext = rowContext;
	}
	

	public Collection<Grid> getGrids() {
		return grids;
	}

	public void setGrids(Collection<Grid> grids) {
		this.grids = grids;
	}


	public static Mask getMaskFromJSON(JsonObject maskJSONed)
	{
		Mask mask = new Mask();
		
		mask.setNameMask(maskJSONed.get(JSON_NAMEMASK).getAsString());
		
		return mask;
	}
	
	//to move
	public static boolean isNameAvailable(String nameToCheck)
	{
		try
		{
			Mask testMask = DaoFactory.getMaskDao().findMaskByName(nameToCheck);
			
			if(testMask != null)
				return false;
			else
				return true;
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
			
	}

}
