package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.google.gson.annotations.Expose;


public class Member implements Serializable
{	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Expose
	private int id;

	@Expose
	private String alias;
	
	@Expose
	private String uniqueName;
	
	@Expose
	private boolean isMember;
	
	@Expose
	private int generationNumber;
	
	@Expose
	private int levelNumber;
	
	@Expose
	private String[] UDAs;
	
	@Expose
	private boolean isSharedMember;
	
	@Expose
	private boolean isDynamicCalc;
	
	
//	@Expose
//	private int level;
//	
//	@Expose
//	@ManyToOne(fetch = FetchType.EAGER)
//	@JoinColumn(nullable = true)
//	private Membre parent;
//	
//	@ManyToOne(fetch = FetchType.LAZY)
//	private Dimension associatedDimension;
//	
//	@Expose
//	private String consolidation;
//	
//	@Expose
//	private int childCount;
	
	
	public Member() {
		
	}
	
//	public Membre(String alias, String uniqueName, int level, Membre parent, Dimension associatedDimension, String consolidation, int childCount)
//	{
//		this.alias = alias;
//		this.uniqueName = uniqueName;
//		this.level = level;
//		this.parent = parent;
//		this.associatedDimension = associatedDimension;
//		this.consolidation = consolidation;
//		this.childCount = childCount;
//	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getUniqueName() {
		return uniqueName;
	}
	public void setUniqueName(String uniqueName) {
		this.uniqueName = uniqueName;
	}
//	public int getLevel() {
//		return level;
//	}
//	public void setLevel(int level) {
//		this.level = level;
//	}
//	public Membre getParent() {
//		return parent;
//	}
//	public void setParent(Membre parent) {
//		this.parent = parent;
//	}
//	
//	public String getConsolidation() {
//		return consolidation;
//	}
//	public void setConsolidation(String consolidation) {
//		this.consolidation = consolidation;
//	}
//	public int getChildCount() {
//		return childCount;
//	}
//	public void setChildCount(int childCount) {
//		this.childCount = childCount;
//	}
//	public static long getSerialversionuid() {
//		return serialVersionUID;
//	}
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(nullable = false)
//	public Dimension getAssociatedDimension() {
//		return associatedDimension;
//	}
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(nullable = false)
//	public void setAssociatedDimension(Dimension associatedDimension) {
//		this.associatedDimension = associatedDimension;
//	}
//	
//	@Override
//	public String toString() {
//		return "Membre [id=" + id + ", alias=" + alias + ", uniqueName="
//				+ uniqueName + ", level=" + level + ", parent=" + parent
//				+ ", associatedDimension=" + associatedDimension
//				+ ", consolidation=" + consolidation + ", childCount="
//				+ childCount + "]";
//	}
//	
//	
//	
//	
//	

	public boolean isMember() {
		return isMember;
	}

	public void setMember(boolean isMember) {
		this.isMember = isMember;
	}


	public int getLevelNumber() {
		return levelNumber;
	}

	public void setLevelNumber(int levelNumber) {
		this.levelNumber = levelNumber;
	}

	public String[] getUDAs() {
		return UDAs;
	}

	public void setUDAs(String[] uDAs) {
		UDAs = uDAs;
	}

	public int getGenerationNumber() {
		return generationNumber;
	}

	public void setGenerationNumber(int generationNumber) {
		this.generationNumber = generationNumber;
	}

	public boolean isSharedMember() {
		return isSharedMember;
	}

	public void setSharedMember(boolean isSharedMember) {
		this.isSharedMember = isSharedMember;
	}

	public boolean isDynamicCalc() {
		return isDynamicCalc;
	}

	public void setDynamicCalc(boolean isDynamicCalc) {
		this.isDynamicCalc = isDynamicCalc;
	}

}
