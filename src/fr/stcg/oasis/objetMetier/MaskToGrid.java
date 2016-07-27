package fr.stcg.oasis.objetMetier;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import com.essbase.api.dataquery.IEssCubeView;
import com.essbase.api.dataquery.IEssGridView;
import com.essbase.api.dataquery.IEssOperation;
import com.essbase.api.datasource.IEssCube;

import fr.stcg.oasis.beans.ColumnContext;
import fr.stcg.oasis.beans.ColumnDimension;
import fr.stcg.oasis.beans.Comment;
import fr.stcg.oasis.beans.Grid;
import fr.stcg.oasis.beans.HeaderDimension;
import fr.stcg.oasis.beans.Mask;
import fr.stcg.oasis.beans.RowContext;
import fr.stcg.oasis.beans.RowDimension;
import fr.stcg.oasis.beans.ScenarioParameter;
import fr.stcg.oasis.dao.DaoFactory;
import fr.stcg.oasis.essbase.Essbase;

public class MaskToGrid
{	
	private static final String TYPE_RETRIEVE = "Retrieve";
	private static final String TYPE_CAPTURE = "Capture";
	private static final String TYPE_COMMENT = "Comment";



	
	private static boolean getRetrieveCaptureColumnContext(ArrayList<ColumnContext> columnContext, ArrayList<ColumnContext> columnContextRetrieve, ArrayList<ColumnContext> columnContextCapture)
	{
		boolean completed = false;
		
		for(int i = 0, cpt = columnContext.size(); i < cpt; i++)
		{
			if( columnContext.get(i).getType().getValue().equals(TYPE_RETRIEVE) )
				columnContextCapture.add(columnContext.get(i));
			else if( columnContext.get(i).getType().getValue().equals(TYPE_CAPTURE) )
				columnContextRetrieve.add(columnContext.get(i));
			
		}
		completed = true;
		return completed;
	}
	
	private static boolean getRetrieveCaptureHeaderContext(ArrayList<HeaderDimension> headerContext, ArrayList<HeaderDimension> headerContextRetrieve, ArrayList<HeaderDimension> headerContextCapture)
	{
		boolean completed = false;
		
		for(int i = 0, cpt = headerContext.size(); i < cpt; i++)
		{
			if( headerContext.get(i).isRetrieve() )
				headerContextRetrieve.add( headerContext.get(i) );
			else
				headerContextCapture.add( headerContext.get(i) );
		}		
		completed = true;
		return completed;
	}
	
