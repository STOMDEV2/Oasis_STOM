package com.stcg.oasis.front.controller;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@Controller
@RequestMapping("/grids")
public class GridController {
	
	/**
	 * Use to get grid info from the DB using the ID as parameter. 
	 * @param request
	 * @param response
	 * @param idGrid
	 * @return
	 */
	@RequestMapping(path = "/grid", produces = "application/json", method = RequestMethod.GET)
	@ResponseBody
	public String getGridById(HttpServletRequest request,
			HttpServletResponse response, @RequestParam("idGrid") int idGrid) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		Grid grid = null;

		try {
			grid = DaoFactory.getGridDao().findById(idGrid);
			System.out.println("Name of grid >> " + grid.getName());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);


		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();

		return gson.toJson(grid);
	}
	
	/**
	 * Use to get the list of all existing grids from the DB.
	 * @param request
	 * @param response
	 * @param idGrid
	 * @return
	 */
	@RequestMapping(path = "/grids", produces = "application/json", method = RequestMethod.GET)
	@ResponseBody
	public String getAllGrid(HttpServletRequest request,
			HttpServletResponse response) {

		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
		

		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();

		List<Grid> grids = null;

		try {
			grids = DaoFactory.getGridDao().findAll(); 
			System.out.println("List of mask size >> " + grids.size());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return gson.toJson(grids);
	}

	/**
	 * Use to create a new grid in the DB. 
	 * 
	 * @param request
	 * @param response
	 * @param grid
	 * @return
	 */
	@RequestMapping(path = "/grid", method = RequestMethod.POST)
	@ResponseBody
	public String createAGrid(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute Grid grid) {

		try {
			DaoFactory.getGridDao().add(grid);
			System.out.println("Name of grid >> " + grid.getName());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "[OK - 200] Grid successfully created to ID="
				+ grid.getId();
	}
	
	/**
	 * Use to modify an existing grid in the DB.
	 * @param request
	 * @param response
	 * @param mask
	 * @return
	 */
	@RequestMapping(path = "/grid/update", method = RequestMethod.PUT)
	@ResponseBody
	public String updateAGrid(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute Grid grid) {
		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);

		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();

		try {
			DaoFactory.getGridDao().update(grid);
			System.out.println("Name of grid >> " + grid.getName());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "[OK - 200] Ressource  ID=" + grid.getId() + "successfully updated.";
	}
	
	/**
	 * Use to delete a grid from the DB using his ID as parameter.  
	 * @param request
	 * @param response
	 * @param idMask
	 * @return
	 */
	@RequestMapping(path = "/grid/delete", produces = "application/json", method = RequestMethod.DELETE)
	@ResponseBody
	public String deleteMaskById(HttpServletRequest request,
			HttpServletResponse response, @RequestParam("idGrid") String idGrid) {
		try {
			DaoFactory.getGridDao().remove(Integer.parseInt(idGrid));

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "[OK - 200] Ressource id=" + idGrid + " have been sucessfully deleted.";
	}

}
