$(document).on("multiselectSelection", function(e, object)
{
	console.log(object);
	
	if(!object.object.parents(".multiSelectContainer").parent().hasClass("tab-pane"))
		return;
	
	var variableName = object.object.find(".elementValue").text();
	var tbody = object.object.parents(".multiSelectContainer").parent().find("tbody");
	
	if(!object.isSelected)
	{
		tbody.find(".variableName").filter(function()
		{
			return $(this).text() == variableName;
		})
		.parents("tr").first()
		.remove();
	}
	else if(object.isNewlySelected)
	{
		var tabId = object.object.parents(".tab-pane").attr('id');
		var dimension = $(".dimensionTab li a[href='#" + tabId + "']").text();
		
		var newVariableLine = $(tableVariableLine);
		
		newVariableLine.find(".variableName").text(variableName);
		
		var variableParameter;
		for(var i = 0;i < currentCalcul.VariableParameters.length; i++)
		{
			var tmpVariableParameter = currentCalcul.VariableParameters[i];
			if(variableName == tmpVariableParameter.Variable && tmpVariableParameter.Dimension.Name == dimension)
			{
				variableParameter = tmpVariableParameter;
				break;
			}
		}
		console.log(dimension);
		console.log(variableParameter);
		
		/*	SELECTION	*/
		var dimensionInfos = dimensionsData[dimension];
		
		if(variableParameter != undefined)
		{
			var gens = variableParameter.Gens.split(",");
			var levels = variableParameter.Levels.split(",");
		}
		
		var select = $("<select>");
		select.append("<option data-link='1' data-toLink='2' data-toLinkSelect='false' class='all' " + ($.inArray("all", levels) != -1 ? "data-toBeClicked='true'" : "") + "'>All levels</option>");
		select.append("<option data-link='2' data-toLink='1' data-toLinkSelect='false' class='alo' " + ($.inArray("alo", levels) != -1 ? "data-toBeClicked='true'" : "") + "'>Agregated levels only</option>");
		if(dimensionInfos != undefined)
		{					
			for(var i = 0; i < dimensionInfos[0]; i++)
				select.append("<option class='level " + ($.inArray(i.toString(), levels) != -1 ? "selected" : "") + "' data-toLink='1 " + (i > 0 ? "2" : "") + "'>Level " + i + "</option>");
	
			for(var i = 2; i <= dimensionInfos[1]; i++)
				select.append("<option class='generation " + ($.inArray(i.toString(), gens) != -1 ? "selected" : "") + "'>Gén. " + i + "</option>");
		}
		console.log(select);
		newVariableLine.find(".selections").html(select);
		newVariableLine.find(".selections select").multiSelect({
			placeholder: "Select gen/lvl here!"
		});
		
		/*	UDAS	*/
		if(variableParameter != undefined)
			newVariableLine.find(".udas").val(variableParameter.UDAs);
		
		
		console.log(newVariableLine);
		tbody.append(newVariableLine);
	}
});

