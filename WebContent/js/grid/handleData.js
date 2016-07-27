$(document).ready(function()
{

	var u = utility();

	$(".saveScenarioParameters").click(function()
	{
		var data = [];
		var element;
		var u = utility();
		var hasNotified = false;
		
		$("input[name^='scenario_']").each(function()
		{
			element = $(this);
			var name = $(this).attr('name').split(/_/g);
			

//			if($(this).val() == "" && !hasNotified)
//			{
//            	u.notify({
//            		message		: "Some of the scenario parameters are empty! Fill them!",
//            		shouldGet	: false,
//            		type		: "error"
//            	});
//            	
//            	hasNotified = true;
//            	
////            	return false;
//			}
			
			console.log(element.parents(".scenarioElementContainer"));
			console.log(element.parents(".scenarioElementContainer").first().attr('id'));

			
			var scenarioData = {
				value: $(this).val(),
				id: $(this).parents(".scenarioElementContainer").attr('id'),
				type: name[2],
				elementId: name[1]//name[2]
			};
			
			console.log(scenarioData);
			
			data.push(scenarioData);
		});
		
//		if(!data.length)
//			return;
		
		$.ajax({
	        url: 'updateScenarioParameters',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	data: JSON.stringify(data),
	        	id: grid.Id
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
	            {
	            	u.notify({
	            		message		: data.success,
	            		shouldGet	: false,
	            		type		: "success"
	            	});
	            	

	            	accessToolbar.toolbar.displayScenarioParameters(false);

	            	if(data.id)
	            		element.parents(".scenarioElementContainer").attr('id', data.id);

	            	data.ids = JSON.parse(data.ids);
	            	
	            	console.log(data.ids);
	            	
	            	if(data.ids != undefined)
	            	{
	            		$(".scenarioElementContainer").each(function(index)
	            		{
	            			$(this).attr('id', data.ids[index]);
	            		});
	            	}
//	            		element.parents(".scenarioElementContainer").attr('id', data.id);
	            	
//	            	console.log(element.parents(".scenarioElementContainer").attr('id'));

	            }
	            else if(data.error)
	            	u.notify({
	            		message		: data.error,
	            		shouldGet	: false,
	            		type		: "error"
	            	});
	            
	            if(data.warning)
	            	u.notify({
	            		message		: data.warning,
	            		shouldGet	: false,
	            		type		: "warning"
	            	});
	        }
	    });
	});
	
	$("#performRetrieve").click(function()
	{
		console.log("gierjogie rgjepior")
		
			

		$.ajax({
	        url: 'getGridValues',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	id: grid.Id
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
	            
	            var u = utility();
	            
	            if(data.success)
	            {
	            	u.notify({
	            		message		: data.success,
	            		shouldGet	: false,
	            		type		: "success"
	            	});
	            	
	            	var data = JSON.parse(data.gridValues);
		            
	            	console.log('data '+data);
	            	try {
	            		for(var i = 0; i < data.length; i++)
		    			for(var j = 0; j < data[j].length; j++)
		    				if(data[i][j] == "#Missing")
		    					data[i][j] = 0;
	            	} catch(e) {
	            		console.log(e);
	            	}
		        	
	            	
		        	
		        	
	            	spreadSheet.updateData({
	            		data: data
	            	});
	            	spreadSheet.placeData();
	            	
	            	$(document).trigger("updateFormula");
	            }
	            else if(data.error)
	            {
	        		$("input[name^='scenario_']").each(function()
    				{
	        			if($(this).val() == "")
	        			{
	        				data.error = "Some Scenario parameteres are empty! Fill them!";
	        				accessToolbar.toolbar.displayScenarioParameters(true);
	        				return false;
	        			}
    				});
	        		

	            	u.notify({
	            		message		: data.error,
	            		shouldGet	: false,
	            		type		: "error"
	            	});
	            }
	        },
	        error : function (xhr, textStatus, err) {
	        	u.notify({
	        		message : err,
	        		type : "error",
	        		shouldGet : false
	        	});
	        }
	    });
	});
	
	$("#performLockSend").click(function()
	{
		var data = spreadSheet.getData();
		var rowContext = [];
		var columnContext = [];
		var headerContext = [];
		
		for(var i = 0; i < mask.RowContext.length; i++)
			rowContext.push(mask.RowContext[i].Id);
		for(var i = 0; i < mask.ColumnContext.length; i++)
			columnContext.push(mask.ColumnContext[i].Id);
		for(var i = 0; i < mask.HeaderContext.length; i++)
			headerContext.push(mask.HeaderContext[i].Id);
		
		console.log(grid.Id);
		
		$.ajax({
	        url: 'updateGridValues',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	rowContext: JSON.stringify(rowContext),
	        	columnContext: JSON.stringify(columnContext),
	        	headerContext: JSON.stringify(headerContext),
	        	data: JSON.stringify(data),
	        	id: grid.Id,
	        	gridComment : $('#gridComment').val()
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
	            
	            var u = utility();
	            
	            if(data.success){

	            	accessToolbar.toolbar.displayScenarioParameters(false); // voir délire pop up popante

	            	u.notify({
	            		message		: data.success,
	            		shouldGet	: false,
	            		type		: "success"
	            	});
	            } else if(data.error)
	            	u.notify({
	            		message		: data.error,
	            		shouldGet	: false,
	            		type		: "error"
	            	});
	        }
	    });
	});
	
	$("#saveGridStyle").click(function()
	{
		var data = spreadSheet.getDataGridStyles();
		
		console.log(grid.Id);
		
		$.ajax({
	        url: 'updateGridStyle',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	data: JSON.stringify(data),
	        	id: grid.Id
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
	            
	            var u = utility();
	            
	            if(data.success){

	            	accessToolbar.toolbar.displayScenarioParameters(false); // voir délire pop up popante

	            	u.notify({
	            		message		: data.success,
	            		shouldGet	: false,
	            		type		: "success"
	            	});
	            } else if(data.error)
	            	u.notify({
	            		message		: data.error,
	            		shouldGet	: false,
	            		type		: "error"
	            	});
	        }
	    });
	});
});