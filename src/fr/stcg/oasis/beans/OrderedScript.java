package fr.stcg.oasis.beans;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.apache.commons.beanutils.BeanUtils;

import com.google.gson.annotations.Expose;

@Entity
public class OrderedScript implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Expose
	private int id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@Expose
	private Script script;
	
	@Expose
	private int position;
	
	@ManyToOne(fetch = FetchType.EAGER)
	private Calcul calcul;
	
	
	public OrderedScript()
	{
		
	}



	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Script getScript() {
		return script;
	}
	public void setScript(Script script) {
		this.script = script;
	}
	public int getPosition() {
		return position;
	}
	public void setPosition(int position) {
		this.position = position;
	}
	public Calcul getCalcul() {
		return calcul;
	}
	public void setCalcul(Calcul calcul) {
		this.calcul = calcul;
	}
	
	
	
	
	
	
	public void makeItReplicable()
	{
		try
		{
			this.setId(0);
			this.getScript().makeItReplicable();
			
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
