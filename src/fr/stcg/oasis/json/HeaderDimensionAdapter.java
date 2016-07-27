package fr.stcg.oasis.json;

import java.io.IOException;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import fr.stcg.oasis.beans.Dimension;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.dao.DaoFactory;

public class HeaderDimensionAdapter extends TypeAdapter<HeaderDimension>{

	@Override
	public HeaderDimension read(JsonReader in) throws IOException {

	
		String value = "", dimension = "";
		int idCube = -1;
		boolean retrieve = false;
		
		in.beginObject();
		
		while (in.hasNext()) {
			
			String nextName = in.nextName();

			if ( nextName.equals("idCube") ) 
			{
				idCube = in.nextInt();
			}
			else if( nextName.equals("dimension") )
			{
				dimension = in.nextString();
			}
			else if ( nextName.equals("value") )
			{
				value = in.nextString();
			}
			else if (nextName.equals("retrieve"))
			{
				retrieve = in.nextBoolean();  
			}
			  

		}
		
		
		in.endObject();
		
		try {
			Dimension d = DaoFactory.getDimensionDao().findDimensionByName(dimension, DaoFactory.getCubeDao().findById(idCube));
			return new HeaderDimension(d,value, retrieve);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			if( "java.io.IOException".equals(e.getClass().getTypeName()) )
				throw new IOException(e);
			
			return null;
		}
	}

	@Override
	public void write(JsonWriter out, HeaderDimension h) throws IOException {
		out.beginObject();
		out.name("id");
		out.value(h.getId());
		out.name("retrieve");
		out.value(h.isRetrieve());
		out.name("dimension");
		out.value(h.getDimension().getName());
		out.name("value");
		out.value(h.getValue());
		out.endObject();
		
	}
	
	

}
