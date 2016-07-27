$(document).on("click", "[name^='script_']", function(e)
{
	e.stopPropagation();
	
	var element = $(this);
	
	var treeViewElementParent = $(this).parent(".treeViewElement");
	treeViewElementParent.trigger('click');
	
	$(".selected").removeClass("selected");
	$(this).addClass("selected");
	
	var className = $(this).attr('name');
	var id = className.split("_")[1];
	
	$.ajax(jQuery.extend(true, {
		url: 'script/getScript',
        type: 'GET',
        dataType: 'json',
        data: {
        	id: id
        },
        success: function (data)
        {
        	console.log(data);
        	
        	if(data == null)
        		return;
        	
        	$(".nothingSelected").hide();
        	$(".calculEditionContainer").hide();
        	$(".scriptEditionContainer").show();
        	
        	$("#textAreaScript").val(data.Content);
        	
        	console.log(element.parents(".topNode").first());
        	
        	$("#scriptName").html(element.parents(".topNode").first().find("span").first().text() + " - <b>" + data.Name + "</b>");
        }
	}, baseAjaxObject));
});


$(document).on("click", "#saveScript", function(e)
{
	e.stopPropagation();
	
	var className = $(".selected").attr('name');
	var id = className.split("_")[1];
	
	$.ajax(jQuery.extend(true, {
		url: 'script/saveScript',
        type: 'POST',
        dataType: 'json',
        data: {
        	id: id,
        	name: $(".selected").text(),
        	content: $("#textAreaScript").val()
        },
        success: function (data)
        {
        	console.log(data);
        	
        	var u = utility();
        	
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


$(document).on("click", "#testScript", function(e)
{
	e.stopPropagation();
	
	var className = $(".selected").attr('name');
	var id = className.split("_")[1];
	
	$.ajax(jQuery.extend(true, {
		url: 'script/testScript',
        type: 'POST',
        dataType: 'json',
        data: {
        	content: $("#textAreaScript").val()
        },
        success: function (data)
        {
        	console.log(data);
        	
        	var u = utility();
        	
        	if(data.success)
	        	u.notify({
	        		pckg: "script",
	        		key: "scriptTested",
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

$("#textAreaScript").on(
{
	click: function(e)
	{
		e.stopPropagation();
		
		selectionStart = $("#textAreaScript").prop("selectionStart");
		
		var subString = $("#textAreaScript").val().substring(0, selectionStart);
		
		var nbOfPercent = subString.split("%").length - 1;
		
		if(nbOfPercent % 2 == 1)
		{
			selectionStart = subString.lastIndexOf("%") + 1;
			console.log(selectionStart);
			
			buildAutoComplete($("#textAreaScript"), $(".autocompleteContainer"), JSON.parse(localStorage.getItem('variablesPerDimension')), null, null, true);
		}
	},
	keydown: function(e)
	{
		if(e.keyCode == 9)		// PRESSING TAB KEY
		{
			e.preventDefault();
			
			var textareaVal = $("#textAreaScript").val();
			var caretIndex = $("#textAreaScript").prop('selectionStart');
			
			var newValue = textareaVal.substring(0, caretIndex) + "\t" + textareaVal.substring(caretIndex);
			
			$("#textAreaScript").val(newValue);
			
			$("#textAreaScript").prop('selectionStart', caretIndex + 1);
			$("#textAreaScript").prop('selectionEnd', caretIndex + 1);
			return;
		}
		
		setTimeout(function()
		{
			console.log(e.keyCode);
			
			if(e.which == 165)	// % TYPED
			{
				var subString = $("#textAreaScript").val().substring(0, selectionStart);
				
				var nbOfPercent = subString.split("%").length - 1 + 1;
				
				if(nbOfPercent % 2 == 0)
				{
					isAutocompleting = false;
					
					$(document).trigger("click");
					
					return;
				}
				
				if(!isAutocompleting)
				{
					selectionStart = $("#textAreaScript").prop("selectionStart");
					
					$(this).addClass("autocompleteOn");
					
					isAutocompleting = true;
				}
			}
			
			if(isAutocompleting)
				buildAutoComplete($("#textAreaScript"), $(".autocompleteContainer"), JSON.parse(localStorage.getItem('variablesPerDimension')), null, null, true);
		}, 100);
	}
});
$(document).click(function()
{
	$(".autocompleteContainerParent").find(".autocompleteContainer").hide();
	
	$(".autocompleteOn").removeClass("autocompleteOn");
	
	isAutocompleting = false;
});
$(document).on({
	click: function()
	{
		var autocompleteElement = $(this);
		
		$(".autocompleteOn").val($(".autocompleteOn").val() + autocompleteElement.text());
		$(".autocompleteOn").focus();
		
		autocompleteElement.parents(".autocompleteContainer").empty()
															.hide();
		
		isAutocompleting = false;
	},
	mouseover: function()
	{
		$(this).addClass("ui-state-focus");
	},
	mouseout: function()
	{
		$(this).removeClass("ui-state-focus");
	}
}, ".autocompleteContainerParent .autocompleteContainer li:not(.autocompleteHeader)");