$.event.props.push('dataTransfer');

document.ondragover = function(e) {
    e = e || window.event;
    var x = e.pageX,
        y = e.pageY;
    
    if(e.event != undefined)
		e = e.event;
	
//	console.log(e);
	var calculContainer = $(".calculContainer");
	
	if(calculContainer.hasClass("scrolling"))
		return;
	
	if(e.pageX >= calculContainer.offset().left && e.pageX <= calculContainer.offset().left + calculContainer.outerWidth() &&
			e.pageY >= calculContainer.offset().top && e.pageY <= calculContainer.offset().top + 50)
	{
		if(calculContainer.scrollTop() > 0)
		{
			calculContainer.addClass("scrolling");
			calculContainer.animate({
				scrollTop: "-=20" 
			}, 'fast');
			
			setTimeout(function()
			{
				calculContainer.removeClass("scrolling");
				
			    var event = new CustomEvent("dragover", { "event": e });

			    document.dispatchEvent(event);
				
//				$(document).trigger("dragover", [e]);
			}, 700);
		}
	}
}

$(document).on({
    dragover: function(e)
    {
    	if($(this).hasClass("calculHeader")) var key = "calcul";
    	else var key = "script";
    	
    	if(typeof localStorage == 'undefined' || 
    			(localStorage.getItem(key) == null || $(this).parents(".listContainer").first().find("[name='" + localStorage.getItem(key) + "']").length))
    		return;
    	
        e.preventDefault();
        
        e.dataTransfer.dropEffect = 'copy';
    },
    dragenter: function(e)
    {
    	if($(this).hasClass("calculHeader")) var key = "calcul";
    	else var key = "script";
    	
    	if(typeof localStorage == 'undefined' || 
    			(localStorage.getItem(key) == null || $(this).parents(".listContainer").first().find("[name='" + localStorage.getItem(key) + "']").length))
    		return;

    	$(this).addClass("elementOver");
    },
    dragleave: function(e)
    {
    	if($(this).hasClass("calculHeader")) var key = "calcul";
    	else var key = "script";
    	
    	if(typeof localStorage == 'undefined' || 
    			(localStorage.getItem(key) == null || $(this).parents(".listContainer").first().find("[name='" + localStorage.getItem(key) + "']").length))
    		return;
    		
    	$(this).removeClass("elementOver");
    },
    drop: function(e)
    {
    	if($(this).hasClass("calculHeader")) var key = "calcul";
    	else var key = "script";
    	
    	if(typeof localStorage == 'undefined' || 
    			(localStorage.getItem(key) == null || $(this).parents(".listContainer").first().find("[name='" + localStorage.getItem(key) + "']").length))
    		return;
    	
    	$(".lastDrop").removeClass("lastDrop");
    	$(this).addClass("lastDrop");

    	$(this).removeClass("elementOver");
    	
    	e.preventDefault();
    	
    	console.log($(e.target));
    	var target = $(e.target);
    	
    	var contextMenu = $(".contextMenuOnDrop");
		var mainContainer = $(".container-fluid");
		
		contextMenu.show();
		
		contextMenu.css({
			display: "block",
			left: target.offset().left - parseInt(mainContainer.css("marginLeft")),
			top: target.offset().top - parseInt(mainContainer.css("marginTop"))
		});
    },
    dragend: function()
    {
    	$(this).removeClass("elementOver");
    }
}, ".headerElement");