	public static String[][] maskToGrid(Grid grid, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString)
	{
		System.out.println("cubestring" + cubeString);
		String[][] gridRetrieve = getRetrieveGrid(grid.getMask(), essbaseSessionInfos, applicationString, cubeString, grid),
				   gridCapture = getCaptureGrid(grid.getMask(), essbaseSessionInfos, applicationString, cubeString, grid),
				   gridComments = getCommentGrid(grid);
		
		ArrayList<ColumnContext> columnContext = new ArrayList<ColumnContext>(grid.getMask().getColumnContext());
		
		int nbCols = columnContext.size(),
			nbRows = grid.getMask().getRowContext().size(),
			nbColsRetrieve = 0,
			nbColsCapture = 0;
			
			if(gridRetrieve != null) 
				nbColsRetrieve = gridRetrieve[0].length;
			
			
			if(gridCapture != null)
				nbColsCapture = gridCapture[0].length;
			
			System.out.println(nbColsRetrieve +" cr");
			System.out.println(nbColsCapture + " cc");
		
		System.out.println("nbRows m" + nbRows);
		System.out.println("nbCols m" + nbCols + "mCC " + columnContext.size());
		
		String[][] gridValues = new String[nbRows][nbCols];
		
		int colRetrieve = 0,
			colCapture = 0,
			colComment = 0;
			
		
		
		for(int i = 0, cpt = nbCols; i <cpt ; i += 1)
		{
			System.out.println("columnType " + columnContext.get(i).getType());
			if(columnContext.get(i).getType().getValue().equals(TYPE_RETRIEVE))
			{
				for(int m = 0; m < nbRows; m += 1)
				{
					System.out.println("OUAIS OUAISISOISOU: " + gridRetrieve[m][colRetrieve]);
					
					gridValues[m][i] = gridRetrieve[m][colRetrieve];
				}
				
				colRetrieve += 1;
			}
			else if(columnContext.get(i).getType().getValue().equals(TYPE_CAPTURE))
			{
				for(int k = 0; k < nbRows; k += 1)
				{
					System.out.println("OUAIS OUAISISOISOU CAPTURE: " + gridCapture[k][colCapture]);
					System.out.println(i + " " + k);
					gridValues[k][i] = gridCapture[k][colCapture];
				}
				
				colCapture += 1;
			}
		}
		
		displayGrid(gridComments);
//		System.out.println(gridComments.length);
		for(int j = 0; j < gridComments.length; j++)
		{
			for(int k = 0; k < gridComments[j].length; k += 1)
			{
				System.out.println(k + " " + colComment);
				System.out.println("OUAIS OUAISISOISOU COMMENT: " + gridComments[j][k]);
//				System.out.println(i + " " + k);
				gridValues[j][nbCols - 1 + k] = gridComments[j][k];
			}
			colComment += 1;
		}
		
		System.out.println("fuckin gridValues");
		for(int i=0; i < nbRows; i++)
		{
			for(int j=0; j < nbCols; j++)
			{
				System.out.print(gridValues[i][j] + " \t");
			}
			
			System.out.println();
		}
		
		return gridValues;
	}
	
	
	private static String[][] getCommentGrid(Grid grid)
	{
		HashMap<ColumnContext, ArrayList<String>> contexts = new HashMap<ColumnContext, ArrayList<String>>();
		
		for(Comment comment: grid.getComments())
		{
			ColumnContext context = comment.getColumnContext();
			
			if(!contexts.containsKey(context))
				contexts.put(context, new ArrayList<String>());
				
			contexts.get(context).add(comment.getComment());
		}
		
		int maxChildren = 0;
		Iterator<Entry<ColumnContext, ArrayList<String>>> it = contexts.entrySet().iterator();
		while(it.hasNext())
		{
			Map.Entry<ColumnContext, ArrayList<String>> pairs = (Map.Entry<ColumnContext, ArrayList<String>>) it.next();
			
			maxChildren = pairs.getValue().size();
		}
		
		String[][] commentValues = new String[maxChildren][contexts.size()];
		int columnIndex = 0;
		it = contexts.entrySet().iterator();
		while(it.hasNext())
		{
			Map.Entry<ColumnContext, ArrayList<String>> pairs = (Map.Entry<ColumnContext, ArrayList<String>>) it.next();
			
			for(String value: pairs.getValue())
			{
				int valueIndex = pairs.getValue().indexOf(value);
				
				commentValues[valueIndex][columnIndex] = value;
			}
			columnIndex++;
		}
		
		displayGrid(commentValues);
		
		return commentValues;
	}
	
	
	private static String[][] getCaptureGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString, Grid grid)
	{
		try
		{
			ArrayList<HeaderDimension> headerDimensionCapture = DaoFactory.getMaskDao().findTypeHeaderDimension(mask, false);
			ArrayList<ColumnContext> columnContextCapture = DaoFactory.getMaskDao().findTypeColumnContext(mask, TYPE_CAPTURE);
			ArrayList<RowContext> rowContext = new ArrayList<RowContext>(mask.getRowContext());
			
			int nbColsHeaderContext = headerDimensionCapture.size(),
					nbColsColumnContext = columnContextCapture.size(),
					nbColsRowContext = rowContext.get(0).getRowDimensions().size() / 2,
					nbLinesHeaderContext = nbColsHeaderContext > 0 ? 1 : 0,
					nbLinesColumnContext = columnContextCapture.get(0).getColumnsDimensions().size(),
					nbLinesRowContext = rowContext.size();
					
			int nbRows = nbLinesHeaderContext + nbLinesColumnContext + nbLinesRowContext,
				nbCols = nbColsHeaderContext > nbColsColumnContext ? (nbColsRowContext + nbColsHeaderContext + 1) : (nbColsColumnContext + nbColsRowContext + 1);
				
				String[][] gridCapture = new String[nbRows][nbCols];
				
				//headerContext
				for(int i = 0, startIndexCol = 1 + nbColsRowContext, cpt = headerDimensionCapture.size(); i < cpt; i+=1, startIndexCol +=1 )
				{
					gridCapture[0][startIndexCol] = headerDimensionCapture.get(i).getValue();
					System.out.println("headerDimensionCapture " + headerDimensionCapture.get(i));
				}
				
				//ColumnContext
				for(int i = 0, indexCol = 1 + nbColsRowContext, cpt = columnContextCapture.size(); i < cpt; i+=1, indexCol += 1)
				{
					ArrayList<ColumnDimension> columnDimension = new ArrayList<ColumnDimension>(columnContextCapture.get(i).getColumnsDimensions());
					
					for(int j = 0 , indexRow = nbLinesHeaderContext , jCpt = columnDimension.size(); j < jCpt ; j += 1, indexRow +=1)
					{
						String value = columnDimension.get(j).getGridElement().getValue();
						if(value.indexOf("%") == 0)
						{
							boolean isRetrieve = (columnContextCapture.get(i).getType().getValue().equals("Retrieve") ? true : false);
							ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByVariableAndGrid(value, grid, isRetrieve);
							
							value = parameter.getValue();
						}
						
						gridCapture[indexRow][indexCol] = value;

						System.out.println("columnDimension " + columnDimension.get(j).toString());
					}
				}
				
				//RowContext
				for(int i = 0, indexRow = nbLinesHeaderContext+nbLinesColumnContext, cpt = rowContext.size(); i < cpt; i+=1, indexRow += 1)
				{
					ArrayList<RowDimension> rowDimension = new ArrayList<RowDimension>(rowContext.get(i).getRowDimensions());
					
					for(int j = 0, jCpt = rowDimension.size()/2; j< jCpt; j+=1 )
					{
						if(!rowDimension.get(j+jCpt).getDimension().getName().equals("Formule") && rowDimension.get(j+jCpt).getType().equals(TYPE_CAPTURE))
						{
							String value = rowDimension.get(j+jCpt).getGridElement().getValue();
							if(value.indexOf("%") == 0)
							{
								boolean isRetrieve = (rowDimension.get(j+jCpt).getType().equals("Retrieve") ? true : false);						
								ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByVariableAndGrid(value, grid, isRetrieve);
								
								value = parameter.getValue();
							}

							
							gridCapture[indexRow][j] = value;
						}
						else if(rowDimension.get(j).getDimension().getName().equals("Formule"))
						{
							gridCapture[indexRow][j] = "0";
						}
						System.out.println("rowDimension" + rowDimension.get(j).toString());
					}
				}
				
				for(int i=0, cpt = nbRows; i < cpt; i+= 1)
				{
					for(int j = 0, jCpt = nbCols; j < jCpt; j+=1)
					{
						System.out.print(gridCapture[i][j] + "\t");
					}
					
					System.out.println();
				}
				
				Essbase essbase = new Essbase(essbaseSessionInfos);
				
				IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationString, cubeString);
				IEssCubeView cubeView = cube.openCubeView("default");
				
				
				// Mettre à jour options (necessaire)
				cubeView.updatePropertyValues();
				// Grille à partir du cubeView
				IEssGridView gridView = cubeView.getGridView();
				gridView.setSize(nbRows, nbCols);
				
				for (int i = 0, cpt = nbRows; i < cpt; i += 1) {

					for (int j = 0, jCpt = nbCols; j < jCpt; j += 1) {
						if (gridCapture[i][j] != null)
							gridView.setValue(i, j, gridCapture[i][j]);
					}
				}

				IEssOperation essOp = cubeView.createIEssOpRetrieve();
				cubeView.performOperation(essOp);

				String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];

				for (int i = nbLinesColumnContext + nbLinesHeaderContext, m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
					for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
						gridValues[m][n] = gridView.getStringValue(i, j);
						System.out
								.print(" " + gridView.getStringValue(i, j) + "\t");
					}

					System.out.print("\n");
				}
				
				return gridValues;
				
		}
		catch(SQLException e)
		{
			e.printStackTrace();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return null;
	}
	
	private static String[][] getRetrieveGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString, Grid grid) 
	{
		try 
		{
			ArrayList<HeaderDimension> headerDimensionRetrieve = DaoFactory.getMaskDao().findTypeHeaderDimension(mask, true);
			ArrayList<ColumnContext> columnContextRetrieve = DaoFactory.getMaskDao().findTypeColumnContext(mask, TYPE_RETRIEVE);
			ArrayList<RowContext> rowContext = new ArrayList<RowContext>(mask.getRowContext());
			
//			for(int i = 0; i < rowContext.size(); i++)
//			{
//				RowContext context = rowContext.get(i);
//				
//				boolean itsok = false;
//				for(RowDimension dimension: context.getRowDimensions())
//					if(dimension.getDimension().getName().equals("Formule"))
//					{
//						System.out.println("OUAIS KO CEST BON CA PASSE");
//						itsok = true;
////						rowContext.remove(i);
//						break;
//					}
//				
//				if(itsok)
//					rowContext.remove(i);
//			}
			
			int nbColsHeaderContext = headerDimensionRetrieve.size(),
				nbColsColumnContext = columnContextRetrieve.size(),
				nbColsRowContext = rowContext.get(0).getRowDimensions().size() / 2,
				nbLinesHeaderContext = nbColsHeaderContext > 0 ? 1 : 0,
				nbLinesColumnContext = columnContextRetrieve.get(0).getColumnsDimensions().size(),
				nbLinesRowContext = rowContext.size();
				
				System.out.println("rowContext" + rowContext.size());
				
				System.out.println("nbColsHeaderContext " + nbColsHeaderContext);
				System.out.println("nbColsColumnContext " + nbColsColumnContext);
				System.out.println("nbColsRowContext " + nbColsRowContext + " " + rowContext.get(0).getRowDimensions().size());
				System.out.println("nbLinesHeaderContext " + nbLinesHeaderContext);
				System.out.println("nbLinesColumnContext " + nbLinesColumnContext);
				System.out.println("nbLinesRowContext " + nbLinesRowContext);
				
			int nbRows = nbLinesHeaderContext + nbLinesColumnContext + nbLinesRowContext,
				nbCols = nbColsHeaderContext > nbColsColumnContext ? (nbColsRowContext + nbColsHeaderContext + 1) : (nbColsColumnContext + nbColsRowContext + 1);
				
			System.out.println("nbRows " + nbRows );
			System.out.println("nbCols " + nbCols );
			
			String[][] gridRetrieve = new String[nbRows][nbCols];
			
			//headerContext
			for(int i = 0, startIndexCol = 1 + nbColsRowContext, cpt = headerDimensionRetrieve.size(); i < cpt; i+=1, startIndexCol +=1 )
			{
				gridRetrieve[0][startIndexCol] = headerDimensionRetrieve.get(i).getValue();
				System.out.println("headerDimensionRetrieve " + headerDimensionRetrieve.get(i).toString() );
			}
			
			//ColumnContext
			for(int i = 0, indexCol = 1 + nbColsRowContext, cpt = columnContextRetrieve.size(); i < cpt; i+=1, indexCol += 1)
			{
				ArrayList<ColumnDimension> columnDimension = new ArrayList<ColumnDimension>(columnContextRetrieve.get(i).getColumnsDimensions());
				
				for(int j = 0 , indexRow = nbLinesHeaderContext , jCpt = columnDimension.size(); j < jCpt ; j += 1, indexRow +=1)
				{

					String value = columnDimension.get(j).getGridElement().getValue();
					if(value.indexOf("%") == 0)
					{
						boolean isRetrieve = (columnContextRetrieve.get(i).getType().getValue().equals("Retrieve") ? true : false);								
						ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByVariableAndGrid(value, grid, isRetrieve);
						
						value = parameter.getValue();
					}
					
					gridRetrieve[indexRow][indexCol] = value;

					System.out.println("columnDimension" + columnDimension.get(j).toString());
				}
				
			}
			
			//RowContext
			for(int i = 0, indexRow = nbLinesHeaderContext+nbLinesColumnContext, cpt = rowContext.size(); i < cpt; i+=1, indexRow += 1)
			{
				ArrayList<RowDimension> rowDimension = new ArrayList<RowDimension>(rowContext.get(i).getRowDimensions());
				
				for(int j = 0, jCpt = rowDimension.size(); j< jCpt; j+=1 )
				{
					System.out.println("name Dimension & Type " + rowDimension.get(j).getDimension().getName()+ ";" + rowDimension.get(j).getType().equals(TYPE_RETRIEVE));
					if(!rowDimension.get(j).getDimension().getName().equals("Formule") && rowDimension.get(j).getType().equals(TYPE_RETRIEVE))
					{
						String value = rowDimension.get(j).getGridElement().getValue();
						if(value.indexOf("%") == 0)
						{
							boolean isRetrieve = (rowDimension.get(j+jCpt).getType().equals("Retrieve") ? true : false);								
							ScenarioParameter parameter = DaoFactory.getScenarioParametersDao().getScenarioParameterByVariableAndGrid(value, grid, isRetrieve);
							
							value = parameter.getValue();
						}
						
						gridRetrieve[indexRow][j] = value;
					}
					else if(rowDimension.get(j).getDimension().getName().equals("Formule"))
					{
						gridRetrieve[indexRow][j] = "0";
					}
					
					System.out.println("rowDimension" + rowDimension.get(j).toString());
				}
			}
			
			for(int i=0, cpt = nbRows; i < cpt; i+= 1)
			{
				for(int j = 0, jCpt = nbCols; j < jCpt; j+=1)
				{
					System.out.print(gridRetrieve[i][j] + "\t");
				}
				
				System.out.println();
			}
			
			Essbase essbase = new Essbase(essbaseSessionInfos);
			
			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationString, cubeString);
			IEssCubeView cubeView = cube.openCubeView("default");
			
			
			// Mettre à jour options (necessaire)
			cubeView.updatePropertyValues();
			// Grille à partir du cubeView
			IEssGridView gridView = cubeView.getGridView();
			gridView.setSize(nbRows, nbCols);
			
			for (int i = 0, cpt = nbRows; i < cpt; i += 1) {

				for (int j = 0, jCpt = nbCols; j < jCpt; j += 1) {
					if (gridRetrieve[i][j] != null)
						gridView.setValue(i, j, gridRetrieve[i][j]);
				}
			}

			IEssOperation essOp = cubeView.createIEssOpRetrieve();
			cubeView.performOperation(essOp);

			String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];

			for (int i = (nbLinesColumnContext + nbLinesHeaderContext), m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
				for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
					gridValues[m][n] = gridView.getStringValue(i, j);
					System.out
							.print(" " + gridView.getStringValue(i, j) + "\t");
				}

				System.out.print("\n");
			}
			
			return gridValues;

		} 
		catch (SQLException e) 
		{
			
			e.printStackTrace();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return null;
				
	}
	
	private static void displayGrid(String[][] grid)
	{
		try
		{
			for (int i = 0; i < grid.length; i++)
			{
				for (int j = 0; j < grid[i].length; j++)
				{
					System.out.print(grid[i][j] + "\t");
				}
				
				System.out.println();
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
//	public static String[][] maskToGrid (Mask mask,  HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString)
//	{
//		
//		String[][] gridRetrieve = getRetrieveGrid(mask, essbaseSessionInfos, applicationString, cubeString),
//				   gridCapture = getCaptureGrid(mask, essbaseSessionInfos, applicationString, cubeString);
//		
//		ArrayList<ColumnContext> columnContext = new ArrayList<ColumnContext>(mask.getColumnContext());
//		
//		int nbCols = columnContext.size(),
//			nbRows = mask.getRowContext().size(),
//			nbColsRetrieve = 0,
//			nbColsCapture = 0;
//			
//			if(gridRetrieve != null) 
//				nbColsRetrieve = gridRetrieve[0].length;
//			
//			
//			if(gridCapture != null)
//				nbColsCapture = gridCapture[0].length;
//			
//			System.out.println(nbColsRetrieve +" cr");
//			System.out.println(nbColsCapture + " cc");
//		
//		System.out.println("nbRows m" + nbRows);
//		System.out.println("nbCols m" + nbCols + "mCC " + columnContext.size());
//		
//		String[][] gridValues = new String[nbRows][nbCols];
//		
//		int colRetrieve = 0,
//			colCapture = 0;
//			
//		
//		
//		for(int i = 0, cpt = nbCols; i <cpt ; i += 1)
//		{
//			System.out.println("columnType " + columnContext.get(i).getType());
//			if(columnContext.get(i).getType().equals(TYPE_RETRIEVE))
//			{
//				for(int m = 0; m < nbRows; m += 1)
//				{
//					gridValues[m][i] = gridRetrieve[m][colRetrieve];
//				}
//				
//				colRetrieve += 1;
//			}
//			else
//			{
//				for(int k = 0; k < nbRows; k += 1 )
//				{
//					gridValues[k][i] = gridCapture[k][colCapture];
//				}
//				
//				colCapture += 1;
//			}
//		
//		}
//		
//		System.out.println("fuckin gridValues");
//		for(int i=0; i < nbRows; i++)
//		{
//			for(int j=0; j < nbCols; j++)
//			{
//				System.out.print(gridValues[i][j] + " \t");
//			}
//			
//			System.out.println();
//		}
//		
//		return gridValues;
//	}
//	
//	
//	private static String[][] getCaptureGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString)
//	{
//		try
//		{
//			ArrayList<HeaderDimension> headerDimensionCapture = DaoFactory.getMaskDao().findTypeHeaderDimension(mask, false);
//			ArrayList<ColumnContext> columnContextCapture = DaoFactory.getMaskDao().findTypeColumnContext(mask, TYPE_CAPTURE);
//			ArrayList<RowContext> rowContext = new ArrayList<RowContext>(mask.getRowContext());
//			
//			int nbColsHeaderContext = headerDimensionCapture.size(),
//					nbColsColumnContext = columnContextCapture.size(),
//					nbColsRowContext = rowContext.get(0).getRowDimensions().size() / 2,
//					nbLinesHeaderContext = nbColsHeaderContext > 0 ? 1 : 0,
//					nbLinesColumnContext = columnContextCapture.get(0).getColumnsDimensions().size(),
//					nbLinesRowContext = rowContext.size();
//					
//			int nbRows = nbLinesHeaderContext + nbLinesColumnContext + nbLinesRowContext,
//				nbCols = nbColsHeaderContext > nbColsColumnContext ? (nbColsRowContext + nbColsHeaderContext + 1) : (nbColsColumnContext + nbColsRowContext + 1);
//				
//				String[][] gridCapture = new String[nbRows][nbCols];
//				
//				//headerContext
//				for(int i = 0, startIndexCol = 1 + nbColsRowContext, cpt = headerDimensionCapture.size(); i < cpt; i+=1, startIndexCol +=1 )
//				{
//					gridCapture[0][startIndexCol] = headerDimensionCapture.get(i).getValue();
//					System.out.println("headerDimensionCapture " + headerDimensionCapture.get(i));
//				}
//				
//				//ColumnContext
//				for(int i = 0, indexCol = 1 + nbColsRowContext, cpt = columnContextCapture.size(); i < cpt; i+=1, indexCol += 1)
//				{
//					ArrayList<ColumnDimension> columnDimension = new ArrayList<ColumnDimension>(columnContextCapture.get(i).getColumnsDimensions());
//					
//					for(int j = 0 , indexRow = nbLinesHeaderContext , jCpt = columnDimension.size(); j < jCpt ; j += 1, indexRow +=1)
//					{
//						gridCapture[indexRow][indexCol] = columnDimension.get(j).getGridElement().getValue();
//						System.out.println("columnDimension " + columnDimension.get(j).toString());
//					}
//					
//				}
//				
//				//RowContext
//				for(int i = 0, indexRow = nbLinesHeaderContext+nbLinesColumnContext, cpt = rowContext.size(); i < cpt; i+=1, indexRow += 1)
//				{
//					ArrayList<RowDimension> rowDimension = new ArrayList<RowDimension>(rowContext.get(i).getRowDimensions());
//					
//					for(int j = 0, jCpt = rowDimension.size()/2; j< jCpt; j+=1 )
//					{
//						if(!rowDimension.get(j+jCpt).getDimension().getName().equals("Formule") && rowDimension.get(j+jCpt).getType().equals(TYPE_CAPTURE) )
//						{
//							gridCapture[indexRow][j] = rowDimension.get(j+jCpt).getGridElement().getValue();
//							
//						}
//						System.out.println("rowDimension" + rowDimension.get(j).toString());
//					}
//				}
//				
//				for(int i=0, cpt = nbRows; i < cpt; i+= 1)
//				{
//					for(int j = 0, jCpt = nbCols; j < jCpt; j+=1)
//					{
//						System.out.print(gridCapture[i][j] + "\t");
//					}
//					
//					System.out.println();
//				}
//				
//				Essbase essbase = new Essbase(essbaseSessionInfos);
//				
//				IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationString, cubeString);
//				IEssCubeView cubeView = cube.openCubeView("default");
//				
//				
//				// Mettre à jour options (necessaire)
//				cubeView.updatePropertyValues();
//				// Grille à partir du cubeView
//				IEssGridView gridView = cubeView.getGridView();
//				gridView.setSize(nbRows, nbCols);
//				
//				for (int i = 0, cpt = nbRows; i < cpt; i += 1) {
//
//					for (int j = 0, jCpt = nbCols; j < jCpt; j += 1) {
//						if (gridCapture[i][j] != null)
//							gridView.setValue(i, j, gridCapture[i][j]);
//					}
//				}
//
//				IEssOperation essOp = cubeView.createIEssOpRetrieve();
//				cubeView.performOperation(essOp);
//
//				String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];
//
//				for (int i = nbLinesColumnContext + nbLinesHeaderContext, m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
//					for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
//						gridValues[m][n] = gridView.getStringValue(i, j);
//						System.out
//								.print(" " + gridView.getStringValue(i, j) + "\t");
//					}
//
//					System.out.print("\n");
//				}
//				
//				return gridValues;
//				
//		}
//		catch(SQLException e)
//		{
//			e.printStackTrace();
//		}
//		catch(Exception e)
//		{
//			e.printStackTrace();
//		}
//		
//		return null;
//	}
//	
//	private static String[][] getRetrieveGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString) 
//	{
//		
//		try 
//		{
//			ArrayList<HeaderDimension> headerDimensionRetrieve = DaoFactory.getMaskDao().findTypeHeaderDimension(mask, true);
//			ArrayList<ColumnContext> columnContextRetrieve = DaoFactory.getMaskDao().findTypeColumnContext(mask, TYPE_RETRIEVE);
//			ArrayList<RowContext> rowContext = new ArrayList<RowContext>(mask.getRowContext());
//			
//			int nbColsHeaderContext = headerDimensionRetrieve.size(),
//				nbColsColumnContext = columnContextRetrieve.size(),
//				nbColsRowContext = rowContext.get(0).getRowDimensions().size() / 2,
//				nbLinesHeaderContext = nbColsHeaderContext > 0 ? 1 : 0,
//				nbLinesColumnContext = columnContextRetrieve.get(0).getColumnsDimensions().size(),
//				nbLinesRowContext = rowContext.size();
//				
//				System.out.println("rowContext" + rowContext);
//				
//				System.out.println("nbColsHeaderContext " + nbColsHeaderContext);
//				System.out.println("nbColsColumnContext " + nbColsColumnContext);
//				System.out.println("nbColsRowContext " + nbColsRowContext + " " + rowContext.get(0).getRowDimensions().size());
//				System.out.println("nbLinesHeaderContext " + nbLinesHeaderContext);
//				System.out.println("nbLinesColumnContext " + nbLinesColumnContext);
//				System.out.println("nbLinesRowContext " + nbLinesRowContext);
//				
//			int nbRows = nbLinesHeaderContext + nbLinesColumnContext + nbLinesRowContext,
//				nbCols = nbColsHeaderContext > nbColsColumnContext ? (nbColsRowContext + nbColsHeaderContext + 1) : (nbColsColumnContext + nbColsRowContext + 1);
//				
//			System.out.println("nbRows " + nbRows );
//			System.out.println("nbCols " + nbCols );
//			
//			String[][] gridRetrieve = new String[nbRows][nbCols];
//			
//			//headerContext
//			for(int i = 0, startIndexCol = 1 + nbColsRowContext, cpt = headerDimensionRetrieve.size(); i < cpt; i+=1, startIndexCol +=1 )
//			{
//				gridRetrieve[0][startIndexCol] = headerDimensionRetrieve.get(i).getValue();
//				System.out.println("headerDimensionRetrieve " + headerDimensionRetrieve.get(i).toString() );
//			}
//			
//			//ColumnContext
//			for(int i = 0, indexCol = 1 + nbColsRowContext, cpt = columnContextRetrieve.size(); i < cpt; i+=1, indexCol += 1)
//			{
//				ArrayList<ColumnDimension> columnDimension = new ArrayList<ColumnDimension>(columnContextRetrieve.get(i).getColumnsDimensions());
//				
//				for(int j = 0 , indexRow = nbLinesHeaderContext , jCpt = columnDimension.size(); j < jCpt ; j += 1, indexRow +=1)
//				{
//					gridRetrieve[indexRow][indexCol] = columnDimension.get(j).getGridElement().getValue();
//					System.out.println("columnDimension" + columnDimension.get(j).toString());
//				}
//				
//			}
//			
//			//RowContext
//			for(int i = 0, indexRow = nbLinesHeaderContext+nbLinesColumnContext, cpt = rowContext.size(); i < cpt; i+=1, indexRow += 1)
//			{
//				ArrayList<RowDimension> rowDimension = new ArrayList<RowDimension>(rowContext.get(i).getRowDimensions());
//				
//				for(int j = 0, jCpt = rowDimension.size(); j< jCpt; j+=1 )
//				{
//					System.out.println("name Dimension & Type " + rowDimension.get(j).getDimension().getName()+ ";" + rowDimension.get(j).getType().equals(TYPE_RETRIEVE));
//					if(!rowDimension.get(j).getDimension().getName().equals("Formule") && rowDimension.get(j).getType().equals(TYPE_RETRIEVE) )
//					{
//						gridRetrieve[indexRow][j] = rowDimension.get(j).getGridElement().getValue();
//					}
//					
//					System.out.println("rowDimension" + rowDimension.get(j).toString());
//				}
//			}
//			
//			for(int i=0, cpt = nbRows; i < cpt; i+= 1)
//			{
//				for(int j = 0, jCpt = nbCols; j < jCpt; j+=1)
//				{
//					System.out.print(gridRetrieve[i][j] + "\t");
//				}
//				
//				System.out.println();
//			}
//			
//			Essbase essbase = new Essbase(essbaseSessionInfos);
//			
//			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationString, cubeString);
//			IEssCubeView cubeView = cube.openCubeView("default");
//			
//			
//			// Mettre à jour options (necessaire)
//			cubeView.updatePropertyValues();
//			// Grille à partir du cubeView
//			IEssGridView gridView = cubeView.getGridView();
//			gridView.setSize(nbRows, nbCols);
//			
//			for (int i = 0, cpt = nbRows; i < cpt; i += 1) {
//
//				for (int j = 0, jCpt = nbCols; j < jCpt; j += 1) {
//					if (gridRetrieve[i][j] != null)
//						gridView.setValue(i, j, gridRetrieve[i][j]);
//				}
//			}
//
//			IEssOperation essOp = cubeView.createIEssOpRetrieve();
//			cubeView.performOperation(essOp);
//
//			String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];
//
//			for (int i = (nbLinesColumnContext + nbLinesHeaderContext), m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
//				for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
//					gridValues[m][n] = gridView.getStringValue(i, j);
//					System.out
//							.print(" " + gridView.getStringValue(i, j) + "\t");
//				}
//
//				System.out.print("\n");
//			}
//			
//			return gridValues;
//
//		} 
//		catch (SQLException e) 
//		{
//			
//			e.printStackTrace();
//		}
//		catch (Exception e)
//		{
//			e.printStackTrace();
//		}
//		
//		return null;
//				
//	}
	
	public static String[][] maskToGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString) throws Exception
	{
		
		ArrayList<ColumnContext> columnContextRetrieve = new ArrayList<ColumnContext>();
		ArrayList<ColumnContext> columnContextCapture = new ArrayList<ColumnContext>();
		ArrayList<HeaderDimension> headerContextRetrieve = new ArrayList<HeaderDimension>();
		ArrayList<HeaderDimension> headerContextCapture = new ArrayList<HeaderDimension>();
		
		getRetrieveCaptureColumnContext((ArrayList<ColumnContext>)mask.getColumnContext(),columnContextRetrieve,columnContextCapture);
		getRetrieveCaptureHeaderContext((ArrayList<HeaderDimension>)mask.getHeaderContext(), headerContextRetrieve, headerContextCapture);
		
		String[][] gridRetrieve = getRetrieveGrid(mask, essbaseSessionInfos, applicationString, cubeString,columnContextRetrieve,headerContextRetrieve),
				   gridCapture = getCaptureGrid(mask, essbaseSessionInfos, applicationString, cubeString,columnContextCapture,headerContextCapture);
		
		ArrayList<ColumnContext> columnContext = new ArrayList<ColumnContext>(mask.getColumnContext());
		
		int nbCols = columnContext.size(),
			nbRows = mask.getRowContext().size(),
			nbColsRetrieve = 0,
			nbColsCapture = 0;
			
			if(gridRetrieve != null) 
				nbColsRetrieve = gridRetrieve[0].length;
			
			
			if(gridCapture != null)
				nbColsCapture = gridCapture[0].length;
			
			System.out.println(nbColsRetrieve +" cr");
			System.out.println(nbColsCapture + " cc");
		
		System.out.println("nbRows m" + nbRows);
		System.out.println("nbCols m" + nbCols + "mCC " + columnContext.size());
		
		String[][] gridValues = new String[nbRows][nbCols];
		
		int colRetrieve = 0,
			colCapture = 0;
			
		
		
		for(int i = 0, cpt = nbCols; i <cpt ; i += 1)
		{
			System.out.println("columnType " + columnContext.get(i).getType());
			if(columnContext.get(i).getType().getValue().equals(TYPE_RETRIEVE))
			{
				for(int m = 0; m < nbRows; m += 1)
				{
					System.out.println("OUAIS OUAISISOISOU: " + gridRetrieve[m][colRetrieve]);
					
					gridValues[m][i] = gridRetrieve[m][colRetrieve];
				}
				
				colRetrieve += 1;
			}
			else
			{
				for(int k = 0; k < nbRows; k += 1)
				{
					System.out.println("OUAIS OUAISISOISOU CAPTURE: " + gridCapture[k][colCapture]);
					System.out.println(i + " " + k);
					gridValues[k][i] = gridCapture[k][colCapture];
				}
				
				colCapture += 1;
			}
		}
		
		System.out.println("fuckin gridValues");
		for(int i=0; i < nbRows; i++)
		{
			for(int j=0; j < nbCols; j++)
			{
				System.out.print(gridValues[i][j] + " \t");
			}
			
			System.out.println();
		}
		
		return gridValues;
	}
	
	
	private static String[][] getCaptureGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString, ArrayList<ColumnContext> columnContextCapture, ArrayList<HeaderDimension> headerContextCapture) throws Exception
	{
		try
		{
			
			ArrayList<RowContext> rowContext = new ArrayList<RowContext>(mask.getRowContext());
			
			int nbColsHeaderContext = headerContextCapture.size(),
					nbColsColumnContext = columnContextCapture.size(),
					nbColsRowContext = rowContext.get(0).getRowDimensions().size() / 2,
					nbLinesHeaderContext = nbColsHeaderContext > 0 ? 1 : 0,
					nbLinesColumnContext = columnContextCapture.get(0).getColumnsDimensions().size(),
					nbLinesRowContext = rowContext.size();
					
			int nbRows = nbLinesHeaderContext + nbLinesColumnContext + nbLinesRowContext,
				nbCols = nbColsHeaderContext > nbColsColumnContext ? (nbColsRowContext + nbColsHeaderContext + 1) : (nbColsColumnContext + nbColsRowContext + 1);
				
				String[][] gridCapture = new String[nbRows][nbCols];
				
				//headerContext
				for(int i = 0, startIndexCol = 1 + nbColsRowContext, cpt = headerContextCapture.size(); i < cpt; i+=1, startIndexCol +=1 )
				{
					String value = headerContextCapture.get(i).getValue();
					if( value.indexOf("%") != 0)
						gridCapture[0][startIndexCol] = value;
					else
						throw new Exception("Empty Sparameters");
//					System.out.println("headerDimensionCapture " + headerContextCapture.get(i));
					
				}
				
				//ColumnContext
				for(int i = 0, indexCol = 1 + nbColsRowContext, cpt = columnContextCapture.size(); i < cpt; i+=1, indexCol += 1)
				{
					ArrayList<ColumnDimension> columnDimension = new ArrayList<ColumnDimension>(columnContextCapture.get(i).getColumnsDimensions());
					
					for(int j = 0 , indexRow = nbLinesHeaderContext , jCpt = columnDimension.size(); j < jCpt ; j += 1, indexRow +=1)
					{
						
						String value = columnDimension.get(j).getGridElement().getValue();
						
						if(value.indexOf("%") == 0)
							throw new Exception("Empty Sparameters");
						else
						gridCapture[indexRow][indexCol] = value;
						
						System.out.println("columnDimension " + columnDimension.get(j).toString());
					}
				}
				
				//RowContext
				for(int i = 0, indexRow = nbLinesHeaderContext+nbLinesColumnContext, cpt = rowContext.size(); i < cpt; i+=1, indexRow += 1)
				{
					ArrayList<RowDimension> rowDimension = new ArrayList<RowDimension>(rowContext.get(i).getRowDimensions());
					
					for(int j = 0, jCpt = rowDimension.size()/2; j< jCpt; j+=1 )
					{
						if(!rowDimension.get(j+jCpt).getDimension().getName().equals("Formula") && rowDimension.get(j+jCpt).getType().equals(TYPE_CAPTURE))
						{
							String value = rowDimension.get(j+jCpt).getGridElement().getValue();
							
							if(value.indexOf("%") == 0)
								throw new Exception("Empty Sparameters");
							else
								gridCapture[indexRow][j] = value;
						}
						System.out.println("rowDimension" + rowDimension.get(j).toString());
					}
				}
				
				for(int i=0, cpt = nbRows; i < cpt; i+= 1)
				{
					for(int j = 0, jCpt = nbCols; j < jCpt; j+=1)
					{
						System.out.print(gridCapture[i][j] + "\t");
					}
					
					System.out.println();
				}
				
				Essbase essbase = new Essbase(essbaseSessionInfos);
				
				IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationString, cubeString);
				IEssCubeView cubeView = cube.openCubeView("default");
				
				
				// Mettre à jour options (necessaire)
				cubeView.updatePropertyValues();
				// Grille à partir du cubeView
				IEssGridView gridView = cubeView.getGridView();
				gridView.setSize(nbRows, nbCols);
				
				for (int i = 0, cpt = nbRows; i < cpt; i += 1) {

					for (int j = 0, jCpt = nbCols; j < jCpt; j += 1) {
						if (gridCapture[i][j] != null)
							gridView.setValue(i, j, gridCapture[i][j]);
					}
				}

				IEssOperation essOp = cubeView.createIEssOpRetrieve();
				cubeView.performOperation(essOp);

				String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];

				for (int i = nbLinesColumnContext + nbLinesHeaderContext, m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
					for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
						gridValues[m][n] = gridView.getStringValue(i, j);
						
						if(gridValues[m][n].isEmpty())
							System.out
							.print(" null \t");
						else
						System.out
								.print(" " + gridView.getStringValue(i, j) + "\t");
					}

					System.out.print("\n");
				}
				
				return gridValues;
				
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
			if(e.getMessage().equals("Empty Sparameters"))
				throw e;
		}
		
		return null;
	}
	
	private static String[][] getRetrieveGrid(Mask mask, HashMap<String, String> essbaseSessionInfos, String applicationString, String cubeString, ArrayList<ColumnContext> columnContextRetrieve, ArrayList<HeaderDimension> headerContextRetrieve) throws Exception
	{
		try 
		{
			ArrayList<RowContext> rowContext = new ArrayList<RowContext>(mask.getRowContext());
			
			int nbColsHeaderContext = headerContextRetrieve.size(),
				nbColsColumnContext = columnContextRetrieve.size(),
				nbColsRowContext = rowContext.get(0).getRowDimensions().size() / 2,
				nbLinesHeaderContext = nbColsHeaderContext > 0 ? 1 : 0,
				nbLinesColumnContext = columnContextRetrieve.get(0).getColumnsDimensions().size(),
				nbLinesRowContext = rowContext.size();
				
				System.out.println("rowContext" + rowContext);
				
				System.out.println("nbColsHeaderContext " + nbColsHeaderContext);
				System.out.println("nbColsColumnContext " + nbColsColumnContext);
				System.out.println("nbColsRowContext " + nbColsRowContext + " " + rowContext.get(0).getRowDimensions().size());
				System.out.println("nbLinesHeaderContext " + nbLinesHeaderContext);
				System.out.println("nbLinesColumnContext " + nbLinesColumnContext);
				System.out.println("nbLinesRowContext " + nbLinesRowContext);
				
			int nbRows = nbLinesHeaderContext + nbLinesColumnContext + nbLinesRowContext,
				nbCols = nbColsHeaderContext > nbColsColumnContext ? (nbColsRowContext + nbColsHeaderContext + 1) : (nbColsColumnContext + nbColsRowContext + 1);
				
			System.out.println("nbRows " + nbRows );
			System.out.println("nbCols " + nbCols );
			
			String[][] gridRetrieve = new String[nbRows][nbCols];
			
			//headerContext
			for(int i = 0, startIndexCol = 1 + nbColsRowContext, cpt = headerContextRetrieve.size(); i < cpt; i+=1, startIndexCol +=1 )
			{
				String value =  headerContextRetrieve.get(i).getValue(); 
				
				if(value.indexOf("%") == 0 )
					throw new Exception("Empty Sparameters");
				else 
					gridRetrieve[0][startIndexCol] = value;
				
//				System.out.println("headerDimensionRetrieve " + headerContextRetrieve.get(i).toString() );
			}
			
			//ColumnContext
			for(int i = 0, indexCol = 1 + nbColsRowContext, cpt = columnContextRetrieve.size(); i < cpt; i+=1, indexCol += 1)
			{
				ArrayList<ColumnDimension> columnDimension = new ArrayList<ColumnDimension>(columnContextRetrieve.get(i).getColumnsDimensions());
				
				for(int j = 0 , indexRow = nbLinesHeaderContext , jCpt = columnDimension.size(); j < jCpt ; j += 1, indexRow +=1)
				{
					String value = columnDimension.get(j).getGridElement().getValue();
					if(value.indexOf("%") == 0)
						throw new Exception("Empty Sparameters");
					else 
						gridRetrieve[indexRow][indexCol] = value;
					System.out.println("columnDimension" + columnDimension.get(j).toString());
				}
				
			}
			
			//RowContext
			for(int i = 0, indexRow = nbLinesHeaderContext+nbLinesColumnContext, cpt = rowContext.size(); i < cpt; i+=1, indexRow += 1)
			{
				ArrayList<RowDimension> rowDimension = new ArrayList<RowDimension>(rowContext.get(i).getRowDimensions());
				
				for(int j = 0, jCpt = rowDimension.size(); j< jCpt; j+=1 )
				{
					System.out.println("name Dimension & Type " + rowDimension.get(j).getDimension().getName()+ " " + rowDimension.get(j).getType().equals(TYPE_RETRIEVE));
					if(!rowDimension.get(j).getDimension().getName().equals("Formule") && rowDimension.get(j).getType().equals(TYPE_RETRIEVE))
					{
						
						String value = rowDimension.get(j).getGridElement().getValue();
						
						if(value.indexOf("%") == 0)
							throw new Exception("Empty Sparameters");
						else 
							gridRetrieve[indexRow][j] = value;
					}
					
					System.out.println("rowDimension" + rowDimension.get(j).toString());
				}
			}
			
			for(int i=0, cpt = nbRows; i < cpt; i+= 1)
			{
				for(int j = 0, jCpt = nbCols; j < jCpt; j+=1)
				{
					System.out.print(gridRetrieve[i][j] + "\t");
				}
				
				System.out.println();
			}
			
			Essbase essbase = new Essbase(essbaseSessionInfos);
			
			IEssCube cube = essbase.connectToCube(essbase.getOlapServer(), applicationString, cubeString);
			IEssCubeView cubeView = cube.openCubeView("default");
			
			
			// Mettre à jour options (necessaire)
			cubeView.updatePropertyValues();
			// Grille à partir du cubeView
			IEssGridView gridView = cubeView.getGridView();
			gridView.setSize(nbRows, nbCols);
			
			for (int i = 0, cpt = nbRows; i < cpt; i += 1) {

				for (int j = 0, jCpt = nbCols; j < jCpt; j += 1) {
					if (gridRetrieve[i][j] != null)
						gridView.setValue(i, j, gridRetrieve[i][j]);
				}
			}

			IEssOperation essOp = cubeView.createIEssOpRetrieve();
			cubeView.performOperation(essOp);

			String[][] gridValues = new String[nbLinesRowContext][nbColsColumnContext];

			for (int i = (nbLinesColumnContext + nbLinesHeaderContext), m = 0, cpt = nbRows; i < cpt; i += 1, m += 1) {
				for (int j = (nbColsRowContext + 1), n = 0, jCpt = (1 + nbColsRowContext + nbColsColumnContext); j < jCpt; j += 1, n += 1) {
					gridValues[m][n] = gridView.getStringValue(i, j);
					
					if( gridValues[m][n].isEmpty() )
						System.out
						.print(" null \t");
					else
						System.out
							.print(" " + gridView.getStringValue(i, j) + "\t");
				}

				System.out.print("\n");
			}
			
			return gridValues;

		} 
		catch (Exception e)
		{
			e.printStackTrace();
			
			if(e.getMessage().equals("Empty Sparameters"))
				throw e;
		}
		
		return null;
				
	}
}
