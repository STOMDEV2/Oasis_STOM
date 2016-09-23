package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.GridStyle;
import fr.stcg.oasis.beans.RowContext;

public interface GridStyleDao {

	GridStyle findGridStyleByColumnContextAndRowContextAndGrid(
			ColumnContext columnContext, RowContext rowContext, Grid grid);

}