var currentCalcul;
$(document).on("click", "[name^='calcul_']", function(e)
{
	e.stopPropagation();
	
	var calcul = $(this);
	
	$(".selected").removeClass("selected");
	$(this).addClass("selected");
	
	var className = $(this).attr('name');
	var id = className.split("_")[1];
	
	$.ajax(jQuery.extend(true, {
		url: 'getCalcul',
        type: 'GET',
        dataType: 'json',
        data: {
        	id: id
        },
        success: function (data)
        {
        	console.log(data);
        	
        	currentCalcul = JSON.parse(data.object);
        	
        	console.log(currentCalcul);
        	
        	var cubeData = calcul.parents(".topNode").find("span").first().text().split("\\.");
        	var variables = JSON.parse(localStorage.getItem('variablesPerDimension'));
        	console.log(variables);
        	
        	var liDimensionContainer = $(".dimensionTab");
        	var divDimensionContainer = $(".dimensionTabContent");
        	
        	liDimensionContainer.empty();
        	divDimensionContainer.empty();
        	
			for(var j = 0; j < currentCalcul.Cube.Dimensions.length; j++)
			{
				var dimension = currentCalcul.Cube.Dimensions[j];
				
				if(dimension.Name == "Formule")
					continue;
				
				console.log(dimension);
				
				/*	DIMENSION NAME	*/
				var newLiTab = $(liTabTemplate);
				if(j == 0)
					newLiTab.addClass("active");
				var liTabLink = newLiTab.find("a");
				liTabLink.attr('href', "#" + dimension.Name.replace(/ /g, ''));
				liTabLink.attr('aria-controls', dimension.Name.replace(/ /g, ''));
				liTabLink.text(dimension.Name);
				
				var newDivTab = $(divTabTemplate);
				if(j == 0)
					newDivTab.addClass("in active");
				newDivTab.attr("id", dimension.Name.replace(/ /g, ''));
				
				/*	VARIABLES	*/
				var select = $("<select>");
				if(variables[dimension.Name] != undefined)
				{
					for(var i = 0; i < variables[dimension.Name].length; i++)
					{
						var variablePresentRetrieve = false;
						var variablePresentSaisie = false;
						var isSimpleValueRetrieve = false;
						var isSimpleValueSaisie = false;
						for(var k = 0; k < currentCalcul.VariableParameters.length; k++)
						{
							var currentVariable = currentCalcul.VariableParameters[k];
							
							if("%" + variables[dimension.Name][i].name + "_R%" == currentVariable.Variable)
							{
								variablePresentRetrieve = true;
								isSimpleValueRetrieve = currentVariable.IsSimpleValue;
								break;
							}
							
							if("%" + variables[dimension.Name][i].name + "_S%" == currentVariable.Variable)
							{
								variablePresentSaisie = true;
								isSimpleValueSaisie = currentVariable.IsSimpleValue;
								break;
							}
						}
						
						select.append("<option " + (variablePresentRetrieve ? "data-toBeClicked='true'" : "") + " class='" + (variablePresentRetrieve ? "selected " + (isSimpleValueRetrieve ? "simpleValue" : "multipleValue") : "") + "'>%" + variables[dimension.Name][i].name + "_R%</option>" +
										"<option " + (variablePresentSaisie ? "data-toBeClicked='true'" : "") + " class='" + (variablePresentSaisie ? "selected " + (isSimpleValueSaisie ? "simpleValue" : "multipleValue") : "") + "'>%" + variables[dimension.Name][i].name + "_S%</option>");
					}
				}
				newDivTab.append(select);
				
				var newTable = $(tableVariable);
				newDivTab.append(newTable);
				
				liDimensionContainer.append(newLiTab);
				divDimensionContainer.append(newDivTab);
				
				newDivTab.find("select").multiSelect({
					placeholder: "Select variables here!",
					isMultipleState : true
				});
			}
        	
			$("#calculName").html(calcul.parents(".topNode").first().find("span").first().text() + " - <b>" + currentCalcul.Name + "</b>");
			
        	$(".nothingSelected").hide();
        	$(".scriptEditionContainer").hide();
        	$(".calculEditionContainer").show();
        }
	}, baseAjaxObject));
});
$(document).on("keydown", ".udas", function()
{
	var input = $(this);
	$(".autocompleting").removeClass("autocompleting");
	input.addClass("autocompleting");
	
	setTimeout(function()
	{
		buildAutoComplete(input, $(".autocompleteContainer"), allUDAs, null, null, undefined, true);
	}, 200);
});
$(document).on("click", ".autocompleteElement", function(e)
{
	var lastIndexOfComma = $(".autocompleting").val().lastIndexOf(";");
	
	var basicString = $(".autocompleting").val().substring(0, lastIndexOfComma + 1);
	
	$(".autocompleting").val(basicString + " " + $(this).text() + "; ");
	
	$(".autocompleting").blur(); // Webkit wake-up hack
	$(".autocompleting").focus();
});


