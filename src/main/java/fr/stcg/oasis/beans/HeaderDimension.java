package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.google.gson.annotations.Expose;

@Entity
public class HeaderDimension implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	int id;
	@Expose
	boolean retrieve;
	
	@Expose
	String value;
	
	@Expose
	@ManyToOne(fetch = FetchType.LAZY)
	Dimension dimension; 
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	Mask mask;
	
	
	
	
	public HeaderDimension()
	{
		
	}
	
	public HeaderDimension(Dimension dimension, String value, boolean retrieve) throws Exception
	{
//		this.id = -1;
		this.dimension = dimension;
		this.value = value;
		this.retrieve = retrieve;
	}
	
	
	
	

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public boolean isRetrieve() {
		return retrieve;
	}
	public void setRetrieve(boolean retrieve) {
		this.retrieve = retrieve;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public Dimension getDimension() {
		return dimension;
	}
	public void setDimension(Dimension dimension) {
		this.dimension = dimension;
	}
	public Mask getMask() {
		return mask;
	}
	public void setMask(Mask mask) {
		this.mask = mask;
	}
	
	
	
	

	@Override
	public String toString() {
		return "HeaderDimension [id=" + id + ", retrieve=" + retrieve
				+ ", value=" + value + ", dimension=" + dimension.getName() + ", mask="
				+ mask.getNameMask() + "]";
	}
}
