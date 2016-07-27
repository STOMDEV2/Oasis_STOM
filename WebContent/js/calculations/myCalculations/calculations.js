$(document).on("click", "button.collapseButton", function(e)
{
	e.stopPropagation();
	
	$(this).parents(".listContainer").first().children(".listContainer").toggleClass("collapsed");
	
	updateListStyle();
});



var allUDAs = [];
var dimensionsData = [];
$.ajax(jQuery.extend(true, {
	url: '/JavaProject/workspace/dimension/getGenerationAndNumberLevelOfDimension',
    type: 'GET',
    dataType: 'json',
    success: function (data)
    {
    	console.log(data);
    	
    	dimensionsData = JSON.parse(data.object);
    	
    	$.ajax(jQuery.extend(true, {
    		url: '/JavaProject/workspace/dimension/getAllUDAsForDimension',
    	    type: 'GET',
    	    dataType: 'json',
    	    success: function (data)
    	    {
    	    	console.log(data);
    	    	
    	    	allUDAs = JSON.parse(data.object);
    	    }
    	}, baseAjaxObject));
    }
}, baseAjaxObject));







function updateLists()
{
	updateListVisibility();
	updateListStyle();
}

function updateListVisibility()
{
	$(".collapseButton").each(function()
	{
		var parentContainer = $(this).parents(".listContainer").first().find(".listContainer").first();
		
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

















var isAutocompleting = false;
var selectionStart = 0;
$(document).ready(function()
{
	$(".autocompleteContainerParent").append(autocompleteTemplate);
	
	

	
	$(".well").each(function()
	{
//		console.log($(this).offset().top);
//		console.log($("body").height());
//		console.log($(".footer").height());
//		console.log(($("body").height() - $(".footer").height()) - $(this).offset().top - 10 - 90);
		
		$(this).height(($("body").height() - $(".footer").height()) - $(this).offset().top - 90);
	});
	
	updateLists();
	
	var contextMenu = $(".contextMenu");
	var contextMenuOnDrop = $(".contextMenuOnDrop");
	
	$(document).on("contextmenu", function(e)
	{
		return false;
	});
	
	$(document).on("contextmenu", ".treeViewElement:not(.noContext)", function(e)
	{
		$(this).trigger("click");
		
		var mainContainer = $(".container-fluid");
		
		contextMenu.css({
			display: "block",
			left: e.pageX - parseInt(mainContainer.css("marginLeft")),
			top: e.pageY - parseInt(mainContainer.css("marginTop"))
		});
		
		if($(this).hasClass("calculHeader"))
		{
			$(".contextItem").hide();
			
			$(".addCalcul").show();
		}
		else if($(this).hasClass("scriptHeader"))
		{
			$(".contextItem").hide();
			
			$(".addScript").show();
		}
		else if($(this).attr('name').indexOf("calcul_") > -1)
		{
			$(".addCalcul").hide();
			
			$(".scriptItem").hide();
			$(".calculItem").show();
		}
		else if($(this).attr('name').indexOf("script_") > -1)
		{
			$(".scriptItem").show();
			$(".calculItem").hide();
			
			if($(this).parent().parent(".listContainer").parent(".listContainer").find(".scriptHeader").length)
				$(".removeScriptFromCalcul").hide();
			else if($(this).parents(".listContainer").first().parents(".listContainer").first().parents(".listContainer").first().find(".calculHeader").length)
			{
				$(".addScript").hide();
				$(".renameScript").hide();
				$(".removeScriptItem").hide();
			}
		}
		
		$(".contextMenuSelected").removeClass("contextMenuSelected");
		$(this).addClass("contextMenuSelected");
		
		return false;
	});
	
	$(document).on("click", function(e)
	{
		contextMenu.hide();
		contextMenuOnDrop.hide();
		
		if(!$(e.target).parents(".popUpTreeContainer").length)
			$(".popUpTreeContainer").hide();
		
//		$(".contextMenuSelected").removeClass("contextMenuSelected");
	});	
});