$(document).on("click", ".closePopupTreeContainer", function(e)
{
	$(".popUpTreeContainer").hide();
});
$(document).on("click", ".preview", function(e)
{
	var tabPane = $(this).parents(".tab-pane");
	
	var parentLine = $(this).parents("tr");
	var variableName = parentLine.find(".variableName").text();
	
	var members = JSON.parse(localStorage.getItem('membersPerDimension'));
	
	var dimension = $(".dimensionTab li.active a").text();
	var multiselectElement = tabPane.children(".multiSelectContainer").find(".multiSelectElement").filter(function()
							{
								return $(this).find(".elementValue").text() == variableName;
							});
	
	var levels = "";
	var gens = "";
	var elementContainer = parentLine.find(".selections").find(".elementContainer");
	elementContainer.children(".multiSelectElement").each(function()
	{
		if(!$(this).find(".checkBox").hasClass("selected"))
			return;
		
		if($(this).hasClass("level"))
			levels += $(this).find(".elementValue").text().split(" ")[1] + ",";
		else if($(this).hasClass("generation"))
			gens += $(this).find(".elementValue").text().split(" ")[1] + ",";
	});
	if(levels.indexOf(",") != -1)
		levels = levels.substring(0, levels.length - 1);
	if(gens.indexOf(",") != -1)
		gens = gens.substring(0, gens.length - 1);

	var udas = parentLine.find(".udas").val();
	
	if(multiselectElement.find(".checkBox").hasClass("simpleValue"))
		$(".treeContainer").addClass("simpleValue");
	else
		$(".treeContainer").removeClass("simpleValue");
	
	buildTree($(".treeContainer"), members, dimension, levels, gens, udas);
	
	e.stopPropagation();
	
	$(".popUpTreeContainer").show();
});









$("#saveCalculParameter").click(function()
{
	var variableParameters = [];
	$(".tableCalculParameter").each(function()
	{
		var tabPane = $(this).parents(".tab-pane");
		var dimension = $(".dimensionTab li a[href='#" + tabPane.attr('id') + "']").text();
		
		$(this).find("tbody tr").each(function()
		{
			var line = $(this);
			
			var levels = "";
			var gens = "";
			var elementContainer = line.find(".selections").find(".elementContainer");
			elementContainer.children(".multiSelectElement").each(function()
			{
				if(!$(this).find(".checkBox").hasClass("selected"))
					return;
				
				if($(this).hasClass("all"))
					levels += "all,";
				else if($(this).hasClass("alo"))
					levels += "alo,";
				else if($(this).hasClass("level"))
					levels += $(this).find(".elementValue").text().split(" ")[1] + ",";
				else if($(this).hasClass("generation"))
					gens += $(this).find(".elementValue").text().split(" ")[1] + ",";
			});
			if(levels.indexOf(",") != -1)
				levels = levels.substring(0, levels.length - 1);
			if(gens.indexOf(",") != -1)
				gens = gens.substring(0, gens.length - 1);
	
			var udas = line.find(".udas").val().trim();
			
			var variable = line.find(".variableName").text();
			
			var multiselectElement = tabPane.children(".multiSelectContainer").find(".multiSelectElement").filter(function()
												{
													return $(this).find(".elementValue").text() == variable;
												});
			
			
			variableParameters.push({
				isSimpleValue: multiselectElement.find(".checkBox").hasClass("simpleValue"),
				levels: levels,
				gens: gens,
				udas: udas,
				variable: variable,
				dimension: dimension
			});
		});
	});
	
	console.log(variableParameters);
	
	var calculId = $(".selected").attr('name').split("calcul_")[1];
	$.ajax(jQuery.extend(true, {
		url: 'createCalculParameter',
        type: 'POST',
        dataType: 'json',
        data: {
        	id: calculId,
        	data: JSON.stringify(variableParameters)
        },
        success: function (data)
        {
        	console.log(data);
        	
        	var u = utility();
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "calcul",
	        		key: "calculParameterSaved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        	
        	if(data.warning)
	        	u.notify({
	        		pckg: "calcul",
	        		key: "calculParameterSomeEmpty",
	        		type: "warning"
	        	});
        }
	}, baseAjaxObject));
});