package fr.stcg.oasis.utility.gson;

import java.lang.reflect.Type;
import java.text.DateFormat;
import java.util.Locale;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import fr.stcg.oasis.beans.HistoricCalculLaunch;

public class GsonDateAdapter implements JsonSerializer<HistoricCalculLaunch>
{
	private final DateFormat dateFormat;
	private final DateFormat timeFormat;
	
	public GsonDateAdapter(Locale locale)
	{
		dateFormat = DateFormat.getDateInstance(DateFormat.MEDIUM, locale);
		timeFormat = DateFormat.getTimeInstance(DateFormat.MEDIUM, locale);
	}

	@Override
	public JsonElement serialize(HistoricCalculLaunch hcl, Type arg1, JsonSerializationContext arg2)
	{
		JsonObject element = new JsonObject();
		element.add("Id", new JsonPrimitive(hcl.getId()));
		element.add("State", new JsonPrimitive(hcl.getState()));
		element.add("Parameters", new JsonPrimitive(hcl.getParameters()));
		element.add("Comments", new JsonPrimitive(hcl.getComments()));
		element.add("DateBegin", new JsonPrimitive(dateFormat.format(hcl.getDateBegin())));
		element.add("TimeBegin", new JsonPrimitive(timeFormat.format(hcl.getTimeBegin())));
		element.add("DateEnd", new JsonPrimitive(dateFormat.format(hcl.getDateEnd())));
		element.add("TimeEnd", new JsonPrimitive(timeFormat.format(hcl.getTimeEnd())));
		
		element.add("Launcher", arg2.serialize(hcl.getLauncher()));
		element.add("Calcul", arg2.serialize(hcl.getCalcul()));
		element.add("Duration", new JsonPrimitive(hcl.getDuration()));
		
		return element;
	}
}
