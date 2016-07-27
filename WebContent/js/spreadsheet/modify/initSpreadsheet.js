
var url;
$(document).ready(function() {
	url = "modifyMask?id=" + mask.Id;
});



$("#btnSaveMask").click(function(e)
{
//	if(!grids.length)
//		maker.saveMask();
//	else
//	{
//		var modal = $("#myModal");
//		var modalGridContainer = modal.find(".gridElementContainer");
//		modalGridContainer.empty();
//
//		for(var i = 0; i < grids.length; i++)
//		{
//			var gridElement = $(gridElementTemplate).appendTo(modalGridContainer);
//			
//			gridElement.find(".gridName").text(grids[i].Name);
//			gridElement.find(".modifiedMaskCheckbox").attr('id', grids[i].Id);
//		}
//		
//		$(".modifiedMaskCheckbox").trigger("change");
//	}

	$(".overwriteMask").prop('checked', false);
	
	if(grids.length)
	{
		$(".overwrite").hide();
//		$(".overwriteMask").attr('disabled', true);
		$(".modifiedMaskNameContainer").show();
		
		var modal = $("#myModal");
		var modalGridContainer = modal.find(".gridElementContainer");
		modalGridContainer.empty();

		for(var i = 0; i < grids.length; i++)
		{
			var gridElement = $(gridElementTemplate).appendTo(modalGridContainer);
			
			gridElement.find(".gridName").text(grids[i].Name);
			gridElement.find(".modifiedMaskCheckbox").attr('id', grids[i].Id);
		}
		
		$(".modifiedMaskCheckbox").trigger("change");
	}
	else
	{
		$(".gridSelectionContainer").hide();
	}
});

$(".saveMask").click(function()
{
	if(($(".modifiedMaskCheckbox:checked").length != $(".modifiedMaskCheckbox").length && $(".dropMask").is(":checked")))
	{
		alert("Some grids are bind to this mask. Please remove them first.");
		return false;
	}
	
	if($("#modifiedMaskName:visible").length && $("#modifiedMaskName:visible").val() == "")
	{
		alert("Please enter a mask name.");
		return false;
	}
	
	maker.saveMask();

});

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
		
		if(!grids.length || $(".modifiedMaskCheckbox:checked").length == $(".modifiedMaskCheckbox").length)
			$(".dropMask").attr('disabled', true);
	}
});

$(document).on("initDimensions", function(event)
{
	console.log('onInit');
	if(typeof mask !== "undefined")
		initDimensions();
});

$(document).on("dimensionsSet", function(event)
{
	spreadSheetColumns.autocomplete({
		Variables: maker.getVariablesPerDimension(),
		Members: maker.getMembersPerDimension()
	});
	spreadSheetLines.autocomplete({
		Variables: maker.getVariablesPerDimension(),
		Members: maker.getMembersPerDimension()
	});});

function initDimensions()
{
	console.log('initDimensions');
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
			console.log(element + 'elt');
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
							autocomplete: maker.getVariablesPerDimension(),
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
								rowContext: mask.RowContext
							},
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