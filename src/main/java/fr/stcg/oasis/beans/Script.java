package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.annotations.Expose;

@Entity
public class Script implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	private int id;
	
	@Expose
	private String name;
	
	@Lob
	@Expose
	private String content;
	
	@Expose
	private Date creationDate;
	
	@Expose
	private Date lastUpdateDate;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private User creator;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private User lastEditor;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Cube cube;
	
	@OneToMany(mappedBy = "script", orphanRemoval = true)
	private Collection<OrderedScript> orderedScripts;
	
	
	
	
	public Script()
	{
		
	}

	
	


	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	public User getCreator() {
		return creator;
	}
	public void setCreator(User creator) {
		this.creator = creator;
	}
	public User getLastEditor() {
		return lastEditor;
	}
	public void setLastEditor(User lastEditor) {
		this.lastEditor = lastEditor;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Cube getCube() {
		return cube;
	}
	public void setCube(Cube cube) {
		this.cube = cube;
	}
	public Collection<OrderedScript> getOrderedScripts() {
		return orderedScripts;
	}
	public void setOrderedScripts(Collection<OrderedScript> orderedScripts) {
		this.orderedScripts = orderedScripts;
	}
	
	
	
	
	
	public void makeItReplicable()
	{
		try
		{
			this.setId(0);
			this.setOrderedScripts(null);
			
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