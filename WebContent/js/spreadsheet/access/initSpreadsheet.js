$(document).on("initDimensions", function(event)
{
	initDimensions();
});

$(document).on("dimensionsSet", function(event)
{
	spreadSheetColumns.autocomplete( JSON.parse( localStorage.getItem('variablesPerDimension') ) );
	spreadSheetLines.autocomplete( JSON.parse( localStorage.getItem('variablesPerDimension') ) );
});

function initDimensions()
{
	if(mask.ColumnContext.length)
	{
		var columnContextContainer = $("#divColumnContext");
		var dimensions = mask.ColumnContext[0].ColumnsDimensions;

		for(var i = 0; i < dimensions.length; i++)
		{
			var dimensionName = dimensions[i].Dimension.Name;

			var element = getDimensionElementByLabel(dimensionName);
			console.log(element);
			handleDropping(element, columnContextContainer, true);
		}
	}
	
	if(mask.RowContext.length)
	{
		var rowContextContainer = $("#divRowContext");
		var dimensions = mask.RowContext[0].RowDimensions;
		var dimensionNames = [];

		for(var i = 0; i < dimensions.length; i++)
		{
			var dimensionName = dimensions[i].Dimension.Name;

			if($.inArray(dimensionName, dimensionNames) > -1)
				continue;

			var element = getDimensionElementByLabel(dimensionName);

			handleDropping(element, rowContextContainer, true);

			dimensionNames.push(dimensionName);
		}
	}
	
	spreadSheetColumns.placeData();
	spreadSheetLines.placeData();
	
	spreadSheetColumns.deselectAll();
	spreadSheetLines.deselectAll();
}



var spreadSheetColumns;
var spreadSheetLines;
$(document).ready(function()
{
	spreadSheetColumns = $("#spreadsheetColumns").spreadSheet({
							lines: [
										[
											{
												data: "Title",
												isEditable: true
											}
										],
										[
											{
												data: "Type",
												model: ["Retrieve", "Capture", "Comment", "Formula"]
											}
										],
										[
											{
												data: "Data"
											}
										]
									],
							columns: [],
							data: {
								columnContext: mask.ColumnContext
							},
							headerColumnBegin: 2,
							disableMovingForRowSuperiorTo: 0,
							disableMovingForColumnInferiorTo: 2,
							disableResizingForColumnInferiorTo: 3,
							disableResizingForRowInferiorTo: 3,
							autoSizeAfterCol: 1,
							toolbarEnable: false,
//							toolbarSelect: false,
							toolbarEditable: false,
							readOnly: true
					});
					
	spreadSheetLines = $("#spreadsheetLines").spreadSheet({
						lines: [
								],
							columns: [
										[
											{
												data: "Title",
												isEditable: true
											}
										],
										[
											{
												data: "Data"
											}
										],
										[
											{
												data: "Formule",
												isEditable: true,
												isStarting: false
											}
										],
										[
											{
												data: "Formule2",
												isEditable: true,
												isStarting: false
											}
										]
							],
							colspan: [
								          ["2", "3", [["green"]], "Retrieve"],
								          ["3", "4", [["blue"]], "Capture"]
							],
							data: {
								rowContext: mask.RowContext
							},
							headerRowBegin: 3,
							disableMovingForColumnSuperiorTo: 0,
							disableMovingForRowInferiorTo: 3,
							disableResizingForColumnInferiorTo: 2,
							disableResizingForRowInferiorTo: 3,
							autoSizeAfterCol: 1,
							toolbarEnable: false,
//							toolbarSelect: false,
							toolbarEditable: false,
							readOnly: true
					});
});