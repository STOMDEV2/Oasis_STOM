package fr.stcg.oasis.utility.gson.adapter;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.User;
import fr.stcg.oasis.dao.DaoFactory;

public class MaskAdapter extends TypeAdapter<Mask> {

	private DateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

	/***
	 * Use to write in gson mask entities. (Definition called during conversion
	 * of the file into Gson).
	 */
	public void write(JsonWriter out, Mask value) throws IOException {
		// root of the object
		out.beginObject();
		out.name("id").value(value.getId());
		out.name("nameMask").value(value.getNameMask());
		String lastModificationDate = df
				.format(value.getLastModificationDate());
		out.name("lastModificationDate").value(lastModificationDate);
		String creationDate = df.format(value.getCreationDate());
		out.name("creationDate").value(creationDate);
		// Cube part
		out.name("cube").beginArray();
		out.beginObject();
		out.name("id").value(value.getCube().getId());
		out.name("name").value(value.getCube().getName());
		out.name("application").value(value.getCube().getApplication());
		// Author part
		out.endArray();
		out.name("author").beginArray();
		out.name("id").value(value.getAuthor().getId());
		out.name("login").value(value.getAuthor().getLogin());
		// Row column context part
		out.endArray();
		out.name("columnContext").beginArray();
		for (final ColumnContext columnContext : value.getColumnContext()) {
			out.beginObject();
			out.name("id").value(columnContext.getId());
			out.name("name").value(columnContext.getTitle().getValue());
			out.endObject();
		}
		out.endArray();
		// Row context part
		out.name("rowContext").beginArray();
		for (final RowContext rowContext : value.getRowContext()) {
			out.beginObject();
			out.name("id").value("" + rowContext.getId());
			out.name("name").value(rowContext.getTitle().getValue());
			out.endObject();
		}
		out.endArray();
		// Header context part
		out.name("headerContext").beginArray();
		for (final HeaderDimension headerContext : value.getHeaderContext()) {
			out.beginObject();
			out.name("id").value(headerContext.getId());
			out.name("name").value(headerContext.getValue());
			out.endObject();
		}
		out.endArray();
		out.endObject();
	}

	@Override
	public Mask read(JsonReader in) throws IOException {
		final Mask mask = new Mask();
		in.beginObject();
		while (in.hasNext()) {
			switch (in.nextName()) {
			case "id":
				mask.setId(Integer.parseInt(in.nextString()));
				break;
			case "nameMask":
				mask.setNameMask(in.nextString());
				break;
			case "cube":
				in.beginArray();
				while (in.hasNext()) {
					in.beginObject();
					final Cube cube = new Cube();
					while (in.hasNext()) {
						switch (in.nextName()) {
						case "id":
							cube.setId(in.nextInt());
							break;
						case "name":
							cube.setName(in.nextString());
							break;
						case "application":
							cube.setApplication(in.nextString());
							break;
						}
					}
					in.endObject();
				}
				in.endArray();
				break;
			case "author":
				in.beginArray();
				while (in.hasNext()) {
					in.beginObject();
					final User author = new User();
					while (in.hasNext()) {
						switch (in.nextName()) {
						case "id":
							author.setId(in.nextInt());
							break;
						case "login":
							author.setLogin(in.nextString());
							break;
						}
					}
					in.endObject();
				}
				in.endArray();
				break;
			case "columnContext":
				in.beginArray();
				final List columnContexts = new ArrayList<>();
				while (in.hasNext()) {
					in.beginObject();
					final ColumnContext columnContext = new ColumnContext();
					while (in.hasNext()) {
						switch (in.nextName()) {
						case "id":
							columnContext.setId(in.nextInt());
							break;
						case "login":
//							columnContext.getColumnContextFromJSON(columnContextJSON)(in.nextString());
							break;
						}
					}
					in.endObject();
				}
				in.endArray();
				break;
			case "rowContext":
				in.beginArray();
				while (in.hasNext()) {
					in.beginObject();
					final User author = new User();
					while (in.hasNext()) {
						switch (in.nextName()) {
						case "id":
							author.setId(in.nextInt());
							break;
						case "login":
							author.setLogin(in.nextString());
							break;
						}
					}
					in.endObject();
				}
				in.endArray();
				break;

			}

		}
		in.endObject();

		return mask;
	}

}
