package fr.stcg.oasis.json;

import java.io.IOException;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import fr.stcg.oasis.beans.Variable;

public class VariableAdapter extends TypeAdapter<Variable>{
	// peut être mieux de mettre en base, demander avis, mais on va mettre idCube dans json
	@Override
	public Variable read(JsonReader in) throws IOException {
		
		String name = "",  associatedDimension = "";
		int id = -1,idCube = -1;
		in.beginObject();
		
		while (in.hasNext()) {

			  String nextName = in.nextName();
			  
			  if(nextName.equals("id"))
			  {
				id = in.nextInt();  
			  }
			  else if (nextName.equals("name")) 
			  {
							
				name = in.nextString();
							
			  }
			  else if (nextName.equals("associatedDimension")) {
				  associatedDimension  = in.nextString();
				  
			  }
			  else if ( nextName.equals("idCube") ) 
			  {
				  idCube = in.nextInt();
			  }
			 
			  

		}
		
		
		in.endObject();
		
		try {
			return new Variable(id,name, associatedDimension, idCube);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			if( "java.io.IOException".equals(e.getClass().getTypeName()) )
				throw new IOException(e);
			
			return null;
		}
	}
	


	@Override
	public void write(JsonWriter out, Variable v) throws IOException {
		out.beginObject();
		out.name("id");
		out.value(v.getId());
		out.name("name");
		out.value(v.getName());
		out.name("associatedDimension");
		out.value(v.getAssociatedDimension().getName());
		out.endObject();
		
	}

}
