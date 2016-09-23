package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.google.gson.annotations.Expose;
@Entity
@Table(
		   uniqueConstraints = {@UniqueConstraint(columnNames = {"application", "name"})}
		)
public class Cube implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	@Expose
	private int id;
	//@Column(name="cube_name")
	@Expose
	private String name;
	//@Column(name="cube_application")
	@Expose
	private String application;

	@OneToMany(mappedBy="cube", orphanRemoval = true, cascade = CascadeType.ALL)
	private Collection<Calcul> calculs;

	@OneToMany(mappedBy="cube", orphanRemoval = true, cascade = CascadeType.ALL)
	@OrderBy("name")
	private Collection<Script> scripts;
	
	@OneToMany(mappedBy="cube",orphanRemoval = true, cascade = CascadeType.ALL)
	@Expose
	private Collection<Dimension> dimensions;
	

	/*public static class CubeID implements Serializable {
		
		private static final long serialVersionUID = 1L;
		
		//@Column(name="cube_id")
		private int id;
		//@Column(name="cube_name")
		private String name;
		//@Column(name="cube_application")
		private String application;
		
		
		public CubeID()
		{
			
		}
		
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getApplication() {
			return application;
		}
		public void setApplication(String application) {
			this.application = application;
		}
		
		
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		
		/*public int hashCode() {
	        return (int) application.hashCode() + name.hashCode() + id;
	    }

	    public boolean equals(Object obj) {
	        if (obj == this) return true;
	        if (!(obj instanceof CubeID)) return false;
	        if (obj == null) return false;
	        CubeID pk = (CubeID) obj;
	        return pk.id == id && pk.name.equals(name) && pk.application.equals(application);
		
	    }Z
	}*/
	
	public Cube() {
		
	}
	
	public Cube(String name, String application, ArrayList<Dimension> dimensions)
	{
		if( !name.equals(null) && !application.equals(null) )
		{	
			this.name = name;
			this.application = application;
			this.dimensions = dimensions;
		}
		
	}
	
	
	
	

	@Override
	public String toString() {
		return "Cube [id=" + id + ", name=" + name + ", application="
				+ application  + "]";
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getApplication() {
		return application;
	}

	public void setApplication(String application) {
		this.application = application;
	}

	public Collection<Dimension> getDimensions() {
		return dimensions;
	}

	public void setDimensions(Collection<Dimension> dimension) {
		this.dimensions = dimension;
	}


	public Collection<Calcul> getCalculs() {
		return calculs;
	}

	public void setCalculs(Collection<Calcul> calculs) {
		this.calculs = calculs;
	}

	public Collection<Script> getScripts() {
		return scripts;
	}

	public void setScripts(Collection<Script> scripts) {
		this.scripts = scripts;
	}




	
	
	
	
	
}
