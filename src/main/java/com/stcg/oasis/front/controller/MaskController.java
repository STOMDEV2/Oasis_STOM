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

import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.utility.gson.HibernateProxyTypeAdapter;

@Controller
@RequestMapping("/masks")
public class MaskController {
	
	/**
	 * Get a mask by his ID passed as parameters.
	 * @param request
	 * @param response
	 * @param idMask
	 * @return
	 */
	@RequestMapping(path = "/mask", produces = "application/json", method = RequestMethod.GET)
	@ResponseBody
	public String getMaskById(HttpServletRequest request,
			HttpServletResponse response, @RequestParam("idMask") int idMask) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		Mask mask = null;

		try {
			mask = DaoFactory.getMaskDao().findById(idMask); // Change 10 by int
																// idMask
			System.out.println("Name of mask >> " + mask.getNameMask());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// return HibernateUtils.unProxyToClass(mask, Mask.class);
		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);

		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();

		return gson.toJson(mask);
	}
	
	/**
	 * Get the list of all mask store in the DB..
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(path = "/masks", produces = "application/json", method = RequestMethod.GET)
	@ResponseBody
	public String getAllMask(HttpServletRequest request,
			HttpServletResponse response) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<Mask> masks = null;

		try {
			masks = DaoFactory.getMaskDao().findAll(); // Change 10 by int
														// idMask
			System.out.println("List of mask size >> " + masks.size());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// return HibernateUtils.unProxyToClass(mask, Mask.class);
		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);

		// Gson gson = gb.registerTypeAdapter(Mask.class, new
		// GsonOptionalDeserializer<Mask>())
		// .create();

		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();

		return gson.toJson(masks);
	}
	
	
	/**
	 * Use to create a new mask in the DB. 
	 * 
	 * @param request
	 * @param response
	 * @param mask
	 * @return
	 */
	@RequestMapping(path = "/masks", method = RequestMethod.POST)
	@ResponseBody
	public String createAMask(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute Mask mask) {

		// return HibernateUtils.unProxyToClass(mask, Mask.class);
		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);

		// Gson gson = gb.registerTypeAdapter(Mask.class, new
		// GsonOptionalDeserializer<Mask>())
		// .create();

		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();

		try {
			DaoFactory.getMaskDao().add(mask); // Change 10 by int
														// idMask
			System.out.println("Name of mask >> " + mask.getNameMask());

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "[OK - 200] Ressource successfully created to ID="
				+ mask.getId();
	}
	

	@RequestMapping(path = "/masks", method = RequestMethod.PUT)
	@ResponseBody
	public String uptdateMask(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute Mask mask) {

		GsonBuilder gb = new GsonBuilder();
		gb.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
		Gson gson = new GsonBuilder().disableHtmlEscaping()
				.setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
				.setPrettyPrinting().serializeNulls()
				.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY)
				.excludeFieldsWithoutExposeAnnotation().create();
		try {
			DaoFactory.getMaskDao().update(mask); // Change 10 by int
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "[OK - 200] Ressource successfully created to ID="
				+ mask.getId();
	}
	
	/**
	 * Use to delete a mask from the DB using his ID as parameter.  
	 * @param request
	 * @param response
	 * @param idMask
	 * @return
	 */
	@RequestMapping(path = "/mask/delete", produces = "application/json", method = RequestMethod.DELETE)
	@ResponseBody
	public String deleteMaskById(HttpServletRequest request,
			HttpServletResponse response, @RequestParam("idMask") String idMask) {

		HashMap<String, Object> map = new HashMap<String, Object>();
		Mask mask = null;

		try {
			DaoFactory.getMaskDao().remove(Integer.parseInt(idMask));

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "OK 200 - Mask id=" + idMask + " have been sucessfully deleted.";
	}

	/**
	 * Use to update a mask which is already existing in the DB using ID as parameter. 
	 * @param request
	 * @param response
	 * @param idMask
	 * @return
	 */
	@RequestMapping(path = "/mask/update", produces = "application/json", method = RequestMethod.PUT)
	@ResponseBody
	public String upadateMask(HttpServletRequest request,
			HttpServletResponse response, Mask mask) {

		return "OK 200 - Mask id=" + mask.getId()
				+ " have been sucessfully updated.";
	}

}
