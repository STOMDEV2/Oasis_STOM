var INPUT_NAME = "scenario_";
var elementTemplate = "<div class='scenarioElementContainer form-group'>" +
							"<label></label>" +
							"<input type='text' class='form-control easyCapture scenarioParametersCapture' " +
															"style='width: auto; display: inline;'/>&nbsp;&nbsp;" +
							"<i style='position: absolute;' class='fa fa-question-circle fa-2x'></i>" + 
						"</div>";

$(document).on("click", function()
{
	$(".spreadSheet").hide();
});

$(".container").on({
						mouseover: function()
						{
							$(this).css({
								"color": "blue",
								"cursor": "pointer"
							});
						},
						mouseleave: function()
						{
							$(this).css({
								"color": "black",
								"cursor": "default"
							});
						}
					}, ".fa");

$(".container").on("click", ".fa", function(e)
{
	e.stopPropagation();
	
	var input = $(this).parents(".scenarioElementContainer").find("input");
	
	console.log(input);
	
	var inputName = input.attr('name');
	
	console.log(inputName);
	
	
	$(".spreadSheet").empty();
	
	
	if(inputName.indexOf("columns") > -1)
	{
		var id = inputName.split(/_/g)[2];
		
		console.log(id);
		
		var context;
		
		loop:
			for(var i = 0; i < mask.ColumnContext.length; i++)
			{
				var columnContext = mask.ColumnContext[i];
				
				for(var j = 0; j < columnContext.ColumnsDimensions.length; j++)
				{
					var columnDimension = columnContext.ColumnsDimensions[j];
					
					if(columnDimension.Id == id)
					{
						context = columnContext;
						break loop;
					}
				}
			}
		
		var lines = [
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
					];
		for(var i = 0; i < context.ColumnsDimensions.length; i++)
		{
			var columnDimension = context.ColumnsDimensions[i];
			
			lines.push([{
				data: columnDimension.Dimension.Name
			}]);
		}
		
		var data = {
			columnContext: [context]
		};
		
		console.log(lines);
		
		$(".spreadSheet").show();
		
		var spreadSheet = $(".spreadSheet").spreadSheet({
				lines: lines,
				columns: [
				],
				data: data,
				toolbarEnable: false,
				toolbarSelect: false,
				toolbarEditable: false,
				autoSizeAfterCol: 1
		});
		
		spreadSheet.placeData();
		spreadSheet.underlineVariables();
		
		$(".spreadSheet").css({
			"left": $(this).position().left,
			"top": $(this).position().top
		})
	}
	else if(inputName.indexOf("rows") > -1)
	{
		
	}
});

function getVariableFromValue(value)
{

	var variablesPerDimension = JSON.parse(localStorage.getItem('variablesPerDimension'));

	for(var key in variablesPerDimension)
	{
		if(variablesPerDimension.hasOwnProperty(key))
		{
			var obj = variablesPerDimension[key];
			
			for(var i = 0; i < obj.length; i++)
			{
				var variable = obj[i];
				
				if(getVariableRetrieveName(variable.name) == value || getVariableCaptureName(variable.name) == value)
					return variable;
			}
		}
	}
}

