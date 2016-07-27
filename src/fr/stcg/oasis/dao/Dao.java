package fr.stcg.oasis.dao;

import java.util.List;

public interface Dao<T> {
	
	T add(T newObject) throws Exception;
    void update(T object) throws Exception;
    void remove(int id) throws Exception;
    T findById(int id) throws Exception;
    List<T> findAll() throws Exception;
}
