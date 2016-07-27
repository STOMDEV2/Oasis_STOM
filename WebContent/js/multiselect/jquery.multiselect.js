(function ( $ ) {
	
	const multiSelectContainer = "<div class='multiSelectContainer'>" +
										"<div class='summaryMultiSelect'>" +
											"<span class='summary'>" +
											"</span>" +
											
											"<span class='arrow'>" +
												"<i class='fa fa-arrow-down'></i>" +
											"</span>" +
										"</div>" +
										
										"<div class='elementContainer'>" +
										"</div>" +
									"</div>";
	
	const multiSelectElement =	"<div class='multiSelectElement'>" +
									"<span class='checkBox'>" +
										"<i></i>" +
									"</span>"+
	
									"<span class='elementValue'>" +
									"</span>" +
								"</div>";
	
	$(document).click(function(e)
	{
		if(!$(e.target).parents(".multiSelectContainer").length)
			$(".multiSelectOpened").removeClass("multiSelectOpened").hide();
	});
	
	$.fn.multiSelect = function(options) {
		
		var element = $(this);
//		var parent = element.parent();
		var elem = this;
		
		var settings = $.extend(
		{
			placeholder: "",
			isMultipleState : false
		}, options);
		
		initialize();
		
		function initialize()
		{
			var newMultiSelect = $(multiSelectContainer);
			newMultiSelect.find(".summary").text(settings.placeholder);
			
			element.find("option").each(function()
			{
				var newMultiSelectelement = $(multiSelectElement);
				
				var dataLink = $(this).attr('data-link');
				var dataToLink = $(this).attr('data-toLink');
				var dataToLinkSelect = $(this).attr('data-toLinkSelect');
				var dataToBeClicked = $(this).attr('data-toBeClicked');
				if(dataLink != undefined)
					newMultiSelectelement.find(".checkBox").attr('data-link', dataLink);
				if(dataToLink != undefined)
					newMultiSelectelement.find(".checkBox").attr('data-toLink', dataToLink);
				if(dataToLinkSelect != undefined)
					newMultiSelectelement.find(".checkBox").attr('data-toLinkSelect', dataToLinkSelect);
				
				newMultiSelectelement.addClass($(this).attr('class'));
				if($(this).hasClass("selected") && dataToBeClicked == undefined)
					newMultiSelectelement.find(".checkBox").addClass("selected");
				if($(this).hasClass("simpleValue"))
					newMultiSelectelement.find(".checkBox").addClass("simpleValue");
				if($(this).hasClass("multipleValue"))
					newMultiSelectelement.find(".checkBox").addClass("multipleValue");
				newMultiSelectelement.find(".elementValue").text($(this).text());
				
				newMultiSelect.find(".elementContainer").append(newMultiSelectelement);
				
				console.log("DATATOBECLICKED: " + dataToBeClicked);
				if(dataToBeClicked)
//				{
					newMultiSelectelement.attr('data-toBeClicked', true);
//					newMultiSelectelement.trigger("click");
//					console.log(newMultiSelectelement);
//				}
			});
			
			newMultiSelect.insertAfter(element);
//			parent.append(newMultiSelect);
			
			element.hide();
			
			element = newMultiSelect;
			
			initListeners();
			
			element.find("[data-toBeClicked]").trigger('click');
			
			updateSummaryLabel();
		}
		
		function initListeners()
		{
			element.on("click", ".summaryMultiSelect", function(e)
			{
				$(".elementContainer").hide();
				
				if(!element.find(".elementContainer").hasClass("multiSelectOpened"))
					element.find(".elementContainer").addClass("multiSelectOpened").show();
				else
					element.find(".elementContainer").removeClass("multiSelectOpened").hide();
				
				e.stopPropagation();
			});
			
			element.on("click", ".multiSelectElement", function(e)
			{
				var checkBox = $(this).find(".checkBox");
				
				if($(this).hasClass("disabled"))
					return;
				
				if(!checkBox.hasClass("selected"))
				{
					checkBox.addClass("selected simpleValue");
				}
				else if(checkBox.hasClass("simpleValue"))
				{
					checkBox.removeClass("simpleValue");
					
					if(settings.isMultipleState)
						checkBox.addClass("multipleValue");
					else
						checkBox.removeClass("selected");
				}
				else if(checkBox.hasClass("multipleValue") && settings.isMultipleState)
				{
					checkBox.removeClass("multipleValue selected");
				}
				else if(checkBox.hasClass("selected"))
				{
					checkBox.removeClass("selected");
				}
				
				var linkAttr = checkBox.attr('data-link');
				if(linkAttr != undefined)
					if(checkBox.hasClass("selected"))
						element.find("[data-toLink]").filter(function()
						{
							var dataLink = $(this).attr('data-toLink').split(" ");
							
							return $.inArray(linkAttr, dataLink) != -1;
						})
						.each(function()
						{
							var dataLinkSelect = $(this).attr('data-toLinkSelect');
							
							if(dataLinkSelect == undefined || dataLinkSelect == true)
								$(this).addClass("selected");
							
							$(this).parent().addClass("greyed disabled");
						});
					else
						element.find("[data-toLink]").filter(function()
						{
							var dataLink = $(this).attr('data-toLink').split(" ");
							var dataLinkSelect = $(this).attr('data-toLinkSelect');
							
							return $.inArray(linkAttr, dataLink) != -1;
						})
						.removeClass("selected").parent().removeClass("greyed disabled");
				
				updateSummaryLabel();
				
				$(document).trigger("multiselectSelection", [{
					object: $(this),
					isSelected: checkBox.hasClass("selected"),
					isNewlySelected: checkBox.hasClass("simpleValue") && checkBox.hasClass("selected")
				}]);
				
				e.stopPropagation();
			});
		}
		
		function updateSummaryLabel()
		{
			var selectedElements = element.find(".checkBox.selected");
			
			if(!selectedElements.length)
				element.find(".summary").text(settings.placeholder);
			else
			{
				var newSummary = "";
				
				selectedElements.each(function()
				{
					newSummary += $(this).parents(".multiSelectElement").first().find(".elementValue").text() + ", ";
				});
				if(newSummary.indexOf(",") != -1)
					newSummary = newSummary.substring(0, newSummary.length - ", ".length);
				
				element.find(".summary").text(newSummary);
			}
		}
	};
}( jQuery ));