$(document).on({
				    dragover: function(e)
				    {
				    	if(typeof localStorage == 'undefined' || (localStorage.getItem('isOrderedScript') === "true")
				    			|| localStorage.getItem('calcul') != null)
				    		return;
				    	
				        e.preventDefault();
				        
				        e.dataTransfer.dropEffect = 'copy';
				    },
				    dragenter: function(e)
				    {
				    	if(typeof localStorage == 'undefined' || (localStorage.getItem('isOrderedScript') === "true")
				    			|| localStorage.getItem('calcul') != null)
				    		return;

				    	$(this).addClass("elementOver");
				    },
				    dragleave: function(e)
				    {
				    	if(typeof localStorage == 'undefined' || (localStorage.getItem('isOrderedScript') === "true") 
				    			|| localStorage.getItem('calcul') != null)
				    		return;
				    		
				    	$(this).removeClass("elementOver");
				    },
				    drop: function(e)
				    {
				    	if(typeof localStorage == 'undefined' || (localStorage.getItem('isOrderedScript') === "true") 
				    			|| localStorage.getItem('calcul') != null)
				    		return;
				    		
				    	$(".lastDrop").removeClass("lastDrop");
				    	$(this).addClass("lastDrop");

				    	$(this).removeClass("elementOver");
				    	
				    	e.preventDefault();
				    	var u = utility();
				    	
				    	console.log($(e.target));
				    	
				    	var target = $(e.target);
				    					    	
				    	var scriptData = localStorage.getItem('script');
				    	var scriptId = scriptData.split("script_")[1];
				    	var calculId = target.attr('name').split("calcul_")[1];
				    	
				    	var parentTarget = target.parents(".listContainer").first();
				    	if(parentTarget.find("[name=" + scriptData + "]").length)
				    	{
				        	u.notify({
				        		pckg: "calcul",
				        		key: "scriptAlreadyAddedToCalcul",
				        		type: "error"
				        	});
				        	
				        	return;
				    	}
				    	
						$.ajax(jQuery.extend(true, {
							url: 'addScriptToCalcul',
					        type: 'POST',
					        dataType: 'json',
					        data: {
					        	calculId: calculId,
					        	scriptId: scriptId
					        },
					        success: function (data)
					        {
					        	console.log(data);
					        	
					        	var script = JSON.parse(data.object);
					        	
					        	var calculHeader = target.parents(".listContainer").first().find(".listContainer").first();
					        	
					        	var newScript = $(scriptTemplate).appendTo(calculHeader);
					        	var treeViewElement = newScript.find(".treeViewElement");
					        	treeViewElement.text(script.Script.Name);
					        	treeViewElement.attr('name', 'script_' + script.Script.Id);
					        	treeViewElement.attr('data-orderedScript', script.Id);
					        	treeViewElement.css("margin-left", "10px");
					        	treeViewElement.attr('draggable', true);
					        	
					        	updateLists();
					        	
					        	if(data.success)
						        	u.notify({
						        		pckg: "script",
						        		key: "scriptAddedToCalcul",
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
				    },
				    dragend: function()
				    {
				    	$(this).removeClass("elementOver");
				    }
}, "[name^='calcul_']");


$(document).on({
    dragover: function(e)
    {
    	var parentCalculId = $(this).parents(".listContainer").eq(1).find("[name^='calcul_']").attr("name").split("_")[1];
    	
    	if(typeof localStorage == 'undefined' || 
    			(!(localStorage.getItem('isOrderedScript') === "true") || $(this).attr('name') == localStorage.getItem('script')) || 
    			localStorage.getItem('calculParent') != parentCalculId)
    		return;
    		
        e.preventDefault();
        
        e.dataTransfer.dropEffect = 'copy';
    },
    dragenter: function(e)
    {
    	var parentCalculId = $(this).parents(".listContainer").eq(1).find("[name^='calcul_']").attr("name").split("_")[1];
    	
    	if(typeof localStorage == 'undefined' || 
    			(!(localStorage.getItem('isOrderedScript') === "true") || $(this).attr('name') == localStorage.getItem('script')) || 
    			localStorage.getItem('calculParent') != parentCalculId)
    		return;
    	
    	var target = $(e.target).parent("div");
    	var elementDropped = $("[data-orderedScript][name='" + localStorage.getItem('script') + "']").parent("div");
    	
    	console.log(target);
    	console.log(elementDropped);
    	
    	if(target.index() < elementDropped.index())
    		$(this).addClass("orderedScriptElementOverBefore");
    	else
    		$(this).addClass("orderedScriptElementOverAfter");
    },
    dragleave: function(e)
    {
    	var parentCalculId = $(this).parents(".listContainer").eq(1).find("[name^='calcul_']").attr("name").split("_")[1];
    	
    	if(typeof localStorage == 'undefined' || 
    			!(localStorage.getItem('isOrderedScript') === "true") || $(this).attr('name') == localStorage.getItem('script') || 
    			localStorage.getItem('calculParent') != parentCalculId)
    		return;
    		
    	$(this).removeClass("orderedScriptElementOverBefore orderedScriptElementOverAfter");
    },
    drop: function(e)
    {
    	var parentCalculId = $(this).parents(".listContainer").eq(1).find("[name^='calcul_']").attr("name").split("_")[1];
    	
    	if(typeof localStorage == 'undefined' || 
    			!(localStorage.getItem('isOrderedScript') === "true") || $(this).attr('name') == localStorage.getItem('script') || 
    			localStorage.getItem('calculParent') != parentCalculId)
    		return;
    	
    	$(".lastDrop").removeClass("lastDrop");
    	$(this).addClass("lastDrop");
    	
    	$(this).removeClass("orderedScriptElementOverBefore orderedScriptElementOverAfter");
    	
    	e.preventDefault();
    	var u = utility();
    	
    	console.log($(e.target));

    	var scriptData = localStorage.getItem('script');
    	var scriptId = scriptData.split("script_")[1];

    	var target = $(e.target).parent("div");
    	var elementDropped = $("[data-orderedScript][name='" + scriptData + "']").parent("div");
    	var elementDroppedClone = elementDropped.clone();
    	if(target.index() < elementDropped.index())
    		elementDroppedClone.insertBefore(target);
    	else
    		elementDroppedClone.insertAfter(target);
    	elementDropped.remove();
    	
    	var calculContainer = target.parents(".listContainer").first().parents(".listContainer").first();
    	var calcul = calculContainer.find("span[name^='calcul_']");
    	var calculId = calcul.attr('name').split("calcul_")[1];
    	
    	var scriptIds = [];
    	var orderedScriptsContainer = target.parents(".listContainer").first();
    	orderedScriptsContainer.find("span[data-orderedScript]").each(function()
    	{
    		scriptIds.push($(this).attr("data-orderedScript"));
    	});
    	
		$.ajax(jQuery.extend(true, {
			url: 'script/updateScriptPosition',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	calculId: calculId,
	        	scriptIds: scriptIds
	        },
	        success: function (data)
	        {
	        	console.log(data);
	        	
	        	updateListStyle();
	        	
	        	if(data.success)
		        	u.notify({
		        		pckg: "script",
		        		key: "scriptPlacementModified",
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
    },
    dragend: function()
    {
    	$(this).removeClass("orderedScriptElementOverBefore orderedScriptElementOverAfter");
    }
}, "[data-orderedScript]");


$(document).on({
					dragstart: function(e)
					{
						e.dataTransfer.setData("text/plain", "Dummy data for ff -_-");	//	DO NOT REMOVE THIS LINE, OTHERWISE FF DEAD
						
						if(typeof localStorage != 'undefined')
						{
							localStorage.removeItem('calcul');
							localStorage.removeItem('calculParent');
							localStorage.setItem('script', $(this).attr('name'));
							localStorage.setItem('isOrderedScript', ($(this).attr('data-orderedScript') != undefined));
							
							if($(this).attr('data-orderedScript') != undefined)
								localStorage.setItem('calculParent', $(this).parents(".listContainer").eq(1).find("[name^='calcul_']").attr("name").split("_")[1]);
						}
				        e.dataTransfer.dropEffect = "copy";
				        
				        $(".lastDragStart").removeClass("lastDragStart");
				        $(this).addClass("lastDragStart");
				    }
}, "[name^='script_']");

$(document).on({
					dragstart: function(e)
					{
						e.dataTransfer.setData("text/plain", "Dummy data for ff -_-");	//	DO NOT REMOVE THIS LINE, OTHERWISE FF DEAD
						
						if(typeof localStorage != 'undefined')
						{
							localStorage.removeItem('calculParent');
							localStorage.removeItem('script');
							localStorage.setItem('calcul', $(this).attr('name'));
						}
						
				        e.dataTransfer.dropEffect = "copy";
				        
				        $(".lastDragStart").removeClass("lastDragStart");
				        $(this).addClass("lastDragStart");
				    }
}, "[name^='calcul_']");