function displayEmptyFields( mask ) 
{
	console.log("GJERPIO GJEEPRIJ GPIERJP GJERGH JPZERGJPO");
	
	var retrieveContainer = $(".parametersScenarioContainer .retrieve .SCContainer");
	retrieveContainer.empty();
	var captureContainer = $(".parametersScenarioContainer .capture .SCContainer");
	captureContainer.empty();

	if(mask == null )
		return;
	
	var alreadyUsedVariables = [];

	for(var i=0,  cpt = mask.HeaderContext.length; i < cpt; i++) {

		var headerDimension = mask.HeaderContext[i];

		if(headerDimension.Value.indexOf("%") === 0 && $.inArray(headerDimension.Value, alreadyUsedVariables) ) {
			alreadyUsedVariables.push(headerDimension.Value);

			var variable = getVariableFromValue(headerDimension.Value);

			if(variable == undefined) {
				var u = utility();
					
				u.notify({
					parameters  : [headerDimension.Value],
					type        : 'error',
					key			: "variableUndefined",
					pckg		: "variable"
				});
				continue;
			}
			
			var dimension = headerDimension.Dimension.Name;
				
			var element = $(elementTemplate).appendTo(headerDimension.Retrieve ? retrieveContainer : captureContainer);
				
			element.find("label").text(dimension);
			element.find("input").attr('name', INPUT_NAME + variable.id + "_" + headerDimension.Value)
								 .attr('data-hd',i);
				
			/*if(typeof grid != 'undefined'){
				for(var k = 0; k < grid.ScenarioParameters.length; k++) {
					var scenarioParameter = grid.ScenarioParameters[k];
						
					console.log(scenarioParameter.Variable.Name + " " + headerDimension.GridElement.Value);
						
					if((getVariableRetrieveName(scenarioParameter.Variable.Name) == headerDimension.GridElement.Value && scenarioParameter.IsRetrieve)
							|| (getVariableCaptureName(scenarioParameter.Variable.Name) == headerDimension.GridElement.Value && !scenarioParameter.IsRetrieve))
					{
						element.find("input").val(scenarioParameter.Value);
						element.attr('id', scenarioParameter.Id);
							
						break;
					}
				}
			}*/
		}
	}
	
	for(var i = 0; i < mask.ColumnContext.length; i++)
	{
		var columnContext = mask.ColumnContext[i];
		
		for(var j = 0; j < columnContext.ColumnsDimensions.length; j++)
		{
			var columnDimension = columnContext.ColumnsDimensions[j];
			
			console.log(columnDimension);
			
			if(columnDimension.GridElement.Value.indexOf("%") == 0 && $.inArray(columnDimension.GridElement.Value, alreadyUsedVariables))
			{
				alreadyUsedVariables.push(columnDimension.GridElement.Value);
				
				var variable = getVariableFromValue(columnDimension.GridElement.Value);
				if(variable == undefined)
				{
					var u = utility();
					
					u.notify({
						parameters  : [columnDimension.GridElement.Value],
						type        : 'error',
						key			: "variableUndefined",
						pckg		: "variable"
					});
					continue;
				}
				var dimension = columnDimension.Dimension.Name;
				
				var element = $(elementTemplate).appendTo(columnContext.Type.Value == "Retrieve" ? retrieveContainer : captureContainer);
				
				element.find("label").text(dimension/* + " (" + columnDimension.GridElement.Value + "): "*/);
				element.find("input").attr('name', INPUT_NAME + variable.id + "_" + columnContext.Type.Value)
									 .attr('data-cc',i)
									 .attr('data-cd',j);
				
				if(typeof grid != 'undefined')
				{
					for(var k = 0; k < grid.ScenarioParameters.length; k++)
					{
						var scenarioParameter = grid.ScenarioParameters[k];
						
						console.log(scenarioParameter.Variable.Name + " " + columnDimension.GridElement.Value);
						
						if((getVariableRetrieveName(scenarioParameter.Variable.Name) == columnDimension.GridElement.Value && scenarioParameter.IsRetrieve)
								|| (getVariableCaptureName(scenarioParameter.Variable.Name) == columnDimension.GridElement.Value && !scenarioParameter.IsRetrieve))
						{
							element.find("input").val(scenarioParameter.Value);
							element.attr('id', scenarioParameter.Id);
							
							break;
						}
					}
				}
			}
		}
	}
	
	for(var i = 0; i < mask.RowContext.length; i++)
	{
		var rowContext = mask.RowContext[i];
		
		for(var j = 0; j < rowContext.RowDimensions.length; j++)
		{
			var rowDimension = rowContext.RowDimensions[j];
			
			if(rowDimension.GridElement.Value.indexOf("%") == 0 && $.inArray(rowDimension.GridElement.Value, alreadyUsedVariables))
			{
				alreadyUsedVariables.push(rowDimension.GridElement.Value);

				var variable = getVariableFromValue(rowDimension.GridElement.Value);
				if(variable == undefined)
				{
					var u = utility();
					
					u.notify({
						parameters  : [columnDimension.GridElement.Value],
						type        : 'error',
						key			: "variableUndefined",
						pckg		: "variable"
					});
					continue;
				}
				var dimension = rowDimension.Dimension.Name;
				
				var element = $(elementTemplate).appendTo(rowDimension.Type == "Retrieve" ? retrieveContainer : captureContainer);
				
				element.find("label").text(dimension/* + " (" + rowDimension.GridElement.Value + "): "*/);
				element.find("input").attr('name', INPUT_NAME + variable.id + "_" + rowDimension.Type)
									 .attr('data-rc',i)
									 .attr('data-rd',j);
				
				
				if(typeof grid != 'undefined')
				{
					for(var k = 0; k < grid.ScenarioParameters.length; k++)
					{
						var scenarioParameter = grid.ScenarioParameters[k];
						
						if((getVariableRetrieveName(scenarioParameter.Variable.Name) == rowDimension.GridElement.Value && scenarioParameter.IsRetrieve)
								|| (getVariableCaptureName(scenarioParameter.Variable.Name) == rowDimension.GridElement.Value && !scenarioParameter.IsRetrieve))
						{
							element.find("input").val(scenarioParameter.Value);
							element.attr('id', scenarioParameter.Id);
						}
					}
				}
			}
		}
	}
}