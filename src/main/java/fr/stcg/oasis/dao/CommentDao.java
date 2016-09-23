package fr.stcg.oasis.dao;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.Comment;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.RowContext;

public interface CommentDao
{
	Comment findCommentByColumnAndRowAndGrid(ColumnContext columnContext,
			RowContext rowContext, Grid grid);
}
