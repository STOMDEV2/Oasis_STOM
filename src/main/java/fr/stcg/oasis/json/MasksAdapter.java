package fr.stcg.oasis.json;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import fr.stcg.oasis.beans.Mask;

public class MasksAdapter implements JsonSerializer<Mask> {

	@Override
	public JsonElement serialize(Mask src, Type typeOfSrc,
			JsonSerializationContext context) {
		JsonObject root = new JsonObject();
		root.addProperty("id", src.getId());
		root.addProperty("nameMask",
				src.getLastEditor() != null ? src.getNameMask() : "");
		root.addProperty("cube", src.getCube() != null ? src.getCube()
				.getName() : "");
		root.addProperty("author", src.getAuthor() != null ? src.getAuthor()
				.getName() : "");
		root.addProperty("lastEditor", src.getLastEditor() != null ? src
				.getLastEditor().getName() : "");
		List<String> list = new ArrayList<String>();
		final JsonArray columnContext = new JsonArray();
		final JsonArray rowContext = new JsonArray();
		final JsonArray headerContext = new JsonArray();
		
		// on retourne l'intégralité d'un masque + les sous éléments.. etc ...
//		list.add("JAVA");
//		list.add("JSON");
//		list.add("JSF");
//		list.add("HIBERNATE");
//		for (final String author : book.getAuthors()) {
//			final JsonPrimitive jsonAuthor = new JsonPrimitive(author);
//			jsonAuthorsArray.add(jsonAuthor);
//		}
//		jsonObject.add("authors", jsonAuthorsArray);
//
//		root.accumulate("technology", list);

		return root;
	}

}
