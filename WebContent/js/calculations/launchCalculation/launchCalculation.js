const dimensionTemplate =	"<tr>" +
								"<td>" +
									"<span class='dimensionName'>" + 
									"</span>" + 
								"</td>" + 
								
								"<td>" +
									"<span class='variableName'>" + 
									"</span>" + 
								"</td>" + 
								
								"<td class='treeContainer'>" +
								"</td>" + 
							"</tr>";
						


$(document).on("click", "button.collapseButton", function(e)
{
	e.stopPropagation();
	
	$(this).parents(".listContainer").first().children(".listContainer").toggleClass("collapsed");
	
	updateLists();
});

function updateLists()
{
	updateListVisibility();
	updateListStyle();
}

function updateListVisibility()
{
	$(".collapseButton").each(function()
	{
		var parentContainer = $(this).parent().parent().find(".listContainer").first();
		
		if(!parentContainer.length || !parentContainer.children().length)
			$(this).css("visibility", "hidden");
		else
			$(this).css("visibility", "visible");
	});
}
function updateListStyle()
{
	$(".calculContainer").find(".listContainer").each(function()
	{
		var childrenContainer = $(this).children(".listContainer");
		
		if(childrenContainer.hasClass("collapsed"))
			$(this).find("button").first().text("+");
		else
			$(this).find("button").first().text("-");
	});
}



