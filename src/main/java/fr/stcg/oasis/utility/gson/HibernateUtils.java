package fr.stcg.oasis.utility.gson;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.hibernate.Hibernate;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.proxy.HibernateProxy;

public class HibernateUtils {

	/**
	 * Transforms a hibernate proxy to the entity's class
	 * 
	 * @param entity
	 * @return entity
	 */
	@SuppressWarnings("unchecked")
	public static <T> T unProxy(T entity) {
		if (entity instanceof HibernateProxy) {
			entity = (T) ((HibernateProxy) entity)
					.getHibernateLazyInitializer().getImplementation();
		}

		return entity;
	}

	/**
	 * Transforms a hibernate proxy object to the desired clazz, if possible. <br />
	 * For when the entity is an instance of clazz.
	 * 
	 * @param entity
	 * @param clazz
	 * @return entity cast to clazz
	 */
	@SuppressWarnings("unchecked")
	public static <T, Y> Y unProxyToClass(T entity, Class<Y> clazz) {
		return (Y) HibernateUtils.unProxy(entity);
	}

	@SuppressWarnings("unchecked")
	public static <T> T initializeAndUnproxy(T entity) {
		if (entity == null) {
			throw new NullPointerException(
					"Entity passed for initialization is null");
		}

		Hibernate.initialize(entity);
		if (entity instanceof HibernateProxy) {
			entity = (T) ((HibernateProxy) entity)
					.getHibernateLazyInitializer().getImplementation();
		}
		return entity;
	}
	
	public static <T> T unproxyJPA2 (T entity){
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory( "org.hibernate.tutorial.jpa" );
		EntityManager entityManager = entityManagerFactory.createEntityManager();
//		entityManager.getTransaction().begin();
		T unproxied  = (T) entityManager.unwrap(SessionImplementor.class).getPersistenceContext().unproxy(entity);
		return unproxied;
	}
}