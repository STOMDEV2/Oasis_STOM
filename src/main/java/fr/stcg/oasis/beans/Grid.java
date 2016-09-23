package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.google.gson.annotations.Expose;

@Entity
@Table(
		   uniqueConstraints = {@UniqueConstraint(columnNames = {"cube_id", "name", "creator_id"})}
		)
public class Grid implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Id
	@Expose
	int id;
	
	@Expose
	String name;
	
	@Expose
	Date lastModificationDate;
	
	@JoinColumn(nullable = false)
	@Expose
	Date creationDate;
	
	@ManyToOne(cascade = {CascadeType.REMOVE}, fetch = FetchType.LAZY)
	@Expose // pète tout dans grid 
	Mask mask;
	
	@ManyToOne(cascade = {CascadeType.REMOVE}, fetch = FetchType.LAZY)
	@JoinColumn(name="creator_id")
	@Expose
	User creator;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="cube_id")
	@Expose
	Cube cube;

	@OneToMany(mappedBy = "grid", orphanRemoval = true)
	@Expose
	Collection<ScenarioParameter> scenarioParameters;
	
	@OneToMany(mappedBy = "grid", orphanRemoval = true)
	@Expose
	Collection<Comment> comments;
	
	@OneToMany(mappedBy = "grid", orphanRemoval = true)
	@Expose
	Collection<GridStyle> gridStyles;
	
	@Expose
	String comment;
	
	
	public Grid()
	{
		
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Mask getMask() {
		return mask;
	}
	public void setMask(Mask mask) {
		this.mask = mask;
	}
	public User getCreator() {
		return creator;
	}
	public void setCreator(User creator) {
		this.creator = creator;
	}
	public Cube getCube() {
		return cube;
	}
	public void setCube(Cube cube) {
		this.cube = cube;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public Collection<ScenarioParameter> getScenarioParameters() {
		return scenarioParameters;
	}
	public void setScenarioParameters(Collection<ScenarioParameter> scenarioParameters) {
		this.scenarioParameters = scenarioParameters;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public Collection<Comment> getComments() {
		return comments;
	}
	public void setComments(Collection<Comment> comments) {
		this.comments = comments;
	}
	public Collection<GridStyle> getGridStyles() {
		return gridStyles;
	}
	public void setGridStyles(Collection<GridStyle> gridStyles) {
		this.gridStyles = gridStyles;
	}
}
