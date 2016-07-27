




$(document).on("change", ".modifiedMaskCheckbox", function()
{
	if($(".modifiedMaskCheckbox:checked").length == $(".modifiedMaskCheckbox").length)
	{
		$(".overwrite").show();
		
		$(".dropMask").attr('disabled', false);
	}
	else
	{
		$(".overwrite").hide();
		
		$(".dropMask").attr('disabled', true);
	}
});

$(document).on("change", ".overwriteMask", function()
{
	if(!$(this).is(":checked"))
	{
		$(".modifiedMaskNameContainer").show();
		
		$(".dropMask").attr('disabled', false);
	}
	else
	{
		$(".modifiedMaskNameContainer").hide();
		
		if($(".modifiedMaskCheckbox:checked").length == $(".modifiedMaskCheckbox").length) //!grids.length || pourquoi/comment refaire
			$(".dropMask").attr('disabled', true);
	}
});


$(document).on("dimensionsSet", function(event)
{
	/*spreadSheetColumns.autocomplete({
		Variables: maker.getVariablesPerDimension(),
		Members: maker.getMembersPerDimension()
	});
	spreadSheetLines.autocomplete({
		Variables: maker.getVariablesPerDimension(),
		Members: maker.getMembersPerDimension()
	});});*/
//trouver mieux
	spreadSheetColumns.autocomplete({
		Variables: JSON.parse(localStorage.getItem('variablesPerDimension')),
		Members: JSON.parse(localStorage.getItem('membersPerDimension'))
	});

	spreadSheetLines.autocomplete({
		Variables: JSON.parse(localStorage.getItem('variablesPerDimension')),
		Members: JSON.parse(localStorage.getItem('membersPerDimension'))
	});

});


function initDimensions()
{
	console.log('bio');
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
			console.log(element + ' elt')
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
	console.log('maker ' + maker);
	
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
							columns: [
							],
							data: {
								
							},
//							autocomplete: {
//								Variables: maker.getVariablesPerDimension(),
//								Members: maker.getMembersPerDimension()
//							},
							headerColumnBegin: 2,
							disableMovingForRowSuperiorTo: 0,
							disableMovingForColumnInferiorTo: 2,
							disableResizingForColumnInferiorTo: 3,
							disableResizingForRowInferiorTo: 3,
							autoSizeAfterCol: 1,
							toolbarTools: {
								toolbarFill: true,
								toolbarFontColor: true,
								toolbarAlignLeft: true,
								toolbarAlignCenter: true,
								toolbarAlignRight: true,
								toolbarAlignJustify: true,
								toolbarBold: true,
								toolbarUnderline: true,
								toolbarItalic: true,
								toolbarBorderLeft: true,
								toolbarBorderTop: false,
								toolbarBorderRight: true,
								toolbarBorderBottom: false,
								toolbarBorderTopBottom: false,
								toolbarBorderLeftRight: true
							}
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
									
								},
								/*autocomplete: JSON.parse(localStorage.getItem('variablesPerDimension')),maker.getVariablesPerDimension()*/
								headerRowBegin: 3,
								disableMovingForColumnSuperiorTo: 0,
								disableMovingForRowInferiorTo: 3,
								disableResizingForColumnInferiorTo: 2,
								disableResizingForRowInferiorTo: 3,
								autoSizeAfterCol: 2,
								toolbarTools: {
									toolbarFill: true,
									toolbarFontColor: true,
									toolbarAlignLeft: true,
									toolbarAlignCenter: true,
									toolbarAlignRight: true,
									toolbarAlignJustify: true,
									toolbarBold: true,
									toolbarUnderline: true,
									toolbarItalic: true,
									toolbarBorderLeft: false,
									toolbarBorderTop: true,
									toolbarBorderRight: false,
									toolbarBorderBottom: true,
									toolbarBorderTopBottom: true,
									toolbarBorderLeftRight: false
								}
						});
});
