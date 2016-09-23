package fr.stcg.oasis.dao;

import fr.stcg.oasis.dao.jpa.CalculDaoImpl;
import fr.stcg.oasis.dao.jpa.CalculParameterDaoImpl;
import fr.stcg.oasis.dao.jpa.ColumnContextDaoImpl;
import fr.stcg.oasis.dao.jpa.ColumnDimensionDaoImpl;
import fr.stcg.oasis.dao.jpa.CommentDaoImpl;
import fr.stcg.oasis.dao.jpa.CubeDaoImpl;
import fr.stcg.oasis.dao.jpa.DimensionsDaoImpl;
import fr.stcg.oasis.dao.jpa.GridDaoImpl;
import fr.stcg.oasis.dao.jpa.GridElementDaoImpl;
import fr.stcg.oasis.dao.jpa.GridStyleDaoImpl;
import fr.stcg.oasis.dao.jpa.HeaderDimensionDaoImpl;
import fr.stcg.oasis.dao.jpa.HistoricCalculLaunchDaoImpl;
import fr.stcg.oasis.dao.jpa.MaskDaoImpl;
import fr.stcg.oasis.dao.jpa.MembreDaoImpl;
import fr.stcg.oasis.dao.jpa.OrderedScriptDaoImpl;
import fr.stcg.oasis.dao.jpa.ProfileDaoImpl;
import fr.stcg.oasis.dao.jpa.RowContextDaoImpl;
import fr.stcg.oasis.dao.jpa.RowDimensionDaoImpl;
import fr.stcg.oasis.dao.jpa.ScenarioParameterImplDao;
import fr.stcg.oasis.dao.jpa.ScriptDaoImpl;
import fr.stcg.oasis.dao.jpa.StyleDaoImpl;
import fr.stcg.oasis.dao.jpa.TreeSelectionDaoImpl;
import fr.stcg.oasis.dao.jpa.UserDaoImpl;
import fr.stcg.oasis.dao.jpa.VariableDaoImpl;
import fr.stcg.oasis.dao.jpa.VariableParameterDaoImpl;


public class DaoFactory 
{
	private DaoFactory()
	{
		
	}
	
	public static UserDaoImpl getUserDao()
	{
		return new UserDaoImpl();
	}
	
	public static MaskDaoImpl getMaskDao()
	{
		return new MaskDaoImpl();
	}
	
	public static ProfileDaoImpl getProfileDao() 
	{
		return new ProfileDaoImpl();
	}
	
	public static CubeDaoImpl getCubeDao()
	{
		return new CubeDaoImpl();
	}
	
	public static VariableDaoImpl getVariableDao()
	{
		return new VariableDaoImpl();
	}
	
	public static MembreDaoImpl getMembreDao()
	{
		return new MembreDaoImpl();
	}
	
	public static DimensionsDaoImpl getDimensionDao()
	{
		return new DimensionsDaoImpl();
	}
	
	public static ColumnContextDaoImpl getColumnContextDao()
	{
		return new ColumnContextDaoImpl();
	}
	
	public static ColumnDimensionDaoImpl getColumnDimensionDao()
	{
		return new ColumnDimensionDaoImpl();
	}
	
	public static RowContextDaoImpl getRowContextDao()
	{
		return new RowContextDaoImpl();
	}
	
	public static RowDimensionDaoImpl getRowDimensionDao()
	{
		return new RowDimensionDaoImpl();
	}
	
	public static GridDaoImpl getGridDao()
	{
		return new GridDaoImpl();
	}
	
	public static HeaderDimensionDaoImpl getHeaderDimensionDao()
	{
		return new HeaderDimensionDaoImpl();
	}
	
	public static ScenarioParameterImplDao getScenarioParametersDao()
	{
		return new ScenarioParameterImplDao();
	}
	
	public static GridElementDaoImpl getGridElementDao()
	{
		return new GridElementDaoImpl();
	}
	
	public static StyleDaoImpl getStyleDao()
	{
		return new StyleDaoImpl();
	}
	
	public static ScriptDaoImpl getScriptDao()
	{
		return new ScriptDaoImpl();
	}
	
	public static OrderedScriptDaoImpl getOrderedScriptDao()
	{
		return new OrderedScriptDaoImpl();
	}
	
	public static CalculDaoImpl getCalculDao()
	{
		return new CalculDaoImpl();
	}
	
	public static CommentDaoImpl getCommentDao()
	{
		return new CommentDaoImpl();
	}
	
	public static GridStyleDaoImpl getGridStyleDao()
	{
		return new GridStyleDaoImpl();
	}
	
	public static CalculParameterDaoImpl getCalculParameterDao()
	{
		return new CalculParameterDaoImpl();
	}
	
	public static TreeSelectionDaoImpl getTreeSelectionDao()
	{
		return new TreeSelectionDaoImpl();
	}
	
	public static HistoricCalculLaunchDaoImpl getHistoricCalculLaunchDao()
	{
		return new HistoricCalculLaunchDaoImpl();
	}
	
	public static VariableParameterDaoImpl getVariableParameterDao()
	{
		return new VariableParameterDaoImpl();
	}
}
