package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import com.google.gson.annotations.Expose;

@Entity
public class HistoricCalculLaunch implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@Expose
	private int state;
	
	@Expose
	private String parameters;
	
	@Lob
	@Expose
	private String comments;
	
	@Expose
	@Temporal(TemporalType.DATE)
	private Date dateBegin;
	
	@Expose
	@Temporal(TemporalType.TIME)
	private Date timeBegin;
	
	@Expose
	@Temporal(TemporalType.DATE)
	private Date dateEnd;
	
	@Expose
	@Temporal(TemporalType.TIME)
	private Date timeEnd;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private User launcher;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@Expose
	private Calcul calcul;
	
	@Expose
	@Transient
	private String duration;
	
	
	
	public HistoricCalculLaunch()
	{
		
	}



	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public User getLauncher() {
		return launcher;
	}
	public void setLauncher(User launcher) {
		this.launcher = launcher;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public Calcul getCalcul() {
		return calcul;
	}
	public void setCalcul(Calcul calcul) {
		this.calcul = calcul;
	}
	public Date getDateBegin() {
		return dateBegin;
	}
	public void setDateBegin(Date dateBegin) {
		this.dateBegin = dateBegin;
	}
	public Date getTimeBegin() {
		return timeBegin;
	}
	public void setTimeBegin(Date timeBegin) {
		this.timeBegin = timeBegin;
	}
	public Date getDateEnd() {
		return dateEnd;
	}
	public void setDateEnd(Date dateEnd) {
		this.dateEnd = dateEnd;
	}
	public Date getTimeEnd() {
		return timeEnd;
	}
	public void setTimeEnd(Date timeEnd) {
		this.timeEnd = timeEnd;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getParameters() {
		return parameters;
	}
	public void setParameters(String parameters) {
		this.parameters = parameters;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
}