$(document).ready(function()
{
	$(".well").each(function()
	{		
		$(this).height(($("body").height() - $(".footer").height()) - $(this).offset().top - 90);
	});
	
	updateLists();
	
	
	
	
	
	$("[name^='calcul_']").click(function()
	{
		$(".nothingSelected").hide();
		$(".launchCalculPanel").show();
		
		var elem = $(this);
		
		var calculId = $(this).attr('name').split("calcul_")[1];
		var u = utility();
		
		$.ajax(jQuery.extend(true, {
			url: 'getCalcul',
	        type: 'GET',
	        dataType: 'json',
	        data: {
	        	id: calculId
	        },
	        success: function (data)
	        {
	        	console.log(data);
	        	
	        	elem.addClass("selected");
	        	
	        	var object = JSON.parse(data.object);
	        	
	        	console.log(object);
	        	
	        	$("#calculName").text(elem.parents(".topNode").first().find("span").first().text() + " - " + object.Name);
	        	
	        	$(".parametersContainer").empty();
	        	
        		if(object.VariableParameters.length)
        			$(".selectDimensionLabel").show();
        		else
        			$(".selectDimensionLabel").hide();
	        	
	        	var alreadyUsedDimensions = [];
	        	for(var i = 0; i < object.VariableParameters.length; i++)
	        	{
	        		var variableParameter = object.VariableParameters[i];
	        		
	        		var dimension = variableParameter.Dimension.Name;
	        		
	        		if($.inArray(dimension, alreadyUsedDimensions) == -1)
	        		{
		        		var dimensionContainer = $(dimensionTemplate);
		        		dimensionContainer.addClass("dimensionsTr");
		        		dimensionContainer.find(".dimensionName").text(dimension);
		        		
		        		alreadyUsedDimensions.push(dimension);
	        		}
	        		else
	        		{
//	        			var dimensionContainer = $(".dimensionTr").filter(function()
//	        					{
//	        						return $(this).find(".dimensionName").text() == dimension;
//	        					});
	        			
	        			var dimensionContainer = $(dimensionTemplate);
	        			dimensionContainer.find(".dimensionName").parent("td").remove();
	        		}
	        		
	        		var variable = variableParameter.Variable;
	        		var currentRowspan = dimensionContainer.find(".dimensionName").parent("td").attr('rowspan');
	        		dimensionContainer.find(".dimensionName").parent("td").attr('rowspan', (currentRowspan == undefined ? 0 : currentRowspan) + 1);
	        		
	        		var levels = variableParameter.Levels;
	        		var gens = variableParameter.Gens;
	        		var udas = variableParameter.UDAs;
	        		var members = JSON.parse(localStorage.getItem('membersPerDimension'));
//	        		for(var j = 0; j < variables.length; j++)
//	        		{
//	        			if(j >= 1)
//	        			{
//	        				dimensionContainer = $(dimensionTemplate);
//	        				dimensionContainer.find(".dimensionName").parent("td").remove();
//	        			}
	        			
//	        			var variable = variables[j].split(",");
//	        			var variableName = variable[0];
//	        			var isSimpleValue = (variable[1] === "true");
	        			
	        			dimensionContainer.find(".variableName").text(variable);
	        			
	        			var treeContainer = dimensionContainer.find(".treeContainer");
	        			if(variableParameter.IsSimpleValue)
	        				treeContainer.addClass("simpleValue");
	        			else
	        				treeContainer.addClass("multipleValue");
	        			
	        			buildTree(treeContainer, members, dimension, levels, gens, udas);
	        			
	        			$(".parametersContainer").append(dimensionContainer);
//	        		}
	        	}
	        	
	        	var treeSelectionSelect = $(".treeSelectionSelect");
	        	for(var i = 0; i < object.TreeSelections.length; i++)
	        	{
	        		var treeSelection = object.TreeSelections[i];
	        		
	        		treeSelectionSelect.append("<option value='" + treeSelection.Members + "'>" + treeSelection.Name + "</option>");
	        	}
	        	
	        	updateTreeListStyle();
	        }
		}, baseAjaxObject));
	});
	
	$("#launchCalcul").click(function()
	{
		var selection = [];
		var u = utility();
		
		var itsok = true;
		$(".parametersContainer").find("tr").each(function()
		{
			var variable = $(this).find(".variableName").text();
			
			var treeContainer = $(this).find(".treeContainer");
			
			if(!treeContainer.find(".checkBoxTreeElement.selected").length)
			{
	        	u.notify({
	        		message: "You need to select at least one member for each variable you selected!",
	        		shouldGet: false,
	        		type: "error"
	        	});
	        	
	        	itsok = false;
	        	return false;
			}
			
			var selectedMembers = [];
			treeContainer.find(".checkBoxTreeElement.selected").each(function()
			{
				var member = $(this).parent().find(".treeElement b").text();
				
				selectedMembers.push(member);
			});
			
			selection.push({
				variable: variable,
				members: selectedMembers
			})
		});
		
		if(!itsok)
			return;
		
		var calculId = $(".treeViewElement.selected").attr('name').split("_")[1];
		
		$.ajax(jQuery.extend(true, {
			url: 'launchCalcul',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	data: JSON.stringify(selection),
	        	id: calculId
	        },
	        success: function (data)
	        {
	        	console.log(data);
	        	
	        	if(data.success)
		        	u.notify({
		        		pckg: "calcul",
		        		key: "calculExecuted",
		        		type: "success"
		        	});
	        	else if(data.error)
		        	u.notify({
		        		message: data.error,
		        		type: "error",
		        		shouldGet: false
		        	});
	        }
		}, baseAjaxObject));
	});
	
	$("#saveSelection").click(function()
	{
		var selection = "";
		var u = utility();
		
		$(".parametersContainer").find(".treeContainer").each(function()
		{
			$(this).find(".checkBoxTreeElement.selected").each(function()
			{
				var member = $(this).parent().find(".treeElement b").text();
				
				selection += member + ",";
			});
		});
		
		var calculId = $(".treeViewElement.selected").attr('name').split("_")[1];
		var selectionName = $("#selectionNameInput").val();
		
		$.ajax({
			url: 'selection/saveTreeSelection',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	data: selection,
	        	name: selectionName,
	        	id: calculId
	        },
	        beforeSend: function()
	        {
	            if(typeof(busyIndicatorBeforeSend) == "function")
	                busyIndicatorBeforeSend();
	        },
	        complete: function()
	        {
	            if(typeof(busyIndicatorOnComplete) == "function")
	                busyIndicatorOnComplete();
	        },
	        success: function (data)
	        {
	        	console.log(data);
	        	
	        	if(data.success)
		        	u.notify({
		        		pckg: "calcul",
		        		key: "selectionSaved",
		        		type: "success"
		        	});
	        },
	        error:function(data,status,er)
	        {
	        	u.notify({
	        		message: er,
	        		shouldGet: false,
	        		type: "error"
	        	});
	        }
		});
	});
	
	$(document).on("change", ".treeSelectionSelect", function()
	{
		if($(this).val() == "default")
			return;
		
		var members = $(this).val().split(",");
		
		$(".treeContainer").find(".treeElement b").each(function()
		{
			var treeElementValue = $(this).text();
			
			if($.inArray(treeElementValue, members) != -1)
				$(this).parent().parent().find("i").trigger("click");
		});
		
		expandAllNodesToSelectedElements();
	});
});