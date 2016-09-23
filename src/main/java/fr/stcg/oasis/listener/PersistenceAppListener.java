package fr.stcg.oasis.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.PersistenceManager;


@WebListener
public class PersistenceAppListener implements ServletContextListener 
{
    public PersistenceAppListener() 
    {
    	
    }

    public void contextInitialized(ServletContextEvent arg0)
    {
    	try
    	{
			DaoFactory.getProfileDao().initProfile();
			DaoFactory.getUserDao().initUser();
		}
    	catch (Exception e)
    	{
			e.printStackTrace();
		}
    }

    public void contextDestroyed(ServletContextEvent arg0) 
    {
    	PersistenceManager.closeEntityManagerFactory();
    }
}
