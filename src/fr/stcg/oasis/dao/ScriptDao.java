package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.Cube;
import fr.stcg.oasis.beans.Script;

public interface ScriptDao {

	Script findScriptByCubeAndName(Cube cube, String name);

}
