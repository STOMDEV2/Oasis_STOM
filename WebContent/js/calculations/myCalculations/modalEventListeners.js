///////////////////////////////////////////////////////////////////////////////////
//////////////				SUMMARY							///////////////////////
///////////////////////////////////////////////////////////////////////////////////
//////////////	
//////////////	Just Ctrl + F the selectors to go to the handler !
//////////////	
//////////////	Create Calcul handler		: ".saveCalcul"
//////////////	Remove Calcul handler		: ".removeCalcul"
//////////////	Rename calcul				: ".updateCalculName"
//////////////	
//////////////	Save script content			: ".saveScript"
//////////////	Remove Script				: ".removeScript"
//////////////	Remove script from calcul	: ".removeScriptFromCalcul"
//////////////	Rename script				: ".updateScriptName"
//////////////	
//////////////	Duplicate item				: ".duplicateItem"
//////////////	Move item					: ".moveItem"
//////////////	

$(".saveCalcul").click(function()
{
	var button = $(this);
	var u = utility();
	
	var cubeId = $(".contextMenuSelected").parents(".topNode").find("span").first().attr('name');
	
	$.ajax(jQuery.extend(true, {
		url: 'createCalcul',
        type: 'POST',
        dataType: 'json',
        data: {
        	name: $("#calculName").val(),
        	cubeId: cubeId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data.object)
        	{
	        	var calcul = JSON.parse(data.object);
	        	
	        	var calculHeader = $(".calculHeader.contextMenuSelected").parents(".listContainer").first();
	        	
	        	var newCalcul = $(calculTemplate).appendTo(calculHeader);
	        	var treeViewElement = newCalcul.find(".treeViewElement");
	        	treeViewElement.text(calcul.Name);
	        	treeViewElement.attr('name', 'calcul_' + calcul.Id);
	        	treeViewElement.attr('draggable', true);
	        	
	        	updateLists();
	        	
	        	button.parents(".modal").modal('hide');
        	}
	        	
        	if(data.success)
	        	u.notify({
	        		pckg: "calcul",
	        		key: "calculSaved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".removeCalcul").click(function()
{
	var calculId = $(".contextMenuSelected").attr('name').split("calcul_")[1];
	var button = $(this);
	var u = utility();
	
	$.ajax(jQuery.extend(true, {
		url: 'removeCalcul',
        type: 'POST',
        dataType: 'json',
        data: {
        	id: calculId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	$(".contextMenuSelected").parents(".listContainer").first().remove();
        	
        	updateLists();
        	
        	button.parents(".modal").modal('hide');
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "calcul",
	        		key: "calculRemoved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".updateCalculName").click(function()
{
	var calculId = $(".contextMenuSelected").attr('name').split("calcul_")[1];
	var button = $(this);
	var u = utility();
	
	$.ajax(jQuery.extend(true, {
		url: 'modifyCalcul',
        type: 'POST',
        dataType: 'json',
        data: {
        	id: calculId,
        	name: $("#newCalculName").val()
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data.object)
        	{
	        	var calcul = JSON.parse(data.object);
	        	$(".contextMenuSelected").text(calcul.Name);
	        	
	        	button.parents(".modal").modal('hide');
        	}
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "calcul",
	        		key: "calculModified",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".saveScript").click(function()
{
	var button = $(this);
	var u = utility()
	
	var cubeId = $(".contextMenuSelected").parents(".topNode").find("span").first().attr('name');
	
	$.ajax(jQuery.extend(true, {
		url: 'script/createScript',
        type: 'POST',
        dataType: 'json',
        data: {
        	name: $("#scriptNameInput").val(),
        	cubeId: cubeId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data.object)
        	{
	        	var script = JSON.parse(data.object);
	        	
	        	var scriptHeader = $(".scriptHeader.contextMenuSelected").parents(".listContainer").first().children(".listContainer").first();
	        	
	        	var newScript = $(scriptTemplate).appendTo(scriptHeader);
	        	var treeViewElement = newScript.find(".treeViewElement");
	        	treeViewElement.first().text(script.Name);
	        	treeViewElement.first().attr('name', 'script_' + script.Id);
	        	treeViewElement.css("margin-left", "10px");
	        	treeViewElement.attr("draggable", true);
	        	
	        	updateLists();
	        	
	        	button.parents(".modal").modal('hide');
        	}
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "script",
	        		key: "scriptSaved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".removeScript").click(function()
{
	var scriptAttr = $(".contextMenuSelected").attr('name');
	var scriptId = scriptAttr.split("script_")[1];
	var button = $(this);
	var u = utility();
	
	$.ajax(jQuery.extend(true, {
		url: 'script/removeScript',
        type: 'POST',
        dataType: 'json',
        data: {
        	id: scriptId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	$("[name='" + scriptAttr + "']").parent("div").remove();
        	
        	updateLists();
        	
        	button.parents(".modal").modal('hide');
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "script",
	        		key: "scriptRemoved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".removeScriptFromCalcul").click(function()
{
	var scriptId = $(".contextMenuSelected").attr('name').split("script_")[1];
	var orderedScriptId = $(".contextMenuSelected").attr('data-orderedScript');
	var calculId = $(".contextMenuSelected").parents(".listContainer").first().parents(".listContainer").first().find("[name^='calcul_']").attr("name").split("calcul_")[1];
	var button = $(this);
	var u = utility();
	
	$.ajax(jQuery.extend(true, {
		url: 'removeScriptFromCalcul',
        type: 'POST',
        dataType: 'json',
        data: {
        	calculId: calculId,
        	scriptId: scriptId,
        	orderedScript: orderedScriptId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	$(".contextMenuSelected").parent("div").remove();
        	
        	updateLists();
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "script",
	        		key: "scriptRemoved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".updateScriptName").click(function()
{
	var scriptAttr = $(".contextMenuSelected").attr('name');
	var scriptId = scriptAttr.split("script_")[1];
	var button = $(this);
	var u = utility();
	
	$.ajax(jQuery.extend(true, {
		url: 'script/modifyScript',
        type: 'POST',
        dataType: 'json',
        data: {
        	id: scriptId,
        	name: $("#newScriptName").val()
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data.object)
        	{
	        	var calcul = JSON.parse(data.object);
	        	
	        	$("[name='" + scriptAttr + "']").text(calcul.Name);
	        	
	        	button.parents(".modal").modal('hide');
        	}
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "script",
	        		key: "scriptModified",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".duplicateItem").click(function()
{
	var scriptId = $(".lastDragStart").attr('name').split("script_")[1];
	var calculId = $(".lastDragStart").attr('name').split("calcul_")[1];
	var lastDrop = $(".lastDrop");
	console.log(lastDrop);
	var cubeId = lastDrop.parents(".topNode").find("span").first().attr('name');
	var u = utility();
	
	console.log(scriptId + " " + calculId + " " + cubeId);
	
	$.ajax(jQuery.extend(true, {
		url: 'duplicateItem',
        type: 'POST',
        dataType: 'json',
        data: {
        	calculId: calculId,
        	scriptId: scriptId,
        	cubeId: cubeId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data.object)
        	{
	        	var object = JSON.parse(data.object);
	        	
	        	if(data.type == "calcul")
	        		var duplicata = $(".lastDragStart").parents(".listContainer").first().clone();
	        	else
	        		var duplicata = $(".lastDragStart").parent("div").clone();
	        	
	        	if(data.type == "calcul")
	        		var duplicataTarget = lastDrop.parents(".listContainer").first();
	        	else
	        		var duplicataTarget = lastDrop.parents(".listContainer").first().find(".listContainer").first();
	        	
	        	console.log(object);
	        	console.log(duplicata);
	        	var clonedObject = duplicata.appendTo(duplicataTarget);
	        	console.log(clonedObject);
	        	clonedObject.find("span").attr('name', data.type + "_" + object.Id);
	        	clonedObject.find(".selected").removeClass("selected");
	        	clonedObject.find(".contextMenuSelected").removeClass("contextMenuSelected");
	        	
	        	if(data.type == "calcul")
	        	{
	        		clonedObject.find(".listContainer").children("div").each(function(index)
	        		{
	        			$(this).find("span").attr('name', "script_" + object.OrderedScripts[index].Script.Id);
	        			$(this).find("span").attr('data-orderedScript', object.OrderedScripts[index].Id);
	        		});
	        		
	        		var scripts = clonedObject.find(".listContainer").children("div").clone();
	        		scripts.find("span").removeAttr("data-orderedScript");
	        		
	        		scripts.each(function()
	        		{
	        			var container = lastDrop.parents(".topNode").first().find(".scriptHeader").parents(".listContainer").first().find(".listContainer").first();
	        			console.log(container);
	        			container.append($(this));
	        		});
//	        		lastDrop.parents("topNode").first().find(".scriptHeader").parents(".listContainer").first().find(".listContainer").first().append(scripts);
	        	}
	        	
	        	updateLists();
        	}
        	
        	if(data.success)
	        	u.notify({
	        		pckg: data.type,
	        		key: data.type + "Duplicated",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});


$(".moveItem").click(function(e)
{
	var scriptId = $(".lastDragStart").attr('name').split("script_")[1];
	var calculId = $(".lastDragStart").attr('name').split("calcul_")[1];
	var lastDrop = $(".lastDrop");
	var lastDragStart = $(".lastDragStart");
	console.log($(".lastDragStart"));
	console.log(lastDrop);
	var cubeId = lastDrop.parents(".topNode").find("span").first().attr('name');
	var u = utility();
	
	if($("[name^='" + lastDragStart.attr("name") + "']").length > 1)
	{
		var u = utility();
    	u.notify({
    		message: "You can't move a script bound to a calcul!",
    		shouldGet: false,
    		type: "error"
    	});
    	
    	e.preventDefault();
    	return;
	}
	
	$.ajax(jQuery.extend(true, {
		url: 'moveItem',
        type: 'POST',
        dataType: 'json',
        data: {
        	calculId: calculId,
        	scriptId: scriptId,
        	cubeId: cubeId
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data.object)
        	{
        		var object = JSON.parse(data.object);
        	
	        	if(data.type == "calcul")
	        		var duplicata = lastDragStart.parents(".listContainer").first().clone();
	        	else
	        		var duplicata = lastDragStart.parent("div").clone();
	        	
	        	if(data.type == "calcul")
	        		var duplicataTarget = lastDrop.parents(".listContainer").first();
	        	else
	        		var duplicataTarget = lastDrop.parents(".listContainer").first().find(".listContainer").first();
	        	
	        	console.log(duplicata);
	        	console.log(duplicataTarget);
	        	
	        	var clonedObject = duplicata.appendTo(duplicataTarget);
	        	
	        	if(data.type == "calcul")
	        	{
	        		console.log(lastDragStart);
	        		lastDragStart.parents(".listContainer").first().remove();
	        		
	        		clonedObject.find(".listContainer").children("div").each(function(index)
	        		{
	        			$(this).find("span").attr('name', "script_" + object.OrderedScripts[index].Script.Id);
	        			$(this).find("span").attr('data-orderedScript', object.OrderedScripts[index].Id);
	        		});
	        		
	        		var scripts = clonedObject.find(".listContainer").children("div").clone();
	        		scripts.find("span").removeAttr("data-orderedScript");
	        		
	        		scripts.each(function()
	        		{
	        			var container = lastDrop.parents(".topNode").first().find(".scriptHeader").parents(".listContainer").first().find(".listContainer").first();
	        			console.log(container);
	        			container.append($(this));
	        		});
//	        		lastDrop.parents("topNode").first().find(".scriptHeader").parents(".listContainer").first().find(".listContainer").first().append(scripts);
	        	}
	        	else
	        		lastDragStart.parent("div").remove();
	        	
	        	updateLists();
        	}
        	
        	if(data.success)
	        	u.notify({
	        		pckg: data.type,
	        		key: data.type + "Moved",
	        		type: "success"
	        	});
        	else if(data.error)
	        	u.notify({
	        		message: data.error,
	        		shouldGet: false,
	        		type: "error"
	        	});
        }
	}, baseAjaxObject));
});