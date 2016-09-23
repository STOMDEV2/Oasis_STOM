package fr.stcg.oasis.beans;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import com.google.gson.annotations.Expose;

@Entity
public class Comment implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@Lob
	@Expose
	private String comment;
	
	@Expose
	@ManyToOne(fetch = FetchType.LAZY)
	private ColumnContext columnContext;
	
	@Expose
	@ManyToOne(fetch = FetchType.LAZY)
	private RowContext rowContext;
	
	@ManyToOne(fetch = FetchType.LAZY)
	private Grid grid;
	
	
	
	
	
	
	public Comment()
	{
		
	}


	
	
	
	
	
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public ColumnContext getColumnContext() {
		return columnContext;
	}
	public void setColumnContext(ColumnContext columnContext) {
		this.columnContext = columnContext;
	}
	public RowContext getRowContext() {
		return rowContext;
	}
	public void setRowContext(RowContext rowContext) {
		this.rowContext = rowContext;
	}
	public Grid getGrid() {
		return grid;
	}
	public void setGrid(Grid grid) {
		this.grid = grid;
	}
}
