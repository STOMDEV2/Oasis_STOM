var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

(function ($)
{
	const SCROLL_WIDTH = 40;
	
	/*	TEMPLATING	*/
	var spreadSheetTemplate = "<div class='spreadSheetContainer'>" +
									"<div class='line'>" +
										"<div class='SPCell header initial'>" +
											"&nbsp;" +
										"</div>" +
									"</div>" +
								"</div>";
	var toolbarTemplate = "<div id='toolbar'>" +
								"<div id='tools'>" +
								"</div>"  +
							"</div>";
	var toolbarFormula = "<div class='formulaContainer'>" +
							"<input type='text' class='form-control toolbarFormula' disabled='disabled'/>" +
						"</div>";
	var toolTemplate = "<div data-toggle='tooltip' data-placement='bottom'></div>";
	var lineTemplate = "<div class='line'></div>";
	var cellTemplate = "<div class='SPCell cell'>" +
					   "</div>";
	var headerTemplate = "<div class='SPCell header'>" +
								"&nbsp;" +
								"<div class='moveElement'>" +
								"</div>" +
							"</div>";
	var resizeTemplate = "<div class='resize'>" +
							"</div>";
	var cellSimpleValueTemplate = "<span class='black cellValue spreadSheetElement'>" +
									"</span>";
	var cellModelTemplate = "<select class='cellValue spreadSheetElement'>" +
							"</select>";
	var contextualMenu = "<div class='dropdown clearfix contextMenu'>" +
							"<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu' style='display:block;position:static;margin-bottom:5px;'>" +
								"<li><a tabindex='-1' class='removeColumn contextItem'>Remove column</a></li>" +
								"<li><a tabindex='-1' class='removeLine contextItem'>Remove row</a></li>" +
								"<li class='divider'></li>" +
								"<li><a tabindex='-1' class='insertRowBefore contextItem'>Insert row before</a></li>" +
								"<li><a tabindex='-1' class='insertRowAfter contextItem'>Insert row after</a></li>" +
								"<li class='divider'></li>" +
								"<li><a tabindex='-1' class='insertColumnBefore contextItem'>Insert column before</a></li>" +
								"<li><a tabindex='-1' class='insertColumnAfter contextItem'>Insert column after</a></li>" +
							"</ul>" +
						"</div>";
	var colors = "<div class='colorPicker-palette'>" +
						"<div class='colorPicker-swatch white' name='transparent'>&nbsp;</div>" +
						"<div class='colorPicker-swatch black' name='black'>&nbsp;</div>" +
						"<div class='colorPicker-swatch blue' name='blue'>&nbsp;</div>" +
						"<div class='colorPicker-swatch sandybrown' name='sandybrown'>&nbsp;</div>" +
						"<div class='colorPicker-swatch brown' name='brown'>&nbsp;</div>" +
						"<div class='colorPicker-swatch green' name='green'>&nbsp;</div>" +
						"<div class='colorPicker-swatch darkGreen' name='darkGreen'>&nbsp;</div>" +
						"<div class='colorPicker-swatch lawngreen' name='lawngreen'>&nbsp;</div>" +
						"<div class='colorPicker-swatch darkBlue' name='darkBlue'>&nbsp;</div>" +
						"<div class='colorPicker-swatch darkRed' name='darkRed'>&nbsp;</div>" +
						"<div class='colorPicker-swatch orange' name='orange'>&nbsp;</div>" +
						"<div class='colorPicker-swatch violet' name='violet'>&nbsp;</div>" +
						"<div class='colorPicker-swatch red' name='red'>&nbsp;</div>" +
						"<div class='colorPicker-swatch grey' name='grey'>&nbsp;</div>" +
						"<div class='colorPicker-swatch darkkhaki' name='darkkhaki'>&nbsp;</div>" +
					"</div>";
	var borders = "<div class='bordersPopup'>" +
					"<div class='borderPopupElementContainer'>" +
						"<div class='borderPopupElement' name='default' style='top: 0px;'>Default</div>" +
					"</div>" +
					"<div class='borderPopupElementContainer'>" +
						"<div class='borderPopupElement dotted' name='dotted'>&nbsp;</div>" +
					"</div>" +
					"<div class='borderPopupElementContainer'>" +
						"<div class='borderPopupElement dashed' name='dashed'>&nbsp;</div>" +
					"</div>" +
					"<div class='borderPopupElementContainer'>" +
						"<div class='borderPopupElement solidThin' name='solidThin'>&nbsp;</div>" +
					"</div>" +
					"<div class='borderPopupElementContainer'>" +
						"<div class='borderPopupElement solid' name='solid'>&nbsp;</div>" +
					"</div>" +
				"</div>";
	var borderTemplate = "<div class='spreadSheetBorder'>&nbsp;</div>";
	var selectedBorder = "<div class='selectedBorder'>" +
							"</div>";
	var cursors = "<div class='cursor downCursor'>" +
					"</div>" +
					"<div class='cursor rightCursor'>" +
					"</div>";
	var inputTemplate = "<input type='text' class='spreadsheetInput spreadSheetElement' />";
	var notStyleClasses = ["cellValue", "cell", "SPCell", "firstCell", "selectedCell", "editable",
	                       "formulaFirstCell", "formulaSelected", "tempCell", "opened",
	                       "resizing", "moving", "context", "startingContext", "created", "modified",
	                       "spreadSheetElement", "spreadSheetBorder"];
		
	var availableColors = [];
	var availableAlignments = ["left", "center", "right", "justify"];
	var availableFontStyles = ["bold", "underline", "italic"];
	var availableBorderStyle = ["dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
	var leftButtonDown = false;
	
	var instances = [];
	
	
	
	$(document).on("busyIndicatorComplete", function()
	{
		console.log(instances);
		
		for(var i = 0; i < instances.length; i++)
			instances[i].autoSize();
	});
	
	function tweakMouseMoveEvent(e)
	{
		// Check from jQuery UI for IE versions < 9
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button)
			leftButtonDown = false;
		
		// If left button is not set, set which to 0
		// This indicates no buttons pressed
		if(e.which === 1 && !leftButtonDown) e.which = 0;
	}
	
	function assignInputValuesToCell()
	{
		$(spreadSheetFocus).find(".spreadsheetInput").each(function()
		{
			var cell = $(this).parents(".cell");
			var inputValue = $(this).val();
			
			$(this).remove();
			
			console.log(spreadSheetFocus.getCellValue(cell));
			console.log(inputValue);
			
			if(spreadSheetFocus.getCellValue(cell) != inputValue)
				cell.addClass("modified");
			
			spreadSheetFocus.setCellValue(cell, inputValue);
		});
	}
	
	$(document).on({
					click: function(e)
					{
						// if(e.which != 3)
							// element.find(".cell").removeClass("selectedCell firstCell");
						
						$(".colorPicker-palette").css("display", "none");
						$(".bordersPopup").css("display", "none");
						$(".opened").removeClass("opened");
						
						$(".contextMenu").hide();
						
//						console.log(e);
						if(!$(e.target).parents(".context").first().length)
							spreadSheetFocus = undefined;
						
						assignInputValuesToCell();
					},
					mouseup: function(e)
					{
						if(e.which === 1) leftButtonDown = false;
						
						console.log("ijferiojg");
						
						isResizeClicked = false;
						
//						console.log(spreadSheetFocus);
						
						$(spreadSheetFocus).find(".resizing").removeClass("resizing");
						$(spreadSheetFocus).find(".resizingElement").removeClass("resizingElement");
						
						$(".tempCell").removeClass("tempCell");
					}
				});
	
	$(document).on("keydown", function(e)
	{
		console.log("KEYDOWN BRUH");
		
		console.log($(spreadSheetFocus));
		
		if($(spreadSheetFocus).find(".toolbarFormula").is(":focus") || spreadSheetFocus == undefined)
			return;
		
//		console.log("KEYDOWN BRUH OKAY");
		console.log(e.keyCode);
		console.log(e.ctrlKey);
		
		if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
			$(document).trigger("directionnalArrows", [e]);
		else if(e.ctrlKey)
		{
			console.log("hifjoirjfe");
			if(e.which == 67)
			{
				console.log("hiojfiojerfiejrgoiejrgio");
				$(document).trigger("copyEvent", [e]);
			}
			
			$(document).trigger("ctrlEvent", [e]);
		}
		else if(e.keyCode == 16)
		{
			if($(spreadSheetFocus).find(".spreadSheetInput").length || $(spreadSheetFocus).find(".shiftSelecting").length)
				return;
			
			$(spreadSheetFocus).find(".selectedCell").first().addClass("shiftSelecting shiftSelectingCell shiftCellSelector");
		}
		else if(e.keyCode == 9)
			$(document).trigger("tabEvent", [e]);
		else if(e.keyCode == 27)
			$(document).trigger("escape", [e]);
		else
			$(document).trigger("inputPop", [e]);
	});
	
	$(document).on("keyup", function(e)
	{
		console.log("KEYUP BRUH");
		
		console.log($(spreadSheetFocus));
		
		if($(spreadSheetFocus).find(".toolbarFormula").is(":focus") || spreadSheetFocus == undefined)
			return;
		
//		console.log("KEYDOWN BRUH OKAY");
		console.log(e.keyCode);
		console.log(e.ctrlKey);
		
		if(e.keyCode == 16)
			$(spreadSheetFocus).find(".shiftSelectingCell").removeClass("shiftCellSelector shiftSelecting shiftSelectingCell");
	});
	
	$(document).on("escape", function(event, e)
	{
		e.preventDefault();
		
		assignInputValuesToCell();
	});
	
	$(document).on("tabEvent", function(event, e)
	{
		e.preventDefault();
		
		var selectedCell = $(spreadSheetFocus).find(".selectedCell");
		
		if(!selectedCell.length)
			return;
		
		var nextCell = selectedCell.next();
		
		if(!nextCell.length)
		{
			var line = selectedCell.parents(".line");
			var nextLine = line.next();
			
			if(!nextLine.length)
				return;
			
			nextCell = nextLine.find(".cell:first");
		}
		
		nextCell.trigger("mousedown");
	});
	
	$(document).on("inputPop", function(event, e)
	{
		var selectedCell = $(spreadSheetFocus).find(".firstCell");
		
		var keydowned = String.fromCharCode(e.which);
		
		if(!selectedCell.length || !selectedCell.hasClass("editable") || selectedCell.children("input").length || keydowned == "" 
			|| e.which == 13)
			return;
		
		var input = $(inputTemplate).appendTo(selectedCell);
		
		input.focus();
//		input.val(keydowned);
		input.trigger("keydown");
	});
	
	$(document).on("ctrlEvent", function(event, e)
	{
		$(spreadSheetFocus).find("#copyPasteHandler").focus();
		$(spreadSheetFocus).find("#copyPasteHandler").select();
	});

//	function getShitfSelectingSelector(e)
//	{
//		if(e.keyCode == 37)		//	LEFT
//		{
//			if($(spreadSheetFocus).find(".shiftSelecting").index() > $(spreadSheetFocus).find(".shiftSelectingCell:first").index())
//				return ".shiftSelectingCell:first";
//			else
//				return ".shiftSelectingCell:last";
//		}
//		else if(e.keyCode == 38)		//	UP
//		{
//			if($(spreadSheetFocus).find(".shiftSelecting").parents(".line").index() > $(spreadSheetFocus).find(".shiftSelectingCell:first").parents(".line").index())
//				return ".shiftSelectingCell:first";
//			else
//				return ".shiftSelectingCell:last";
//		}
//		else if(e.keyCode == 39)		//	RIGHT
//		{
//			if($(spreadSheetFocus).find(".shiftSelecting").index() > $(spreadSheetFocus).find(".shiftSelectingCell:first").index())
//				return ".shiftSelectingCell:first";
//			else
//				return ".shiftSelectingCell:last";
//		}
//		else if(e.keyCode == 40)		//	DOWN
//		{
//			if($(spreadSheetFocus).find(".shiftSelecting").parents(".line").index() > $(spreadSheetFocus).find(".shiftSelectingCell:first").parents(".line").index())
//				return ".shiftSelectingCell:first";
//			else
//				return ".shiftSelectingCell:last";
//		}
//	}
	$(document).on("directionnalArrows", function(event, e)
	{
		console.log(spreadSheetFocus);
		console.log(e.keyCode);

		if($(spreadSheetFocus).find(".spreadsheetInput").length)
			return;
		
		var selector = ($(spreadSheetFocus).find(".shiftSelecting").length ? ".shiftCellSelector" : ".firstCell");
		
		if(selector == "")
			return;
		
		switch(e.keyCode)
	    {
	        case 37: // left
	        	if($(spreadSheetFocus).find(selector).length && $(spreadSheetFocus).find(selector).prev().length
	        			&& !$(spreadSheetFocus).find(selector).prev().hasClass("header"))
	        	{
		        	var cellToAutoSelect = $(spreadSheetFocus).find(selector).prev();
		        	$(spreadSheetFocus).find(".shiftCellSelector").removeClass("shiftCellSelector");
		        	
		        	if(!$(spreadSheetFocus).find(".shiftSelecting").length)
		        		spreadSheetFocus.autoSelect(cellToAutoSelect, true);
		        	else
		        		cellToAutoSelect.addClass("shiftCellSelector");
	        	}
	        	break;
	        case 38: // up
	        	if($(spreadSheetFocus).find(selector).length && $(spreadSheetFocus).find(selector).parents(".line").prev().length
	        			&& !$(spreadSheetFocus).find(selector).parents(".line").prev().children(".SPCell:nth-child(" + ($(spreadSheetFocus).find(selector).index() + 1) + ")").hasClass("header"))
	        	{
		        	var cellToAutoSelect = $(spreadSheetFocus).find(selector).parents(".line").prev().children(".SPCell:nth-child(" + ($(spreadSheetFocus).find(selector).index() + 1) + ")");
		        	$(spreadSheetFocus).find(".shiftCellSelector").removeClass("shiftCellSelector");

		        	if(!$(spreadSheetFocus).find(".shiftSelecting").length)
		        		spreadSheetFocus.autoSelect(cellToAutoSelect, true);
		        	else
		        		cellToAutoSelect.addClass("shiftCellSelector");
	        	}
	        	break;
	        case 39: // right
	        	if($(spreadSheetFocus).find(selector).length && $(spreadSheetFocus).find(selector).next().length)
	        	{
		        	var cellToAutoSelect = $(spreadSheetFocus).find(selector).next();
		        	$(spreadSheetFocus).find(".shiftCellSelector").removeClass("shiftCellSelector");

		        	if(!$(spreadSheetFocus).find(".shiftSelecting").length)
		        		spreadSheetFocus.autoSelect(cellToAutoSelect, true);
		        	else
		        		cellToAutoSelect.addClass("shiftCellSelector");
	        	}
	        	break;
	        case 40: // down
	        	if($(spreadSheetFocus).find(selector).length && $(spreadSheetFocus).find(selector).parents(".line").next().length)
	        	{
		        	var cellToAutoSelect = $(spreadSheetFocus).find(selector).parents(".line").next().children(".SPCell:nth-child(" + ($(spreadSheetFocus).find(selector).index() + 1) + ")");
		        	$(spreadSheetFocus).find(".shiftCellSelector").removeClass("shiftCellSelector");

		        	if(!$(spreadSheetFocus).find(".shiftSelecting").length)
		        		spreadSheetFocus.autoSelect(cellToAutoSelect, true);
		        	else
		        		cellToAutoSelect.addClass("shiftCellSelector");
	        	}
	        	break;
	        default:
        		return; // exit this handler for other keys
	    }
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	    
	    if($(spreadSheetFocus).find(".shiftSelecting").length)
	    {
	    	var firstCell = $(spreadSheetFocus).find(".shiftSelecting");
	    	var lastCell = $(spreadSheetFocus).find(".shiftCellSelector");
			
	    	if(firstCell.index() < lastCell.index() && firstCell.parents(".line").index() > lastCell.parents(".line").index())
	    	{
	    		var cellIndexDiff = lastCell.index() - firstCell.index();
	    		
	    		for(var i = 0; i < cellIndexDiff; i++)
	    		{
	    			firstCell = firstCell.next();
	    			lastCell = lastCell.prev();
	    		}
	    	}
	    	else if(firstCell.index() > lastCell.index() && firstCell.parents(".line").index() < lastCell.parents(".line").index())
	    	{
	    		var cellIndexDiff = lastCell.index() - firstCell.index();
	    		
	    		for(var i = 0; i < cellIndexDiff; i++)
	    		{
	    			firstCell = firstCell.prev();
	    			lastCell = lastCell.next();
	    		}
	    	}
	    	
	    	$(spreadSheetFocus).find(".shiftSelectingCell").removeClass("shiftSelectingCell selectedCell");
	    	
			var x = Math.min(lastCell.offset().left + lastCell.width() / 2, firstCell.offset().left + firstCell.width() / 2);
			var w = Math.abs(lastCell.offset().left + lastCell.width() / 2 - (firstCell.offset().left + firstCell.width() / 2));
			var y = Math.min(lastCell.offset().top + lastCell.height() / 2, firstCell.offset().top + firstCell.height() / 2);
			var h = Math.abs(lastCell.offset().top + lastCell.height() / 2 - (firstCell.offset().top + firstCell.height() / 2));
			
			$(spreadSheetFocus).find(".cell").each(function()
			{
				if($(this).offset().left > x + w) return;
				if($(this).offset().left + $(this).width() < x) return;
				if($(this).offset().top > y + h) return;
				if($(this).offset().top + $(this).height() < y) return;
				
				$(this).addClass("shiftSelectingCell selectedCell");
			});
	    }
	    
	    spreadSheetFocus.updateCells();
	});
	
	
	
	$(document).on("copyEvent", function()
	{
		var selectedCellIndex = [];
		console.log($(spreadSheetFocus));
		$(spreadSheetFocus).find(".selectedCell").each(function()
		{
			var cellIndex = $(this).index();
			
			console.log($(this));
			
			if ($.inArray(cellIndex, selectedCellIndex) == -1)
				selectedCellIndex.push(cellIndex);
		});
		
		console.log(selectedCellIndex);
		
		var selection = "";
		
		$(spreadSheetFocus).find(".line:gt(0)").each(function()
		{
			for(var i = 0; i < selectedCellIndex.length; i++)
			{
				var cell = $(this).children(".SPCell:nth-child(" + (selectedCellIndex[i] + 1) + ")");
				
				if(cell.hasClass("selectedCell"))
					selection += spreadSheetFocus.getCellValue(cell) + "\t";
			}
			
			if($(this).find(".selectedCell").length)	//
			{
				selection = selection.substring(0, selection.length - "\t".length);
				selection += "\n";
			}
		});
		
		selection = selection.substring(0, selection.length - "\n".length);	//
		
		console.log(selection);
		
		$(spreadSheetFocus).find("#copyPasteHandler").val(selection);
	});
	
	function checkIfObjectHasValue(elem)
	{
		var result = true;
		
		for(var key in elem)
			result |= elem[key];
		
		return result;
	}

	var spreadSheetFocus;
	
	$.fn.spreadSheet = function(options) {
	
		this.autocomplete = function(data)
		{
			settings.autocomplete = data;
			
			element.append(autocompleteTemplate);
		}
		
		this.updateCells = function()
		{
			updateCellWidth();
			updateCellBorders();
			updateColspans();
			
			updateFormula();
		}
		
		this.deselectAll = function()
		{
			element.find(".cell").removeClass("selectedCell firstCell");
			
			elem.updateCells();
		}
		
		this.getCellValue = function(cell)
		{
//			console.log(cell);
//			console.log(cell.find("input").length + " " + cell.find("input").val());
//			console.log(cell.find("span").length + " " + cell.find("span").text());
			
			if(cell.find("input").length)
				return cell.find("input").val();
			else if(cell.find("span").length)
				return cell.find("span").text();
			else
				return cell.children().first().val();
		}
		
		this.setCellValue = function(cell, value, isFormulaUpdate)
		{
			if(cell.children("span").length)
				cell.children("span").text(value);
			else if(cell.children("select").length)
				cell.find("option").filter(function()
					{
						return $(this).text() == value;
					}).prop('selected', true);
			
			if(!isFormulaUpdate)
				$(document).trigger("updateFormula");
		};
		
		function getCellByData(data)
		{
			return element.find(".cell[data-spreadsheetData='" + data + "']");
		}
		
		function getCellCoordinates(cell)
		{
			var x = elem.getCellValue(cell.parents(".line").children(":first"));
			var y = elem.getCellValue(element.find(".line:first").children(":nth-child(" + (cell.index() + 1) + ")"));

			return y + x;
		}
		
		function updateFormula()
		{
//			console.log("UPDATING FORMULA");
			
			element.find(".cell[name^='=']").each(function()
			{
//				console.log("UPDATING FFFFFFFFFFFFFORIMAULA");
				var name = $(this).attr('name');
				
				console.log(name);
				
				var currentIndex = 0;
				while(name.indexOf("%", currentIndex) != -1)
				{
					var beginIndex = name.indexOf("%", currentIndex);
					var endIndex = name.indexOf("%", beginIndex + 1);
					
//					console.log(beginIndex + " " + endIndex);
					
					var cellFormulaId = name.substring(beginIndex + 1, endIndex);
					console.log(cellFormulaId);
					
					var dataCell = getCellByData(cellFormulaId);
					console.log(dataCell);
					
					var coordinates = getCellCoordinates(dataCell);
					console.log(coordinates);
					
					name = name.replace("%" + cellFormulaId + "%", coordinates);
					
					currentIndex = endIndex;
				}
				
//				console.log(name);
				
				elem.setCellValue($(this), name);
			});
		}
		
		this.addColumn = function(options, isAfter, isStarting, shouldAnnotate, isHumanCalled)
		{
			if(isHumanCalled && settings.readOnly)
				return;

			var selectedCell = (isAfter == undefined ? element.find(".line:nth-child(2)").children(".last") : element.find(".selectedCell"));
			var index = (selectedCell.index() + (isAfter || isAfter == undefined ? 0 : -1));
			
			settings.columns.splice(index, 0, options);
			
//			console.log(settings.columns);
			
//			console.log(shouldAnnotate);
			
			var columnIndex = addColumToSpreadSheet(isAfter, isStarting, (shouldAnnotate != undefined ? shouldAnnotate : true), isHumanCalled);
			
			if(isHumanCalled)
			{
				console.log(element.find(".SPCell:nth-child(" + (columnIndex + 1) + ")"));
				
				element.find(".SPCell:nth-child(" + (columnIndex + 1) + ")").outerWidth(200);
				
//				if(element.find(".SPCell:last").width() < 40)
//				console.log(element.find(".line").find(".SPCell:last"));
//					element.find(".line").find(".SPCell:last").outerWidth(200);
			}
			
			elem.updateCells();
			
			if(!hasResized)
				elem.autoSize();
		};
		
		this.addLine = function(options, isAfter, shouldAnnotate, isHumanCalled)
		{
			if(isHumanCalled && settings.readOnly)
				return;

			var selectedLine = (isAfter == undefined ? element.find(".line:last") : element.find(".selectedCell").parents(".line"));
			var index = (selectedLine.index() + (isAfter || isAfter == undefined ? 1 : 0));
			
			settings.lines.splice(index, 0, options);
			
			addLineToSpreadSheet(isAfter, false, (shouldAnnotate != undefined ? shouldAnnotate : true), isHumanCalled);
		};
		
		this.underlineVariables = function()
		{
			element.find(".cell").each(function()
			{
//				console.log(elem.getCellValue($(this)));
				
				if(elem.getCellValue($(this)).indexOf("%") == 0)
				{
					$(this).addClass("orange");
				}
			});
		}
		
		this.getCellByCoordiantes = function(coordinates)
		{
			var x;
			var y;
			
			// console.log(coordinates);
			
			for(var i = 0; i < coordinates.length; i++)
			{
				if(!isNaN(parseInt(coordinates.substring(i, coordinates.length))))
				{
					y = coordinates.substring(i, coordinates.length);
					x = coordinates.substring(0, i);
					
					break;
				}
			}
			
			// console.log(x + " " + y);
			
			var xIndex = ($.inArray(x, letters) == -1 ? undefined : ($.inArray(x, letters) + 1 + 1 + (typeof spreadSheetLines != 'undefined' && elem == spreadSheetLines ? 0 : 1)));
			var yIndex = parseInt(y) + 1 + (settings.colspan != undefined && settings.colspan.length ? 1 : 0)
											+ (typeof spreadSheetLines == 'undefined' && typeof spreadSheetColumns == 'undefined' ? 1 : 0)
											+ (typeof spreadSheetLines != 'undefined' && elem == spreadSheetLines ? 1 : 0);
			
//			console.log(xIndex + " " + yIndex);
			
			if(isNaN(xIndex) || isNaN(yIndex))
				return undefined;
			
//			console.log("CC MA NIGGA:" + yIndex);
			
			var result = element.find(".line:nth-child(" + yIndex + ")").children(":nth-child(" + xIndex + ")").first();
			
//			console.log(result);
			
			if(result.length)
				return result;
			
			return 99999999;
		};
		
		
		
		this.getRemovedColumnsContext = function()
		{
			return removedColumnsContext;
		};
		
		this.getRemovedRowsContext = function()
		{
			return removedRowsContext;
		};
		
		this.getRemovedColumnsDimension = function()
		{
			return removedColumnsDimension;
		};
		
		this.getRemovedRowsDimension = function()
		{
			return removedRowsDimension;
		};
		
		this.autoSelect = function(cellValue, isCell)
		{
			elem.deselectAll();
			
//			console.log(cellValue);
			
			var cell;
			if(isCell)
				cell = cellValue;
			else
				cell = getCellFromValue(cellValue);
			
			cell.trigger("mousedown");
		};
		
		this.autoSize = function()
		{
//			console.log("GJEIGJREIO");
			
			var colBegin = settings.autoSizeAfterCol;
			
			for(var i = colBegin + 1; i < getMaxNbOfColumns() + 1; i++)
			{
				element.find(".SPCell:nth-child(" + (i + 1) + ")").each(function()
				{
					var line = $(this).parents(".line");
					var width = 0;
					
					line.children(".SPCell:lt(" + (colBegin + 1) + ")").each(function()
					{
//						console.log($(this));
						width += $(this).outerWidth();
					});
					
//					console.log(element.find(".spreadSheetContainer").outerWidth());
//					console.log(width);
//					console.log(getMaxNbOfColumns());
					
					var colWidth = Math.floor((element.find(".spreadSheetContainer").width() - width) / ((getMaxNbOfColumns() + 1) - (colBegin + 1)));
//					console.log(colWidth);
					
					$(this).outerWidth(colWidth);
				});
			}
			
			elem.updateCells();
		};
		
		
		
		Array.prototype.move = function(from, to)
		{
			this.splice(to, 0, this.splice(from, 1)[0]);
		};
		
		var element = $(this);
		var elem = this;
		var cellId = 0;
		var colspanId = 0;
		
		instances.push(elem);
		
		var spreadSheetType;

		var removedColumnsContext = [];
		var removedRowsContext = [];
		var removedColumnsDimension = [];
		var removedRowsDimension = [];
		
		var settings = $.extend({
			data: [ [ ["MyFirstCell", ["blue", "center"]] ] ],
			toolbarEnable: true,
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
				toolbarBorderTop: true,
				toolbarBorderRight: true,
				toolbarBorderBottom: true,
				toolbarBorderTopBottom: true,
				toolbarBorderLeftRight: true
			},
			autocomplete: undefined,
			toolbarSelect: true,
			toolbarEditable: true,
			readOnly: false
		}, options);
		
		initialize();
		
		this.attr('unselectable', 'on')
			 .css('user-select', 'none')
			 .on('selectstart', false);
		
		function initialize()
		{
			if(typeof(busyIndicatorBeforeSend) == "function")
        		busyIndicatorBeforeSend();
			
			if(settings.columns.length)
				spreadSheetType = "Columns";
			else if(settings.lines.length)
				spreadSheetType = "lines";
			
			settings.lines.splice(0, 0, [
											{
												data: "",
												type: "header"
											}
										]);
			
			placeContainers();
			initContextualMenu();

			initCopyPaste();
			
			placeContext();
			
			initListeners();
			
			if($.isEmptyObject(settings.data))
			{
				elem.autoSize();
				
            	if(typeof(busyIndicatorOnComplete) == "function")
            		busyIndicatorOnComplete();
			}
			
			console.log(settings.columns);
			console.log(settings.lines);
		}
		
		this.initHeaders = function()
		{
//			element.find(".SPCell:nth-child(1)").width(70);
//			element.find(".SPCell:nth-child(2)").width(170);
//			element.find(".SPCell:nth-child(1)").css("maxWidth", 70);
//			element.find(".SPCell:nth-child(2)").css("maxWidth", 170);
			
			elem.updateCells();
			
			if(!jQuery.isEmptyObject(settings.data))
				return;
			
			if(spreadSheetType == "Columns")
			{
				elem.autoSelect("Title", false);
				
				element.find(".insertRowAfter").trigger("click");
				
				elem.deselectAll();
			}
			else
			{
				elem.autoSelect("Title", false);
				
				element.find(".insertColumnAfter").trigger("click");
				element.find(".insertColumnAfter").trigger("click");
				
				elem.setCellValue(element.find(".line:nth-child(3)").children(".SPCell:nth-child(4)"), "Capture");
				
				elem.deselectAll();	
			}
			
			element.find(".line:nth-child(1)").children(".SPCell").each(function()
			{
				$(this).width($(this).width());
			});
		}
		
		function initContextualMenu()
		{
			if(!settings.toolbarSelect)
				return;

			element.append(contextualMenu);
			
			var contextMenu = element.find(".contextMenu");
			
			var mainContainer = $(".container-fluid");

			element.on("contextmenu", ".SPCell", function(e)
			{
//				console.log(elem);
//				console.log(spreadSheetLines);
//				console.log(elem == spreadSheetLines);
				
				
//				if($(this).hasClass("cell"))
//					$(this).trigger("click");
				
				if(settings.readOnly)
					contextMenu.find("a").addClass("greyed");
				else
				{
					if(elem == spreadSheetLines)
					{
						if(element.find(".selectedCell").hasClass("context"))
						{
							element.find(".removeLine").addClass("greyed");
						}
						else
						{
							element.find(".removeLine").removeClass("greyed");
						}
						
						if(element.find(".selectedCell").parents(".line").index() <= 2)
						{
							element.find(".insertRowBefore").addClass("greyed");
						}
						else
						{
							element.find(".insertRowBefore").removeClass("greyed");
						}
						if(element.find(".selectedCell").parents(".line").index() < 2)
						{
							element.find(".insertRowAfter").addClass("greyed");
						}
						else
						{
							element.find(".insertRowAfter").removeClass("greyed");
						}
						
	//					console.log(element.find(".removeColumn"));
						element.find(".removeColumn").addClass("greyed");
					}
					else if(elem == spreadSheetColumns)
					{
						if(element.find(".selectedCell").hasClass("context"))
						{
							element.find(".removeColumn").addClass("greyed");
							element.find(".insertColumnBefore").addClass("greyed");
						}
						else
						{
							element.find(".removeColumn").removeClass("greyed");
							element.find(".insertColumnBefore").removeClass("greyed");
						}
						
						var lineIndex = element.find(".selectedCell").parents(".line").index();
						if(element.find(".line:nth-child(" + (lineIndex + 1) + ")").children(".SPCell:nth-child(2)").hasClass("startingContext"))
							element.find(".removeLine").addClass("greyed");
						else
							element.find(".removeLine").removeClass("greyed");
					}
					else
					{
						element.find(".removeColumn").removeClass("greyed");
						element.find(".removeLine").removeClass("greyed");
					}
				}
				
				contextMenu.css({
					display: "block",
					left: e.pageX - parseInt(mainContainer.css("marginLeft")),
					top: e.pageY - parseInt(mainContainer.css("marginTop"))
				});
				
				return false;
			});
			  
			contextMenu.on("click", "a", function() {
				contextMenu.hide();
			});
		}
		
		function initCopyPaste()
		{
			element.append("<textarea id='copyPasteHandler' style='position: absolute; left: -5000px;'></textarea>");
		}
		
		element.on({
			mousewheel: function(e)
			{
				var isUp;
				if(e.originalEvent.wheelDelta < 0)
					isUp = false;
				else
					isUp = true;
				
				handleScrolling(e, isUp);
			},
			DOMMouseScroll: function(e)
			{
				var isUp;
				if(e.originalEvent.detail > 0)
					isUp = false;
				else
					isUp = true;
				
				handleScrolling(e, isUp);
			}
		}, ".spreadSheetContainer");
		
		function handleScrolling(e, isUp)
		{
//			console.log("SCROLLING");
			
			e.preventDefault();
			e.stopPropagation();
			
			element.find(".spreadSheetContainer").animate({scrollLeft: "+=" + (SCROLL_WIDTH * (isUp ? (-1) : 1))}, 20);
		}
		
		$(".spreadSheetContainer").scroll(function()
		{
			updateCellBorders();
//			console.log("GEHROGIJZIOJRGIOZRTJG OIJZE");
		});
		
		var isFormulaSelected = false;
		var isSelectingFormulaCells = false;
		var hasResized = false;
		function initListeners()
		{
			/*	CELL MOUSEDOWN AND CLICK	*/
			element.on({
							mousedown: function(e)
							{
								if(!settings.toolbarSelect)
									return;
								
								if(e.which === 1) leftButtonDown = true;
								
//								console.log(e.target);
//								if($(e.target).hasClass("header"))
//									return;
								
//								if(element.find(".formulaFirstCell").length)
//									checkIfCellIsFormula(element.find(".formulaFirstCell"));
								
//								console.log(spreadSheetFocus == elem);
//								if(spreadSheetFocus != elem)
//									assignInputValuesToCell();
//								
//								spreadSheetFocus = elem;
								
//								console.log(isFormulaSelected);
								
								if(!isFormulaSelected)
								{
									if(!e.ctrlKey)
									{
										element.find(".cell").removeClass("selectedCell");
										
										$(this).addClass("selectedCell");
									}
									else
										$(this).toggleClass("selectedCell");
								
									element.find(".firstCell").removeClass("firstCell");
									$(this).addClass("firstCell");
									
									if($(this).hasClass("editable"))
									{
										element.find(".toolbarFormula").prop('disabled', false);
										element.find(".toolbarFormula").val(elem.getCellValue($(this)));
									}
									else
									{
										element.find(".toolbarFormula").prop('disabled', true);
										element.find(".toolbarFormula").val("");
									}
									
									if(!$(this).children("input").length)
										assignInputValuesToCell();
								}
								else
								{
									isSelectingFormulaCells = true;
									
									element.find(".formulaSelected").removeClass("formulaFirstCell formulaSelected selectedCell");

									$(this).addClass("formulaFirstCell formulaSelected selectedCell");
									
									element.find(".formulaFirstCell").removeClass("formulaFirstCell");
									$(this).addClass("formulaFirstCell");
								}
								
//								isSelectingFormulaCells = true;
								
								updateCellBorders();
							},
							click: function(e)
							{
								if(!settings.toolbarSelect)
									return;
								
								$(".colorPicker-palette").css("display", "none");
								$(".bordersPopup").css("display", "none");
								$(".opened").removeClass("opened");

								element.find(".contextMenu").hide();
								
								var autocompleteContainer = element.find(".autocompleteContainer");
								autocompleteContainer.empty()
														.hide();
								
								e.stopPropagation();
							},
						}, ".cell");
			
			element.on({
				mousedown: function(e)
				{
					if(spreadSheetFocus != elem)
						assignInputValuesToCell();
					
					spreadSheetFocus = elem;
				}
			}, ".SPCell");

			
			element.on({
				change: function()
				{
					$(this).parents(".cell").addClass("modified");
				}
			}, "select");		
			
			var updatingBorders = false;
			element.on({
							mouseup: function(e)
							{
								if(!settings.toolbarSelect)
									return;

//								isResizeClicked = false;
								
//								console.log(isFormulaSelected + " " + isSelectingFormulaCells);
								
								if(isFormulaSelected && isSelectingFormulaCells && !$(e.target).parents(".cell").hasClass("firstCell"))
								{
									var firstCell = getCellCoordinates(element.find(".formulaSelected:first"));
									var lastCell = getCellCoordinates(element.find(".formulaSelected:last"));
									
//									console.log(firstCell + " " + lastCell);
									
									var result = "";
									if(firstCell != lastCell)
										result = "SUM(";
									
									if(firstCell == lastCell)
										result += firstCell;
									else
										result += firstCell + "-" + lastCell;
									
									if(firstCell != lastCell)
										result += ")";
									
									result += " + ";
									
									element.find(".toolbarFormula").val(element.find(".toolbarFormula").val() + result);
									element.find(".firstCell").children("input")
																.val(element.find(".firstCell").children("input").val() + result);
									element.find(".firstCell").children("input").focus();
								}
								
								isSelectingFormulaCells = false;
							},
							mousemove: function(e)
							{
								if(!settings.toolbarSelect)
									return;
								
								tweakMouseMoveEvent(e);
								
								// console.log(element.find(".selectedCell"));
//								 console.log(e.which);
								
								if(!element.find(".selectedCell").length || e.which == 0)
									return;
								// console.log("GIPEARJGUPIEZ");
								
								var nbOfSelectedCell = element.find(".selectedCell").length;
								element.find(".tempCell").removeClass("selectedCell tempCell formulaTempCell formulaSelected");
								
//								console.log(e.target);
//								if($(e.target).hasClass("header"))
//									$(e.target).trigger("mousedown");

								
								var selector = (isFormulaSelected ? "formulaFirstCell": "firstCell");
								
								var firstCell = element.find("." + selector);
								
								var x = Math.min(e.pageX, firstCell.offset().left + firstCell.width() / 2);
								var w = Math.abs(e.pageX - (firstCell.offset().left + firstCell.width() / 2));
								var y = Math.min(e.pageY, firstCell.offset().top + firstCell.height() / 2);
								var h = Math.abs(e.pageY - (firstCell.offset().top + firstCell.height() / 2));
								
								element.find(".cell").each(function()
								{
									if($(this).offset().left > x + w) return;
									if($(this).offset().left + $(this).width() < x) return;
									if($(this).offset().top > y + h) return;
									if($(this).offset().top + $(this).height() < y) return;
									
									if(!$(this).hasClass(selector))
										$(this).addClass("selectedCell tempCell");
									if(isFormulaSelected)
										$(this).addClass("formulaTempCell formulaSelected");
								});
								
								if(elem.find(".selectedCell").length != nbOfSelectedCell && !updatingBorders)
									elem.updateCells();
							}
						});
			
			function isCurrentCellAllowedToBeStyled()
			{
				var currentCell = element.find(".selectedCell");
				
				if(!currentCell.length)
					return;
				
				var result = true;
				
				currentCell.each(function()
				{
					if($(this).hasClass("context"))
						result = false;
					
//					if(spreadSheetType == "Columns")
//					{
//						if(settings.columns[$(this).index() - 1][(settings.colspan != undefined && settings.colspan.length ? 1 : 0)].data != "Title")
//						{
//							result = false;
//						}
//					}
//					else
//					{
//						if(settings.lines[$(this).parents(".line").index()][(settings.colspan != undefined && settings.colspan.length ? 1 : 0)].data != "Title")
//						{
//							result = false;
//						}
//					}	
				});
				
				return result;
			}
			
			element.find(".toolbarFill").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleColorPopUp(e, $(this));
			});
			
			element.find(".toolbarFontColor").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleColorPopUp(e, $(this));
			});
			element.find(".toolbarAlignLeft").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleAlignment($(this));
			});
			element.find(".toolbarAlignRight").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleAlignment($(this));
			});
			element.find(".toolbarAlignCenter").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleAlignment($(this));
			});
			element.find(".toolbarAlignJustify").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleAlignment($(this));
			});
			element.find(".toolbarBold").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleFontStyle($(this));
			});
			element.find(".toolbarUnderline").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleFontStyle($(this));
			});
			element.find(".toolbarItalic").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleFontStyle($(this));
			});
			element.find(".toolbarBorderLeft").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleBorderStylePopUp(e, $(this));
			});
			element.find(".toolbarBorderTop").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleBorderStylePopUp(e, $(this));
			});
			element.find(".toolbarBorderRight").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleBorderStylePopUp(e, $(this));
			});
			element.find(".toolbarBorderBottom").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleBorderStylePopUp(e, $(this));
			});
			element.find(".toolbarBorderTopBottom").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleBorderStylePopUp(e, $(this));
			});
			element.find(".toolbarBorderLeftRight").click(function(e)
			{
				if(isCurrentCellAllowedToBeStyled())
					handleBorderStylePopUp(e, $(this));
			});
			
			function updateCellState(cell)
			{
				if(spreadSheetType == "lines")
				{
					var lineIndex = cell.parents(".line").index();
					
//					console.log(lineIndex);
					
					if(settings.lines[lineIndex][0].data == "Data")
					{
						var titleIndex = getContextLine("Title");
						
//						console.log(titleIndex);
						
						var titleCell = element.find(".line:nth-child(" + (titleIndex + 1) + ")").children(".SPCell:nth-child(" + (cell.index() + 1) + ")");
					
//						console.log(titleCell);
						
						titleCell.addClass("modified");
					}
				}
				else
				{
//					console.log("JE PASSE PAR LA");
					
					var columnIndex = cell.index() - 1;
					var lineIndex = cell.parents(".line").index();
					
//					console.log(lineIndex);
					
					var colspanIndex = 	(settings.colspan != undefined && settings.colspan.length ? 1 : 0);
					
//					console.log(settings.columns[columnIndex][colspanIndex]);
					
					if(settings.columns[columnIndex][colspanIndex].data == "Data")
					{
						var titleIndex = getContextColumn("Title");
						
//						console.log(titleIndex);
						
						var titleCell = element.find(".line:nth-child(" + (lineIndex + 1) + ")").children(".SPCell:nth-child(" + (titleIndex + 1) + ")");
					
//						console.log(titleCell);
						
						titleCell.addClass("modified");
					}
				}
			}
			
			function handleFontStyle(tool)
			{
				if(settings.readOnly)
					return;
				
				var classToAdd = tool.attr('class').split(' ')[1].replace("toolbar", "");
				
				element.find(".selectedCell").each(function()
				{
					var cell = $(this);
					
					updateCellState(cell);
					
					if(classToAdd == "Underline")
						$(this).children("span").toggleClass(classToAdd.toLowerCase());
					else
						$(this).toggleClass(classToAdd.toLowerCase());
					
					$(this).addClass("modified");
				});
			}
			
			function handleAlignment(tool)
			{
				if(settings.readOnly)
					return;
				
				var classToAdd = tool.attr('class').split(' ')[1].replace("toolbarAlign", "");
				
				element.find(".selectedCell").each(function()
				{
					var cell = $(this);
					
					updateCellState(cell);
					
					for(var i = 0; i < availableAlignments.length; i++)
						$(this).removeClass(availableAlignments[i].toLowerCase());
					
					$(this).addClass(classToAdd.toLowerCase() + " modified");
				});
			}
			
			function handleColorPopUp(e, tool)
			{
				if(settings.readOnly)
					return;
				
				element.find(".opened").removeClass("opened");
				tool.addClass("opened");
				
				var mainContainer = $(".container-fluid");
				
				element.find(".colorPicker-palette").css({
															"display": "block",
															"left": ((tool.offset().left + tool.width()) - parseInt(mainContainer.css("marginLeft"))) + "px",
															"top": ((tool.offset().top + tool.height()) - parseInt(mainContainer.css("marginTop"))) + "px"
														});
				
				e.stopPropagation();
			}
			
			function handleBorderStylePopUp(e, tool)
			{
				if(settings.readOnly)
					return;
				
				element.find(".opened").removeClass("opened");
				tool.addClass("opened");
				
				var mainContainer = $(".container-fluid");
				
				element.find(".bordersPopup").css({
														"display": "block",
														"left": ((tool.offset().left + tool.width()) - parseInt(mainContainer.css("marginLeft"))),
														"top": ((tool.offset().top + tool.height()) - parseInt(mainContainer.css("marginTop")))
													});
				
				e.stopPropagation();
			}
			
			element.find(".borderPopupElementContainer").click(function()
			{
				var borderStyle = $(this).find(".borderPopupElement");
				
//				console.log(borderStyle.attr('name'));
				
				element.find(".selectedCell").each(function()
				{
					var cell = $(this);
					
					updateCellState(cell);
					
					$(this).find(".spreadSheetBorder").remove();
					
					if(borderStyle.attr('name') == "default")
						return;
					
//					console.log(element.find(".opened").attr('class'));
					
					var border = $(borderTemplate).appendTo($(this));
					
					if(element.find(".opened").hasClass("toolbarBorderLeft"))
						border.addClass(borderStyle.attr('name') + "BorderLeft");
					else if(element.find(".opened").hasClass("toolbarBorderTop"))
						border.addClass(borderStyle.attr('name') + "BorderTop");
					else if(element.find(".opened").hasClass("toolbarBorderRight"))
						border.addClass(borderStyle.attr('name') + "BorderRight");
					else if(element.find(".opened").hasClass("toolbarBorderBottom"))
						border.addClass(borderStyle.attr('name') + "BorderBottom");
					else if(element.find(".opened").hasClass("toolbarBorderLeftRight"))
					{
						border.addClass(borderStyle.attr('name') + "BorderLeft");
						border.addClass(borderStyle.attr('name') + "BorderRight");
					}
					else if(element.find(".opened").hasClass("toolbarBorderTopBottom"))
					{
						border.addClass(borderStyle.attr('name') + "BorderTop");
						border.addClass(borderStyle.attr('name') + "BorderBottom");
					}
					
					$(this).addClass("modified");
				});
			});
			
			element.find(".colorPicker-swatch").click(function()
			{
				var color = $(this);
				
				var isFillModified = element.find(".toolbarFill").hasClass("opened");
				
				element.find(".selectedCell").each(function()
				{
					var cell = $(this);
					
					updateCellState(cell);
					
					for(var i = 0; i < availableColors.length; i++)
					{
						if(isFillModified)
							$(this).removeClass(availableColors[i] + " editableFilled").css("background-color", "");
						else
							$(this).children("span").first().removeClass(availableColors[i]);
					}
					
					if(isFillModified)
					{
						if(color.attr('name') != "transparent")
						{
							$(this).addClass(color.attr('name') + " editableFilled").css("background-color", color.attr('name'));
						}
					}
					else
						$(this).children("span").first().addClass(color.attr('name'));
					
					$(this).addClass("modified");
				});
			});
			
			/*	CONTEXT MENU	*/
			element.on("click", ".removeColumn", function()
			{
				if($(this).hasClass("greyed") || settings.readOnly)
					return;
				
				elem.removeColumn();
				
				elem.updateCells();
			});
			element.on("click", ".removeLine", function()
			{
				if($(this).hasClass("greyed") || settings.readOnly)
					return;
				
				elem.removeLine();
				
				elem.updateCells();
			});
			
			
			element.on("click", ".insertRowAfter", function()
			{
				if($(this).hasClass("greyed") || settings.readOnly)
					return;
				
				var arrayToAdd = [];
				for(var i = 0; i < getMaxChildrenOfRow(); i++)
					arrayToAdd.push({
										data: "Do something here",
										isHeaderEditable: true,
										isEditable: true
									});
				
				var nbOfLineToCreate = element.find(".line").filter(function()
											{
												return $(this).children(".SPCell").hasClass("selectedCell") > 0;
											})
											.length;
				
				for(var i = 0; i < nbOfLineToCreate; i++)
					elem.addLine(arrayToAdd, true);
			});
			element.on("click", ".insertRowBefore", function()
			{
				if($(this).hasClass("greyed") || settings.readOnly)
					return;
				
				var arrayToAdd = [];
				for(var i = 0; i < getMaxChildrenOfRow(); i++)
					arrayToAdd.push({
										data: "Do something here",
										isHeaderEditable: true,
										isEditable: true
									});
				
				var nbOfLineToCreate = element.find(".line").filter(function()
						{
							return $(this).children(".SPCell").hasClass("selectedCell") > 0;
						})
						.length;
				
				for(var i = 0; i < nbOfLineToCreate; i++)
					elem.addLine(arrayToAdd, false);
			});
			element.on("click", ".insertColumnAfter", function(e)
			{
				if($(this).hasClass("greyed") || settings.readOnly)
					return;
				
				var arrayToAdd = [];
				for(var i = 0; i < getMaxChildrenOfColumn(); i++)
					arrayToAdd.push({
										data: "Do something here",
										isHeaderEditable: true,
										isEditable: true,
										style: ["center"]
									});

				elem.addColumn(arrayToAdd, true, undefined, undefined, e.originalEvent !== undefined);
			});
			element.on("click", ".insertColumnBefore", function(e)
			{
				if($(this).hasClass("greyed") || settings.readOnly)
					return;
				
				var arrayToAdd = [];
				for(var i = 0; i < getMaxChildrenOfColumn(); i++)
					arrayToAdd.push({
										data: "Do something here",
										isHeaderEditable: true,
										isEditable: true
									});
				
				elem.addColumn(arrayToAdd, false, undefined, undefined, e.originalEvent !== undefined);
			});
			
			
			element.find("#copyPasteHandler").bind('paste', function(e)
			{
				if(!settings.toolbarSelect || !element.find(".selectedCell").hasClass("editable") || settings.readOnly)
					return;
				
				setTimeout(function()
				{
					var content = element.find("#copyPasteHandler").val().replace(/\n$/, "");
					
					console.log(content);
					
					if(element.find(".selectedCell").length == 1)
					{
						var maxNbOfColumns = 0;
						var data = content.split("\n");
						for(var i = 0; i < data.length; i++)
						{
							data[i] = data[i].split("\t");
							
							if(data[i].length > maxNbOfColumns)
								maxNbOfColumns = data[i].length;
						}
						
						// console.log(data);
						// console.log(maxNbOfColumns);
						
						var columnToCreate = maxNbOfColumns - (element.find(".selectedCell").parents(".line").children().length - element.find(".selectedCell").index());
						
						// console.log(columnToCreate);
						for(var i = 0; i < columnToCreate; i++)
							elem.addColumn([], true);
						
						var lineBeginIndex = element.find(".selectedCell").parents(".line").index();
						var cellBeginIndex = element.find(".selectedCell").index();
						
						loop:
							for(var i = 0; i < data.length; i++)
							{
								var line = element.find(".line:nth-child(" + ((lineBeginIndex + i) + 1) + ")");
								
								if(!line.length)
								{
									var arrayToAdd = [];
									for(var i = 0; i < getMaxChildrenOfRow(); i++)
										arrayToAdd.push({
															data: "Do something here",
															isHeaderEditable: true,
															isEditable: true
														});
									
									elem.addLine(arrayToAdd, false);
								}
								line = element.find(".line:nth-child(" + ((lineBeginIndex + i) + 1) + ")");
								
								for(var j = 0; j < data[i].length; j++)
								{
									var cell = line.children(".SPCell:nth-child(" + ((cellBeginIndex + j) + 1) + ")");
		//							console.log(cell);
		//							console.log(data[i][j]);
									
									if(!cell.hasClass("editable"))
										break loop;
									
									elem.setCellValue(cell, data[i][j]);
									cell.addClass("modified selectedCell");
								}
							}
						
//						element.find(".selectedCell").trigger("mousedown");
					}
					else
					{
						element.find(".selectedCell").each(function()
						{
							elem.setCellValue($(this), content);
						});
					}
					
					elem.updateCells();
				}, 100);
			});
			
			element.on('input', ".toolbarFormula", function(e)
			{
				if(!element.find(".spreadsheetInput").length)
					element.find(".firstCell").trigger("dblclick");
				
				element.find(".spreadsheetInput").val($(this).val());
				
//				if(e.which != 13)
//					$(this).focus();
//				else
//					$(':focus').blur();
				
//				elem.setCellValue(element.find(".firstCell"), $(this).val());
			});

			element.on("input", "input:not(.toolbarFormula)", function()
			{
				element.find(".toolbarFormula").val($(this).val());
			});
			
			element.on("dblclick", ".editable", function()
			{
				if($(this).children("input").length || !settings.toolbarSelect)
					return;
				
				var cellValue = elem.getCellValue($(this));
				
				var input = $(inputTemplate).appendTo($(this));
				input.val(cellValue);

				checkIfCellIsFormula($(this));
					
				input.focus();
				input.select();
			});
			
			element.on("keydown", "input", function(e)
			{
				var cell = element.find(".spreadsheetInput").parents(".cell");
				if(e.which == 13 || e.which == 27)
				{
					console.log("GEIGORJ OEIJRG OIEJR");
					console.log(isFormulaSelected);
					if(isFormulaSelected)
					{
						var formulaVal = $(this).val();
						var splittedValue = formulaVal.split(/\s|SUM|=|\(|\)|\-|\*|\/|\+/g).filter(Boolean);
						console.log(splittedValue);
						
						for(var i = 0; i < splittedValue.length; i++)
						{
							var formulaCell = elem.getCellByCoordiantes(splittedValue[i]);
							
							if(!formulaCell.length)
								continue;
							
							console.log(formulaCell);
//							console.log(formulaCell.attr('data-spreadsheetData'));
							// var re = new RegExp(splittedValue[i],"g");
							formulaVal = formulaVal.replace(splittedValue[i], "%" + formulaCell.attr('data-spreadsheetData') + "%");
						}
						
//						console.log(formulaVal);
						
						cell.attr('name', formulaVal);
						
						isFormulaSelected = false;
						isSelectingFormulaCells = false;
						
//						console.log("JE SET TT A FALSE");
						
						element.find(".formulaFirstCell").removeClass("formulaFirstCell formulaSelected firstCell");
					}
					else
						cell.attr("name", "");
					
					var autocompleteContainer = element.find(".autocompleteContainer");
					autocompleteContainer.empty()
											.hide();
					
					// updateFormula();
					
					var value = $(this).val();
					
//					if($(this).hasClass("toolbarFormula"))
//						return;
					
//					console.log("CEST CA LA VALUE: " + value);
					
//					elem.setCellValue(cell, value);
					assignInputValuesToCell();
					
					/*	AUTOSELECTION	*/
					if(cell.parents(".line").next().length)
					{
						var cellToAutoSelect = cell.parents(".line").next().children(".SPCell:nth-child(" + (cell.index() + 1) + ")");
//						console.log(cell.parents(".line").next());
//						console.log(cellToAutoSelect);
//						elem.autoSelect(cellToAutoSelect, true);
						
						cellToAutoSelect.trigger("mousedown");
						
						elem.updateCells();
					}
					
					cell.find("input").remove();
					
					if(!$(this).hasClass("toolbarFormula"))
					{
//						cell.find("input").remove();
					}
					else
					{
						elem.setCellValue(cell, $(this).val());
						
						$(this).blur();
					}
				}
				else
				{
//					console.log($(this));
					setTimeout(function()
					{
						checkIfCellIsFormula(cell);
					}, 100);
					
					var autocompleteData = settings.autocomplete;
					var dimensionData;
					
					if(spreadSheetType == "lines")
						dimensionData = settings.lines[cell.parents(".line").index()][0];
					else
						dimensionData = settings.columns[cell.index() - 1][settings.colspan != undefined && settings.colspan.length ? 1 : 0];
					
//					console.log(dimensionData);
//					console.log(autocompleteData);
					
					cellAutoComplete(cell, dimensionData);
				}
			});
			

			
			function cellAutoComplete(cell, dimensionData)
			{
				setTimeout(function()
				{
					var input = cell.find("input");
					var inputValue = input.val();
					
					var autocompleteContainer = element.find(".autocompleteContainer");
					
//					console.log(inputValue);
					
					if(inputValue != undefined/* && inputValue.indexOf("%") == 0*/)
					{
						if(settings.autocomplete == undefined/* || settings.autocomplete[dimensionData.data] == undefined*/)
							return;
						
//						console.log(inputValue);
						console.log('settingsautocomplete');
						console.log(settings.autocomplete);
						buildAutoComplete(input, autocompleteContainer, settings.autocomplete, dimensionData, (getInputType(input) == "Retrieve"));
					}
				}, 100);
			}
			
			element.on({
							click: function(e)
							{
								e.stopPropagation();
								
								var autocompleteElement = $(this);
								
								element.find("input").val(autocompleteElement.text());
								element.find("input").focus();
								
								element.find(".autocompleteContainer").empty()
																		.hide();
							},
							mouseover: function()
							{
								$(this).addClass("ui-state-focus");
							},
							mouseout: function()
							{
								$(this).removeClass("ui-state-focus");
							}
						}, ".autocompleteContainer li:not(.autocompleteHeader)");
			
			function checkIfCellIsFormula(cell)
			{
				isFormulaSelected = (elem.getCellValue(cell).indexOf("=") == 0 || (cell.children("input").length 
																				&& cell.children("input").val().indexOf("=") == 0));
				
//				console.log(isFormulaSelected);
			}
			
			var headerClicked = false;
			element.on({
							mousedown: function(e)
							{
								if(!settings.toolbarSelect || e.which === 3 || isResizeClicked)
									return;
								
								if(!element.find(".firstHeaderSelecting").length)
									$(this).addClass("firstHeaderSelecting");
								$(this).addClass("headerSelecting");
								
								if(e.which === 1) headerClicked = true;
								
								var tmpCellAttr = (e.originalEvent !== undefined ? "" : "tempCell");
								
								if(e.originalEvent !== undefined)
									element.find(".cell").removeClass("selectedCell");
								
								if($(this).parents(".line").index() == 0)
									element.find(".cell:nth-child(" + ($(this).index() + 1) + ")").addClass("selectedCell " + tmpCellAttr);
								else
									$(this).parents(".line").children(".cell").addClass("selectedCell " + tmpCellAttr);
								
								if(!element.find(".firstCell").length)
									element.find(".selectedCell").first().addClass("firstCell");
								
								elem.updateCells();
							},
							mousemove: function(e)
							{
//								if($(this).hasClass("headerSelecting"))
//									return;
								
//								$(this).toggleClass("headerSelecting");
								
//								$(this).trigger("mousedown");

								console.log("jpijpijpifjerijfgztrgu tuhçer");
								
								if(!headerClicked)
									return;
								
								console.log("jpijpijpifjerijf");
								
								
								var firstCell = element.find(".firstHeaderSelecting");
								
								if(!firstCell.length)
									return;
								
								var x = Math.min(e.pageX, firstCell.offset().left + firstCell.width() / 2);
								var w = Math.abs(e.pageX - (firstCell.offset().left + firstCell.width() / 2));
								var y = Math.min(e.pageY, firstCell.offset().top + firstCell.height() / 2);
								var h = Math.abs(e.pageY - (firstCell.offset().top + firstCell.height() / 2));
								
								element.find(".headerSelecting").removeClass("headerSelecting");
								element.find(".tempCell").removeClass("selectedCell tempCell");
								
								console.log(firstCell);
								
								element.find(".header").each(function()
								{
									if($(this).offset().left > x + w) return;
									if($(this).offset().left + $(this).width() < x) return;
									if($(this).offset().top > y + h) return;
									if($(this).offset().top + $(this).height() < y) return;
									
									console.log($(this));
									
//									if(!$(this).hasClass(".header"))
										$(this).trigger("mousedown");
//										$(this).addClass("selectedCell tempCell");
								});
							},
							mouseup: function()
							{
								headerClicked = false;
								
								element.find(".headerSelecting").removeClass("firstHeaderSelecting headerSelecting");
							}
						}, ".header");
			
			var isResizeClicked = false;
			var isTopHeaderResize = false;
			var shouldInverse = false;
			var isPrev = false;
			var isTop = false;
			element.on({
							mousedown: function(e)
							{
								if(!settings.toolbarSelect)
									return;

								formerX = e.pageX;
								formerY = e.pageY;
								
								isResizeClicked = true;
								
								if($(this).hasClass("leftResize") || $(this).hasClass("rightResize"))
								{
									element.find(".SPCell").each(function()
									{
										$(this).width($(this).width());
									});
								}
								
								if($(this).hasClass("leftResize"))
								{
//									var cellIndex = $(this).parents(".SPCell").index();
									
//									element.find(".SPCell:nth-child(" + cellIndex + ")").css("width", "auto");
									// element.find(".SPCell:nth-child(" + (cellIndex + 1) + ")").css("width", "auto");
									
//									shouldInverse = true;
									
									isPrev = true;
								}
								else if($(this).hasClass("rightResize"))
								{
//									var cellIndex = $(this).parents(".SPCell").index();
									
									// element.find(".SPCell:nth-child(" + (cellIndex + 1) + ")").css("width", "auto");
//									element.find(".SPCell:nth-child(" + (cellIndex + 2) + ")").css("width", "auto");
									
//									shouldInverse = false;
									
									isPrev = false;
								}
								else if($(this).hasClass("topResize"))
								{
									isTop = true;
								}
								else if($(this).hasClass("bottomResize"))
								{
									isTop = false;
								}
								
								isTopHeaderResize = $(this).parents(".header").hasClass("topHeader");
								element.find(".resizing").removeClass("resizing");
								$(this).parents(".header").addClass("resizing");
								element.find(".resizingElement").removeClass("resizingElement");
								$(this).addClass("resizingElement");
							}
						}, ".resize");
			
			var formerX = 0;
			var formerY = 0;
			$(document).on({
								mousemove: function(e)
								{
//									console.log(isResizeClicked);
									
									if(!isResizeClicked	|| !settings.toolbarSelect)
										return;
									
									hasResized = true;
									
									if(isTopHeaderResize)
									{
										var diffX = (e.pageX - formerX) * (shouldInverse ? -1 : 1);
										
										formerX = e.pageX;
										var cellIndex = element.find(".resizing").index();
										
										var selector = element.find(".SPCell:nth-child(" + (cellIndex + 1) + ")");
										if(isPrev)
											selector = selector.prev();
										
										if(selector.first().parents(".line").width() - selector.first().outerWidth() + 
												(selector.first().outerWidth() + diffX) > element.find(".spreadSheetContainer").outerWidth())
											selector.width(selector.first().width() + diffX);
									}
									else
									{
										var diffY = e.pageY - formerY;
										
										formerY = e.pageY;
										
										var lineIndex = element.find(".resizing").parents(".line").index();
										var line;
										if(isTop)
											line = element.find(".line:nth-child(" + lineIndex + ")");
										else
											line = element.find(".line:nth-child(" + (lineIndex + 1) + ")");
										line.height(line.height() + diffY);
									}
									
									var spreadSheetContainer = element.find(".spreadSheetContainer");
									
									var minX = spreadSheetContainer.scrollLeft();
									var maxX = minX + spreadSheetContainer.width();
									
									var resizingElement = element.find(".resizingElement");
									if(resizingElement.length)
									{
										var totalWidth = 0;
										var prevElement = resizingElement.parent();
										while((prevElement = prevElement.prev()).length)
											totalWidth += prevElement.outerWidth();
										
										console.log(resizingElement.parent());
										console.log(maxX + " " + (resizingElement.position().left + totalWidth) + " " + resizingElement.position().left + " " + totalWidth);
									}
									
									if(resizingElement.length && resizingElement.position().left + resizingElement.width() + totalWidth > maxX)
									{
										console.log("jpiojeriogj");
										
										spreadSheetContainer.scrollLeft(resizingElement.position().left + resizingElement.width() + totalWidth - spreadSheetContainer.width());
									}
									
									elem.updateCells();
								}
							});
			
			var isTopHeaderMove;
			var isMoveClicked = false;
			element.on({
							mousedown: function(e)
							{
								if(!settings.toolbarSelect)
									return;
								
								isMoveClicked = true;
								
								isTopHeaderMove = $(this).parents(".header").hasClass("topHeader");
								
								if(!isTopHeaderMove)
									$(this).parents(".line").addClass("moving");
								else
									$(this).parents(".SPCell").addClass("moving");
							}
						}, ".moveElement");

			$(document).on({
								mousemove: function(e)
								{
									if(!isMoveClicked || !settings.toolbarSelect)
										return;
									
									var mainContainer = $(".container-fluid");
									
									if(isTopHeaderMove)
									{
										var cursorX = e.pageX;
										var itsok = false;
										element.find(".line:first").children(".SPCell").each(function()
										{
											if(cursorX <= $(this).offset().left + ($(this).width() / 2) && cursorX >= $(this).offset().left
												&& !$(this).hasClass("moving") && $(this).index() != 0
												&& $(this).offset().left < element.find(".moving").offset().left
												&& 
													(settings.disableMovingForColumnInferiorTo != undefined && $(this).index() >= settings.disableMovingForColumnInferiorTo)
													|| settings.disableMovingForColumnInferiorTo == undefined)
											{
												element.find(".downCursor").css({
																					"left": $(this).offset().left - element.find(".rightCursor").width() / 2 - parseInt(mainContainer.css("marginLeft")),
																					"top": $(this).offset().top - element.find(".rightCursor").height() - parseInt(mainContainer.css("marginTop")),
																					"display": "block"
																				});
												
												itsok = true;
												
												return false;
											}
											else if(cursorX <= $(this).offset().left + $(this).width() && cursorX >= $(this).offset().left + $(this).width() / 2
												&& !$(this).hasClass("moving") && $(this).index() != 0
												&& $(this).offset().left + $(this).width() > element.find(".moving").offset().left
												&& 
													(settings.disableMovingForColumnInferiorTo != undefined && $(this).index() >= settings.disableMovingForColumnInferiorTo)
													|| settings.disableMovingForColumnInferiorTo == undefined)
											{
												var firstChildren = $(this).children(":not(.header)").first();
												
												element.find(".downCursor").css({
																					"left": $(this).offset().left + $(this).width() - element.find(".rightCursor").width() / 2 - parseInt(mainContainer.css("marginLeft")),
																					"top": $(this).offset().top - element.find(".rightCursor").height() - parseInt(mainContainer.css("marginTop")),
																					"display": "block"
																				});
												
												itsok = true;
												
												return false;
											}
										});
										
										if(!itsok)
											element.find(".downCursor").css("display", "none");
									}
									else
									{
										var cursorY = e.pageY;
										var itsok = false;
										element.find(".line").each(function()
										{
											var firstChildren = $(this).children(":not(.header)").first();
											
											if(cursorY <= $(this).offset().top + ($(this).height() / 2) && cursorY >= $(this).offset().top
												&& !$(this).hasClass("moving") && $(this).index() != 0
												&& firstChildren.offset().top < element.find(".moving").offset().top
												&& 
													(settings.disableMovingForRowInferiorTo != undefined && $(this).index() >= settings.disableMovingForRowInferiorTo)
													|| settings.disableMovingForRowInferiorTo == undefined)
											{												
												element.find(".rightCursor").css({
																					"left": firstChildren.offset().left - element.find(".rightCursor").width() - parseInt(mainContainer.css("marginLeft")),
																					"top": firstChildren.offset().top - element.find(".rightCursor").height() / 2 - parseInt(mainContainer.css("marginTop")),
																					"display": "block"
																				});
												
												itsok = true;
												
												return false;
											}
											else if(cursorY <= $(this).offset().top + $(this).height() && cursorY >= $(this).offset().top + $(this).height() / 2
												&& !$(this).hasClass("moving") && $(this).index() != 0
												&& firstChildren.offset().top + firstChildren.height() > element.find(".moving").offset().top
												&& 
													(settings.disableMovingForRowInferiorTo != undefined && $(this).index() >= settings.disableMovingForRowInferiorTo)
													|| settings.disableMovingForRowInferiorTo == undefined)
											{
												var firstChildren = $(this).children(":not(.header)").first();
												
												element.find(".rightCursor").css({
																			"left": firstChildren.offset().left - element.find(".rightCursor").width() - parseInt(mainContainer.css("marginLeft")),
																			"top": firstChildren.offset().top + firstChildren.height() - element.find(".rightCursor").height() / 2 - parseInt(mainContainer.css("marginTop")),
																			"display": "block"
																		});
												
												itsok = true;
												
												return false;
											}
										});
										
										if(!itsok)
											element.find(".rightCursor").css("display", "none");
									}
								}
							});
			
			$(document).on({
								mouseup: function(e)
								{
									if(!isMoveClicked || !settings.toolbarSelect)
										return;
									
									isMoveClicked = false;
									
									if(element.find(".rightCursor:visible").length)
									{
										element.find(".line").each(function()
										{
											if(element.find(".rightCursor").offset().top >= $(this).offset().top 
												&& element.find(".rightCursor").offset().top <= $(this).offset().top + $(this).height())
											{
												var movingLine = element.find(".moving").clone();
												element.find(".moving").remove();
												
												if(element.find(".rightCursor").offset().top > $(this).offset().top + $(this).height() / 2)
													movingLine.insertAfter($(this));
												else
													movingLine.insertBefore($(this));
												
												settings.lines.move(element.find(".moving").index(), $(this).index());
												
												return false;
											}
										});
									}
									else if(element.find(".downCursor:visible").length)
									{
										element.find(".line:first").children(".SPCell").each(function()
										{
											if(element.find(".downCursor").offset().left >= $(this).offset().left 
												&& element.find(".downCursor").offset().left <= $(this).offset().left + $(this).width())
											{
												var movingIndex = element.find(".moving").index();
												
												var movingCells = element.find(".SPCell:nth-child(" + ( movingIndex + 1) + ")").clone();
												element.find(".SPCell:nth-child(" + ( movingIndex + 1) + ")").remove();
												
												var cellIndex = $(this).index();
												
												movingCells.each(function(index)
												{
													var line = element.find(".line:nth-child(" + (index + 1) + ")");
													
													$(this).insertAfter(line.children(".SPCell:nth-child(" + (cellIndex + 1) + ")"));
												});
												
												return false;
											}
										});
									}
									
									element.find(".moving").removeClass("moving");
									element.find(".cursor").css("display", "none");
									
									updateHeader();
									
									updateFormula();
								}
							});
		}
		
		function getCellStyle(cell)
		{
			var classes = cell.attr('class');
			
			for(var i = 0; i < notStyleClasses.length; i++)
				classes = classes.replace(notStyleClasses[i], "");
			
			return classes;
		}
		
		function getCellBorderStyle(cell)
		{
			var classes = cell.children(".spreadSheetBorder").attr('class');
			
			if(classes == undefined)
				return "";
			
			for(var i = 0; i < notStyleClasses.length; i++)
				classes = classes.replace(notStyleClasses[i], "");
			
			return classes;
		}
		
		function getCellChildrenStyle(cell)
		{
			var classes = cell.children("span").attr('class');
			
			if(classes == undefined)
				return "";
			
			for(var i = 0; i < notStyleClasses.length; i++)
				classes = classes.replace(notStyleClasses[i], "");
			
			return classes;
		}
		
		function setCellStyle(cell, style)
		{
			cell.addClass(style);
		}
		
		function setCellBorderStyle(cell, style)
		{
			var border = $(borderTemplate).appendTo(cell);
			
			border.addClass(style);
		}
		
		function setCellChildrenStyle(cell, style)
		{
			cell.children("span").addClass(style);
		}
		
		function placeContainers()
		{
			if(settings.toolbarEnable && checkIfObjectHasValue(settings.toolbarTools))
			{
				var toolbar = $(toolbarTemplate).appendTo(element);
				
				for(var key in settings.toolbarTools)
				{
					if(settings.toolbarTools[key])
					{
						var tooltipText = key.replace("toolbar", "");
						
						$(toolTemplate).appendTo(toolbar.find("#tools")).addClass("toolbarItem " + key).attr('title', tooltipText);
					}
				}
				
				$('[data-toggle="tooltip"]').tooltip();
				
				var formula = $(toolbarFormula).appendTo(toolbar);
				formula.css("margin-left", element.find("#tools").width() + 30);
			}
			
			initAutocomplete();
			initColors();
			initBorderStyles();
			initCursors();
			element.append(spreadSheetTemplate);
		}
		
		function initAutocomplete()
		{
//			console.log(settings.autocomplete);
			
			if(settings.autocomplete != undefined)
				element.append(autocompleteTemplate);
		}
		
		function initCursors()
		{
			element.append(cursors);
		}
		
		function initBorderStyles()
		{
			element.append(borders);
		}
		
		function initColors()
		{
			element.append(colors);
			
			if(availableColors.length)
				return;
			
			element.find(".colorPicker-swatch").each(function()
			{
				availableColors.push($(this).attr('name'));
			});
		}
		
		function placeContext()
		{
//			console.log(settings.columns);
//			console.log(settings.lines);
			
			initColumns();
			
//			console.log(settings.columns);
//			console.log(settings.lines);
			
			placeLines();
			placeColumns();
			elem.updateCells();
		}
		
		function placeLines()
		{
//			console.log(settings.lines);
			
			if(!settings.lines.length)
				return;
			
			for(var i = 0; i < getMaxChildrenOfColumn(); i++)
			{
				var arrayToAdd = [];
				for(var j = 0; j < getMaxChildrenOfRow(); j++)
					arrayToAdd.push({ data: "" });
				settings.lines.splice(1, 0, arrayToAdd);
				
				addLineToSpreadSheet(undefined, true, false);
				//	MAKE LINES CONTEXT (SETTINGS.LINES) GROW ACCORDING TO THE MAX NB OF COLUMNS
			}
			
			for(var i = getMaxChildrenOfColumn() + 1; i < settings.lines.length; i++)
				addLineToSpreadSheet(undefined, true, false);
		}
		
		function initColumns()
		{
//			console.log(getMaxChildrenOfRow());
//			console.log(getMaxChildrenOfColumn());
//			console.log(settings.columns);
			var arrayToAdd = [];
			for(var j = 0; j < getMaxChildrenOfRow(); j++)
				for(var i = 0; i < getMaxChildrenOfColumn(); i++)
					arrayToAdd.push({ data: "", type: "empty" });
			if(arrayToAdd.length)
				settings.columns.splice(0, 0, arrayToAdd);
			
			if(settings.colspan != undefined && settings.colspan.length)
				for(var i = 0; i < settings.columns.length; i++)
					settings.columns[i].splice(0, 0, { data: "" });
			
//			console.log(settings.columns);
		}
		
		function placeColumns()
		{
			for(var i = 0; i < settings.columns.length; i++)
				if(settings.columns[i][0].type != "empty")
					addColumToSpreadSheet(undefined, true);
			
			if(settings.colspan != undefined && settings.colspan.length)
			{
				for(var i = 0; i < settings.colspan.length; i++)
				{
					colspanId++;
					
					for(var j = 0; j < settings.colspan[i].length; j+=settings.colspan[i].length)
					{
						var fromCellId = settings.colspan[i][j];
						var toCellId = settings.colspan[i][j + 1];
						
						var style = settings.colspan[i][j + 2][0][0];
						
						element.find(".line:nth-child(2)").children(".SPCell:nth-child(" + (parseInt(fromCellId) + 1) + ")")
															.attr('data-colspanDataBegin', colspanId);
						setCellChildrenStyle(element.find(".line:nth-child(2)").children(".SPCell:nth-child(" + (parseInt(fromCellId) + 1) + ")"), style);
						element.find(".line:nth-child(2)").children(".SPCell:nth-child(" + (parseInt(toCellId) + 1) + ")")
															.attr('data-colspanDataEnd', colspanId);
					}
				}
			}
		}
		
		this.getData = function()
		{
			var data = [];
			
			var escapedLines = 0;
			
			element.find(".line").each(function()
			{
				if(!$(this).children(".cell:not(.context)").length)
				{
					escapedLines++;
					return;
				}
					
				var line = $(this);
				data.push([]);
				
				console.log(line);
				
				$(this).children(".cell:not(.context)").each(function()
				{
					data[line.index() - escapedLines].push(elem.getCellValue($(this)));
				});
			});
			
			return data;
		}
				
		this.updateData = function(data)
		{
			settings.data = data;
		}
		
		this.placeData = function()
		{
			var data = settings.data;
			
//			console.log(data);
//			console.log(data.hasOwnProperty("columnContext"));
			
			if(data.hasOwnProperty("columnContext"))
			{
//				console.log("GEJRIOGJE JGIOE JR");
				for(var i = 0; i < data.columnContext.length; i++)
				{
					var column = data.columnContext[i];
					
					elem.addColumn([], undefined, false, false);
					
					for(var key in column)
					{
						if(column.hasOwnProperty(key))
						{
							var obj = column[key];
							
							if(obj instanceof Array)
							{
								for(var j = 0; j < obj.length; j++)
								{
									var dimension = obj[j].Dimension.Name;
									
									placeValue(dimension, obj[j].GridElement.Value, false, obj[j].GridElement.Style, obj[j].Id, column.Id, false);
								}
							}
							else
								placeValue(key, obj.Value, false, obj.Style, undefined, column.Id, true);
						}
					}
					
					placeValue("Data", "Data format", false, column.DefaultStyle.Style, undefined, column.Id, true);
				}
			}
			else if(data.rowContext)
			{
				for(var i = 0; i < data.rowContext.length; i++)
				{
					var row = data.rowContext[i];
					
					elem.addLine([], undefined, false);
					
					for(var key in row)
					{
						if(row.hasOwnProperty(key))
						{
							var obj = row[key];
							
							if(obj instanceof Array)
							{
								var dimensions = [];
								
								for(var j = 0; j < obj.length; j++)
								{
									var dimension = obj[j].Dimension.Name;
									
									if($.inArray(dimension, dimensions) > -1)
										dimension += "2";
									
									placeValue(dimension, obj[j].GridElement.Value, true, obj[j].GridElement.Style, obj[j].Id, row.Id, false);
									
									dimensions.push(dimension);
								}
							}
							else
								placeValue(key, obj.Value, true, obj.Style, undefined, row.Id, true);
						}
					}
					
					placeValue("Data", "Data format", true, row.DefaultStyle.Style, undefined, row.Id, true);
				}
			}
			else if(data.data)
			{
				if( window.location.href.indexOf('displayGrid') > - 1) {

					for(var i = 0; i < data.data.length; i++)
					{
						var line = element.find(".line:nth-child(" + (getMaxChildrenOfColumn() + 1 + 1 + i) + ")");
						
	//					console.log(line);
						
						for(var j = 0; j < data.data[i].length; j++)
						{
							var cell = line.children(".SPCell:nth-child(" + (getMaxChildrenOfRow() + 1 + 1 + j) + ")");
							
	//						console.log(cell);
							
							elem.setCellValue(cell, data.data[i][j], true);
							
							var cellIndex = cell.index();
							
							var rowContextId = cell.parents(".line").find("[data-spreadsheetbeanid]").attr('data-spreadsheetbeanid');
							var columnContextId = element.find(".SPCell:nth-child(" + (cellIndex + 1) + ")[data-spreadsheetbeanid]").attr('data-spreadsheetbeanid');

							for(var k = 0; k < grid.GridStyles.length; k++)
							{
								var gridStyle = grid.GridStyles[k];
								
								if(gridStyle.RowContext.Id == rowContextId && gridStyle.ColumnContext.Id == columnContextId)
								{
									setCellStyle(cell, gridStyle.Style.CellStyle);
									setCellChildrenStyle(cell, gridStyle.Style.ChildrenStyle);
									if(gridStyle.Style.BorderStyle != undefined && gridStyle.Style.BorderStyle.trim() != "")
										setCellBorderStyle(cell, gridStyle.Style.BorderStyle);
									
									break;
								}
							}
						}
					}


				} else {
					for(var i = 0; i < data.data.length; i++)
					{
						var line = element.find(".line:nth-child(" + (getMaxChildrenOfColumn() + 1 + 1 + i) + ")");
						
	//					console.log(line);
						
						for(var j = 0; j < data.data[i].length; j++)
						{
							var cell = line.children(".SPCell:nth-child(" + (getMaxChildrenOfRow() + 1 + 1 + j) + ")");
							
	//						console.log(cell);
							
							elem.setCellValue(cell, data.data[i][j], true);
							
							var cellIndex = cell.index();
							
							var rowContextId = cell.parents(".line").find("[data-spreadsheetbeanid]").attr('data-spreadsheetbeanid');
							var columnContextId = element.find(".SPCell:nth-child(" + (cellIndex + 1) + ")[data-spreadsheetbeanid]").attr('data-spreadsheetbeanid');

							//gérer les styles after 
							/*for(var k = 0; k < grid.GridStyles.length; k++)
							{
								var gridStyle = grid.GridStyles[k];
								
								if(gridStyle.RowContext.Id == rowContextId && gridStyle.ColumnContext.Id == columnContextId)
								{
									setCellStyle(cell, gridStyle.Style.CellStyle);
									setCellChildrenStyle(cell, gridStyle.Style.ChildrenStyle);
									if(gridStyle.Style.BorderStyle != undefined && gridStyle.Style.BorderStyle.trim() != "")
										setCellBorderStyle(cell, gridStyle.Style.BorderStyle);
									
									break;
								}
							}*/
						}
					}
				}
				
			}
			
			elem.autoSize();

			elem.updateCells();
			
        	if(typeof(busyIndicatorOnComplete) == "function")
        		busyIndicatorOnComplete();
		}
		
		function placeValue(context, value, isLine, style, beanId, parentId, isContext)
		{
			var index = 0;
			if(!isLine)
				index = getContextLine(context);
			else
				index = getContextColumn(context);
			
			if(index != undefined)
			{
				var cell;
				if(!isLine)
				{
					cell = element.find(".line:nth-child(" + (index + 1) + ")").children(".SPCell:last");
					elem.setCellValue(cell, value, true);
					
//					console.log(cell);
//					console.log(value);
				}
				else
				{
					cell = element.find(".line:last").children(".SPCell:nth-child(" + (index + 1) + ")");
					elem.setCellValue(cell, value, true);
					
//					console.log(cell);
//					console.log(value);
				}
				
				if(beanId)
					cell.attr('data-spreadsheetBeanId', beanId);
				if(parentId)
					cell.attr('data-spreadsheetParentId', parentId);
				
				if(style == null)
					return;
				
				try
				{
					setCellStyle(cell, style.CellStyle);
					setCellChildrenStyle(cell, style.ChildrenStyle);
					if(style.BorderStyle != undefined && style.BorderStyle.trim() != "")
						setCellBorderStyle(cell, style.BorderStyle);
				}
				catch(e)
				{
					console.log(e);
				}
			}
		}
		
		function getContextLine(key)
		{
			for(var i = 0; i < settings.lines.length; i++)
				for(var j = 0; j < settings.lines[i].length; j++)
					if(settings.lines[i][j].data == key)
						return i;
		}
		
		function getContextColumn(key)
		{
			for(var i = 0; i < settings.columns.length; i++)
				for(var j = 0; j < settings.columns[i].length; j++)
					if(settings.columns[i][j].data == key)
						return i + 1;
		}
		
		function updateAllCellsOfAllInstances()
		{
			for(var i = 0; i < instances.length; i++)
				instances[i].updateCells();
		}

		function addLineToSpreadSheet(isAfter, isStarting, shouldAnnotate, isHumanCalled)
		{
			if(isHumanCalled && settings.readOnly)
				return;
			
//			console.log(element.find(".line"));
			var selectedLine = (isAfter == undefined ? element.find(".line:last") : 
				(isAfter ? element.find(".selectedCell").last().parents(".line") : element.find(".selectedCell").first().parents(".line")));
			var line;
			
			if(isAfter || isAfter == undefined)
				line = $(lineTemplate).insertAfter(selectedLine);
			else
				line = $(lineTemplate).insertBefore(selectedLine);
			
			var index = line.index();
			
			// console.log(settings.lines);
			
			// addHeaderCell(line);
			console.log(index);
//			 if(options.length)
			for(var i = 0; i < settings.lines[index].length; i++)
			{
//				console.log(settings.lines[index]);
//				console.log("JE TEST CA");
				addContextCell(line, settings.lines[index][i], true, undefined, isStarting);
			}
			
			for(var i = 0; i < getMaxNbOfColumns() - settings.lines[index].length; i++)
				addCell(line, undefined, undefined, shouldAnnotate);
			
			checkHeader();
			elem.updateCells();
			
			updateAllCellsOfAllInstances();
			
			return line;
		}
		
		function addColumToSpreadSheet(isAfter, isStarting, shouldAnnotate, isHumanCalled)
		{
			if(isHumanCalled && settings.readOnly)
				return;

			var selectedCell = (isAfter == undefined ? element.find(".line:nth-child(2)").children(":last") :
					(isAfter ? element.find(".selectedCell").first() : element.find(".selectedCell").last()));
			var index = (selectedCell.index() + (isAfter || isAfter == undefined ? 0 : -1));
			
			// console.log(selectedCell);
//			 console.log(index);
			
			var columnLength = (settings.columns.length - 1 >= index ? settings.columns[index].length : 0);
			for(var i = 0; i < columnLength; i++)
				addContextCell(element.find(".line:nth-child(" + ( i + 2) + ")"), settings.columns[index][i], false, index, isStarting);

			for(var i = columnLength + 1; i < element.find(".line").length; i++)
				addCell(element.find(".line:nth-child(" + ( i + 1) + ")"), undefined, index + 1, shouldAnnotate);
			
			checkHeader();
			elem.updateCells();
			
//			if(!hasResized)
//				elem.autoSize();
			
			return (selectedCell.index() + (isAfter || isAfter == undefined ? 1 : -1));
		}
		
		this.removeLine = function()
		{
			var lineToRemove = element.find(".selectedCell").parents(".line");
			
			settings.lines.splice(lineToRemove.index(), 1);
			
			lineToRemove.find(".SPCell").each(function()
			{
				var dataIdContext = $(this).attr('data-spreadsheetparentid');
				var dataIdDimension = $(this).attr('data-spreadsheetbeanid');
				
				if(dataIdContext != undefined && dataIdDimension == undefined)
				{
					if(elem == spreadSheetLines && $.inArray(dataIdContext, removedRowsContext) == -1)
						removedRowsContext.push(dataIdContext);
				}
				else if(dataIdContext != undefined && dataIdDimension != undefined)
				{
					if(elem == spreadSheetColumns && $.inArray(dataIdDimension, removedColumnsDimension) == -1)
						removedColumnsDimension.push(dataIdDimension);
				}
				
				$(this).remove();
			});
			
			lineToRemove.remove();
			
			console.log(removedRowsContext);
			console.log(removedColumnsDimension);
			
			updateAllCellsOfAllInstances();
		};
		
		this.removeColumn = function()
		{
			var index = element.find(".selectedCell").index();
			
			settings.columns.splice(index, 1);
			
			element.find(".SPCell:nth-child(" + (index + 1) + ")").each(function()
			{
				var dataIdContext = $(this).attr('data-spreadsheetIdContext');
				var dataIdDimension = $(this).attr('data-spreadsheetIdDimension');
				
				
				
				if(dataIdContext != undefined && dataIdDimension == undefined)
				{
					if(elem == spreadSheetColumns && $.inArray(dataIdContext, removedColumnsContext) == -1)
						removedColumnsContext.push(dataIdContext);
				}
				else if(dataIdContext != undefined && dataIdDimension != undefined)
				{
					if(elem == spreadSheetLines && $.inArray(dataIdDimension, removedRowsDimension) == -1)
						removedRowsDimension.push(dataIdDimension);
				}
				
				$(this).remove();
			});
			
			console.log(removedColumnsContext);
			console.log(removedRowsDimension);
		};
		
		function getCellState(cell)
		{
			if(cell.hasClass("created"))
				return "created";
			else if(cell.hasClass("modified"))
				return "modified";
			else
				return "";
		}
		
		this.getDataGridStyles = function()
		{
			var result = [];
			
			element.find(".cell:not(.context)").each(function()
			{
//				console.log($(this));
				
				var cell = $(this);
				var cellIndex = cell.index();
				
				var rowContextId = cell.parents(".line").find("[data-spreadsheetbeanid]").attr('data-spreadsheetbeanid');
				var columnContextId = element.find(".SPCell:nth-child(" + (cellIndex + 1) + ")[data-spreadsheetbeanid]").attr('data-spreadsheetbeanid');
				
//				console.log(rowContextId);
//				console.log(columnContextId);
				
				result.push({
					rowContextId: rowContextId,
					columnContextId: columnContextId,
					style: {
						cellStyle: getCellStyle(cell).trim(),
						borderStyle: getCellBorderStyle(cell).trim(),
						childrenStyle: getCellChildrenStyle(cell).trim()
					}
				});
			});
			
			return result;
		}
		
		this.getColumnContext = function()
		{
			var columnContext = [];
			
			for(var i = 2; i <= getMaxNbOfColumns(); i++)
			{
				var data = {};
				data.id = 0;
				
				element.find(".context.startingContext").each(function()
				{
					var cell = $(this).parents(".line").children(".SPCell:nth-child(" + (i + 1) + ")");
					var value = elem.getCellValue(cell);
					var contextValue = elem.getCellValue($(this));
					
//					console.log(contextValue + " " + value);
					
					data[contextValue] = {
						value: value,
						style: {
							cellStyle: getCellStyle(cell).trim(),
							borderStyle: getCellBorderStyle(cell).trim(),
							childrenStyle: getCellChildrenStyle(cell).trim()
						},
						state: getCellState(cell),
						id: cell.attr('data-spreadsheetBeanId') != undefined ? cell.attr('data-spreadsheetBeanId') : "0"
					}
					
					if(cell.attr('data-spreadsheetParentId') != undefined)
						data.id = cell.attr('data-spreadsheetParentId');
					
					if(data.state != "modified" && data.state != "created")
					{
						data.state = getCellState(cell);
						
						console.log(data.state);
					}
				});
				
				data.dimension = [];
				element.find(".context:not(.startingContext)").each(function()
				{
					var dimensionData = {};
					
					var cell = $(this).parents(".line").children(".SPCell:nth-child(" + (i + 1) + ")");
					var value = elem.getCellValue(cell);
					var contextValue = elem.getCellValue($(this));
					
//					console.log(contextValue + " " + value);
					
					dimensionData.dimension = contextValue;
					dimensionData.gridElement = {
						value: value,
						style: {
								cellStyle: getCellStyle(cell).trim(),
								borderStyle: getCellBorderStyle(cell).trim(),
								childrenStyle: getCellChildrenStyle(cell).trim()
						},
						state: getCellState(cell)
					};
					dimensionData.id = cell.attr('data-spreadsheetBeanId') != undefined ? cell.attr('data-spreadsheetBeanId') : "0";
					data.dimension.push(dimensionData);
					
					if(cell.attr('data-spreadsheetParentId') != undefined)
						data.id = cell.attr('data-spreadsheetParentId');
				});
				
//				console.log(JSON.stringify(data));
				columnContext.push(data);
			}
			
//			console.log(columnContext);
			
			return columnContext;
		};
		
		this.getRowContext = function()
		{
			var rowContext = [];
			
			var startingIndex = 2 + (settings.colspan != undefined && settings.colspan.length ? 1 : 0);
			
			for(var i = startingIndex; i < element.find(".line").length; i++)
			{
				var data = {
					Retrieve: [],
					Capture: [],
					id: 0
				};
				
				var startIndex = (settings.colspan != undefined && settings.colspan.length ? 1 : 0);
				
				element.find(".line:gt(" + startIndex + ") .context.startingContext").each(function()
				{
					var cell = element.find(".line:nth-child(" + (i + 1) + ")").children(".SPCell:nth-child(" + ($(this).index() + 1) + ")");
					var value = elem.getCellValue(cell);
					var contextValue;
					
//					if(elem.getCellValue($(this)) == "")
//						contextValue = elem.getCellValue($(this).parents(".line").next().children(":nth-child(" + ($(this).index() + 1) + ")"));
//					else
						contextValue = elem.getCellValue($(this));
					
//					console.log(contextValue + " " + value);
					
					data[contextValue] = {
						value: value,
						style: {
							cellStyle: getCellStyle(cell).trim(),
							borderStyle: getCellBorderStyle(cell).trim(),
							childrenStyle: getCellChildrenStyle(cell).trim()
						},
						state: getCellState(cell),
						id: cell.attr('data-spreadsheetBeanId') != undefined ? cell.attr('data-spreadsheetBeanId') : "0"
					};
					
					if(cell.attr('data-spreadsheetParentId') != undefined)
						data.id = cell.attr('data-spreadsheetParentId');
					
					if(data.state != "modified" && data.state != "created")
						data.state = getCellState(cell);
				});
				
				data.dimension = [];
				element.find(".line:gt(" + startIndex + ") .context:not(.startingContext)").each(function()
				{
					var dimensionData = {};
					
					var cell = element.find(".line:nth-child(" + (i + 1) + ")").children(".SPCell:nth-child(" + ($(this).index() + 1) + ")");
					var value = elem.getCellValue(cell);
					var contextValue = elem.getCellValue($(this)).replace(/[_0-9]+$/, '').trim();
					
					var colspanning = undefined;
					if($(this).parents(".line").prev().children(".SPCell:nth-child(" + ($(this).index() + 1) + ")")
							.hasClass('colspan'))
					{
//						console.log("OUAIS OUAIS CA PASSE");
						element.find(".line:nth-child(2) .context:lt(" + $(this).index() + ")").each(function()
						{
//							console.log($(this));
							
							var value = elem.getCellValue($(this));
							if(value != "")
							{
								colspanning = value;
								return;
							}
						});
					}
//					console.log(colspanning);
//					console.log(contextValue + " " + value);
					
					dimensionData.dimension = contextValue;
					dimensionData.gridElement = {
						value: value,
						style: {
							cellStyle: getCellStyle(cell).trim(),
							borderStyle: getCellBorderStyle(cell).trim(),
							childrenStyle: getCellChildrenStyle(cell).trim()
						},
						state: getCellState(cell)
					};
					dimensionData.id = cell.attr('data-spreadsheetBeanId') != undefined ? cell.attr('data-spreadsheetBeanId') : "0";
					
					if(cell.attr('data-spreadsheetParentId') != undefined)
						data.id = cell.attr('data-spreadsheetParentId');
					
//					data.cellStyle = getCellStyle(cell).trim();
//					data.borderStyle = getCellBorderStyle(cell).trim();
//					data.childrenStyle = getCellChildrenStyle(cell).trim();
					
					if(colspanning == undefined)
						data.dimension.push(dimensionData);
					else
						data[colspanning].push(dimensionData);
				});
				
				rowContext.push(data);
			}
			
//			console.log(rowContext);
			
			return rowContext;
		};

		
		function getCellFromValue(value)
		{
			var cell;
			element.find(".cell").each(function()
			{
				if(elem.getCellValue($(this)) == value)
				{
					cell = $(this);
					return false;
				}
			});
			
			return cell;
		}
		
		function getMaxNbOfColumns()
		{
			var maxLineNumber = 0;
			element.find(".line").each(function()
			{
				var nbOfChildren = $(this).children(".cell").length;
				
				if(nbOfChildren > maxLineNumber)
					maxLineNumber = nbOfChildren;
			});
			// maxLineNumber -= settings.lines[0].length;
			
			return maxLineNumber;
		}
		
		function addCell(line, obj, i, shouldAnnotate)
		{
//			console.log(line);
			var cell;
			if(i != undefined)
			{
				var cellToBeHandled = line.children(".cell:nth-child(" + i + ")");
				
//				console.log(cellToBeHandled);
				
				cell = $(cellTemplate).insertAfter(cellToBeHandled);
			}
			else
				cell = $(cellTemplate).appendTo(line);
			
//			console.log(cell);
			
			cellId++;
			cell.attr('data-spreadsheetData', cellId);
			
			var index = line.index();
			var cellIndex = cell.index() - line.find(".header").length;
//			console.log(index);
			var dataLine = (settings.lines.length - 1  >= index ? ( index === -1 ?  settings.lines[settings.lines.length-1][0] : settings.lines[index][0] ): undefined);
//			console.log("CELLINDEX: " + cellIndex);
//			console.log("COLUMNS LENGTH: " + settings.columns.length);
			var dataColumn = (settings.columns.length - 1 >= cellIndex ? 
									(settings.colspan != undefined && settings.colspan.length ?
												settings.columns[cellIndex][1] : 
												( index === - 1 ? settings.columns[settings.columns.length-1][0]: settings.columns[cellIndex][0] ))
									: undefined);
//			console.log(dataColumn);
			
			if((dataLine != undefined && dataLine.data == "Data") || (dataColumn != undefined && dataColumn.data == "Data"))
			{
				$(cellSimpleValueTemplate).appendTo(cell).text("Data format");
			}
			else if(dataLine != undefined && dataLine.model != undefined && dataLine.model.length)
			{
				var select = $(cellModelTemplate).appendTo(cell);
				
				for(var i = 0; i < dataLine.model.length; i++)
					select.append("<option value='" + dataLine.model[i] + "' " + (obj == undefined || obj.data == undefined ? "" : "selected") + ">" + dataLine.model[i] + "</option>");
			}
			else
				$(cellSimpleValueTemplate).appendTo(cell).text((obj == undefined || obj.data == undefined ? "" : obj.data));
			
			
//			console.log(dataColumn);
//			console.log(dataLine);
			
			if(settings.toolbarEditable)
			{
				if(dataLine != undefined && dataLine.isEditable)
				{
//					console.log("OUAIS CA PASSE EN EDITABLE");
					cell.addClass("editable");
				}
				else if(dataColumn != undefined && dataColumn.isEditable && ((dataLine != undefined && (dataLine.formula == undefined || dataColumn.type == "Comment")) || dataLine == undefined))
					cell.addClass("editable");
			}
			
//			console.log(shouldAnnotate);
			
			if(shouldAnnotate)
				cell.addClass("created");
			
//			console.log(cell);
			
//			console.log(obj);
			
//			console.log(obj);
			
			if(obj == undefined || obj.cellStyle == undefined || obj.cellStyle == "")
			{
//				console.log(dataLine);
				
				if(dataLine != undefined && dataLine.defaultCellStyle != undefined && dataLine.defaultCellStyle != "" 
					&& dataLine.defaultCellStyle.join(" ") != "black" && dataLine.defaultCellStyle instanceof Array)
					setCellStyle(cell, dataLine.defaultCellStyle.join(" "));
				else if(dataColumn != undefined && dataColumn.defaultCellStyle != undefined && dataColumn.defaultCellStyle instanceof Array)
					setCellStyle(cell, dataColumn.defaultCellStyle.join(" "));
			}
			if(obj == undefined || obj.borderStyle == undefined || obj.borderStyle == "")
			{
				if(dataLine != undefined && dataLine.defaultBorderStyle != undefined && dataLine.defaultBorderStyle != "" 
					&& dataLine.defaultBorderStyle.join(" ") != "black" && dataLine.defaultBorderStyle instanceof Array)
					setCellBorderStyle(cell, dataLine.defaultBorderStyle.join(" "));
				else if(dataColumn != undefined && dataColumn.defaultBorderStyle != undefined && dataColumn.defaultBorderStyle instanceof Array)
					setCellBorderStyle(cell, dataColumn.defaultBorderStyle.join(" "));
			}
			if(obj == undefined || obj.childrenStyle == undefined || obj.childrenStyle == "")
			{
				if(dataLine != undefined && dataLine.defaultChildrenStyle != undefined && dataLine.defaultChildrenStyle != "" 
					&& dataLine.defaultChildrenStyle.join(" ") != "black" && dataLine.defaultChildrenStyle instanceof Array)
					setCellChildrenStyle(cell, dataLine.defaultChildrenStyle.join(" "));
				else if(dataColumn != undefined && dataColumn.defaultChildrenStyle != undefined && dataColumn.defaultChildrenStyle instanceof Array)
					setCellChildrenStyle(cell, dataColumn.defaultChildrenStyle.join(" "));
			}
			
//			var style = (obj == undefined || obj.style == undefined ? 
//							(obj == undefined || obj.Style == undefined ? "" : obj.Style) 
//							: obj.style.join(" "));
//			if(style == "")
//			{
//				if(dataLine != undefined && dataLine.styleInherit)
//					style = dataLine.style.join(" ");
//				else if(dataColumn != undefined && dataColumn.styleInherit)
//					style = dataColumn.style.join(" ");
//				else if(dataLine != undefined && dataLine.styleInherit)
//					style = dataLine.style.join(" ");
//			}
			
//			setCellStyle(cell, cellStyle);
//			setCellChildrenStyle(cell, childrenStyle);
//			if(borderStyle != undefined && borderStyle.trim() != "")
//				setCellBorderStyle(cell, borderStyle);

			
//			cell.addClass(style);
		}
		
		function addContextCell(line, obj, isLine, index, isStarting)
		{
			console.log(obj);
			
			var cell;
			if(index != undefined)
			{
				// console.log(line);
				// console.log(index + 1);
				var cellToBeHandled = line.children(".SPCell:nth-child(" + (index + 1) + ")");
				
//				console.log(cellToBeHandled);
				cell = $(cellTemplate).insertAfter(cellToBeHandled);
//				console.log(cell);
			}
			else
				cell = $(cellTemplate).appendTo(line);
		
			cellId++;
			cell.attr('data-spreadsheetData', cellId);
			
			checkHeader(cell);
		
			if(obj == undefined)
				return;
			
			if(obj.id != undefined)
				cell.attr('data-spreadsheetBeanId', obj.id);
			
			var cellIndex = cell.index();
			var lineIndex = line.index() - 1;
			
//			console.log(index + " " + lineIndex);
			
			index = cell.index() - 1;
			
//			console.log(index + " " + lineIndex);
			var data;
			if(isLine)
				data = settings.lines[index][cellIndex - 1];
			else
				data = settings.columns[index][lineIndex];

//			console.log(obj);
			
			$(cellSimpleValueTemplate).appendTo(cell).text(obj.data);
			cell.addClass("context");
			
			if(settings.toolbarEditable)
			{
				if(obj.isHeaderEditable && ((settings.colspan != undefined && settings.colspan.length && line.index() > 1)
					|| settings.colspan == undefined))
				cell.addClass("editable");
			}
			
			if(isStarting == true && (data.isStarting == undefined || data.isStarting == true) && !settings.data.hasOwnProperty("data"))
				cell.addClass("startingContext");
			
			if(obj.formula != undefined)
				cell.attr('data-formula', obj.formula);
			
//			console.log(obj);
			
			var cellStyle = (obj.cellStyle != undefined && obj.cellStyle != "" ? obj.cellStyle.join(" ") : "");
			if(data.cellStyle != undefined)
				cellStyle = data.cellStyle.join(" ");
			setCellStyle(cell, cellStyle);
			
			var borderStyle = (obj.borderStyle != undefined && obj.borderStyle != "" ? obj.borderStyle.join(" ") : "");
			if(data.borderStyle != undefined)
				borderStyle = data.borderStyle.join(" ");
			setCellBorderStyle(cell, borderStyle);
			
			var childrenStyle = (obj.childrenStyle != undefined && obj.childrenStyle != "" ? obj.childrenStyle.join(" ") : "");
			if(data.childrenStyle != undefined)
				childrenStyle = data.childrenStyle.join(" ");
			setCellChildrenStyle(cell, childrenStyle);
		}
		
		function addHeaderCell(line, isAppending)
		{
			var cell;
			if(isAppending)
				cell = $(headerTemplate).appendTo(line);
			else
				cell = $(headerTemplate).prependTo(line);
			
//			console.log(cell.index() + " " + settings.disableMovingForColumnSuperiorTo);
			
			if((settings.disableMovingForColumnSuperiorTo != undefined && cell.index() > settings.disableMovingForColumnSuperiorTo)
					|| (settings.disableMovingForColumnInferiorTo != undefined && cell.index() < settings.disableMovingForColumnInferiorTo))
				cell.find(".moveElement").remove();
			else if((settings.disableMovingForRowSuperiorTo != undefined 
					&& cell.parents(".line").index() > settings.disableMovingForRowSuperiorTo)
					|| (settings.disableMovingForRowInferiorTo != undefined 
							&& cell.parents(".line").index() < settings.disableMovingForRowInferiorTo))
				cell.find(".moveElement").remove();
			
			if(line.index() == 0)
			{
				cell.addClass("topHeader");
				
				if(((settings.disableResizingForColumnInferiorTo != undefined && cell.index() + 1 >= settings.disableResizingForColumnInferiorTo)
						|| settings.disableResizingForColumnInferiorTo == undefined))
				{
					if(settings.disableResizingForColumnInferiorTo != undefined 
							&& cell.prev().index() + 1 != settings.disableResizingForColumnInferiorTo - 1)
					{
						var leftResize = $(resizeTemplate).appendTo(cell);
						leftResize.addClass("resizeTopHeader leftResize");
					}
					var rightResize = $(resizeTemplate).appendTo(cell);
					rightResize.addClass("resizeTopHeader rightResize");
				}
			}
			else
			{
				cell.addClass("leftHeader");
				
				if((settings.disableResizingForRowInferiorTo != undefined && 
						cell.parents(".line").index() > settings.disableResizingForRowInferiorTo)
					|| settings.disableResizingForRowInferiorTo == undefined)
				{
					var topResize = $(resizeTemplate).appendTo(cell);
					var topResize = $(resizeTemplate).appendTo(cell);
					topResize.addClass("resizeLeftHeader topResize");
					var bottomResize = $(resizeTemplate).appendTo(cell);
					bottomResize.addClass("resizeLeftHeader bottomResize");
				}
			}
			
			$(cellSimpleValueTemplate).appendTo(cell).removeClass("spreadSheetElement");
		}
		
		function checkHeader(cell)
		{
			element.find(".line").each(function()
			{
				if(!$(this).children().first().hasClass("header"))
					addHeaderCell($(this), false);
			});
			
			element.find(".line:nth-child(2)").children(".cell").each(function()
			{
				if(element.find(".line:first").children().length < $(this).index() + 1)
					addHeaderCell(element.find(".line:first"), true);
			});		
			
			updateHeader();
		}
		
		function updateHeader()
		{
			element.find(".header:not(.initial)").each(function()
			{
				if($(this).parents(".line").index() == 0)
				{
					if((settings.headerColumnBegin != undefined && $(this).index() >= settings.headerColumnBegin) ||
							settings.headerColumnBegin == undefined)
					{
						$(this).children("span").first().text(letters[$(this).index() - 1 - 
						       (settings.headerColumnBegin != undefined ? (settings.headerColumnBegin - 1) : 0)]);
					}
				}
				else
				{
					if((settings.headerRowBegin != undefined && $(this).parents(".line").index() >= settings.headerRowBegin) ||
							settings.headerRowBegin == undefined)
					{
						$(this).children("span").first().text($(this).parents(".line").index() - 
								(settings.headerRowBegin != undefined ? settings.headerRowBegin - 1 : 0));
					}
				}
			});
		}
		
		function updateCellWidth()
		{
			// for(var i = 0; i < getMaxNbOfColumns() - 1; i++)
				// element.find(".SPCell:nth-child(" + ( i + 1) + ")").width(element.find(".SPCell:nth-child(" + ( i + 1) + ")").width());
			
//			element.find(".line:gt(0)").each(function()
			element.find(".line").each(function()
			{
				var finalWidth = 0;
				
				$(this).children(".SPCell").each(function()
				{
					var index = $(this).index();
					
//					console.log($(this));
//					console.log($(".line:first").children(".SPCell:nth-child(" + (index + 1) + ")").width());
					
//					console.log(window.getComputedStyle($(this).get(0)).getPropertyValue("width"), null);
//					console.log($(this).get(0).style.width);
					
					var width;
					
					if($(this).hasClass("header") && $(this).get(0).style.width == "")
					{
//						console.log($(this));
						
						var botCell = $(this).parents(".line").next().children(".SPCell:nth-child(" + (index + 1) +")");
						
//						console.log(botCell);
						
						if(botCell.length && botCell.get(0).style.width != "")
						{
							$(this).outerWidth(botCell.get(0).style.width);
							width = botCell.get(0).style.width;
						}
						else
							width = $(this).outerWidth();
					}
					else
					{
						width = element.find(".line:first").children(".SPCell:nth-child(" + (index + 1) + ")").outerWidth();
//						if($(this).get(0).style.width == "")
							$(this).outerWidth(width);
					}
//					else
					
					finalWidth += width;
					
//					$(this).width(width);
				});
				
//				console.log(finalWidth);
				$(this).width(finalWidth);
			});
		}

		function updateCellBorders()
		{
			updatingBorders = true;
			
			var mainContainer = $(".container-fluid");
			
			element.find(".selectedBorder").remove();
			
			console.log(element.find(".selectedCell"));
			element.find(".selectedCell").each(function()
			{
				var line = $(this).parents(".line");
				var previousLine = element.find(".line:nth-child(" + line.index() + ")");
				var nextLine = element.find(".line:nth-child(" + (line.index() + 2) + ")");
				
				
//				console.log(element.offset().left);
//				console.log(($(this).offset().left - 1) - parseInt(mainContainer.css("marginLeft")));
				
				var leftPos = element.find(".spreadSheetContainer").position().left + $(this).position().left;
				var topPos = element.find(".spreadSheetContainer").position().top + $(this).position().top;
//				console.log(element.position().left);
//				console.log($(this).position().left);
//				console.log(leftPos);
//				console.log(element.find(".spreadSheetContainer").position().top);
//				console.log($(this).position().top);
//				console.log(topPos);
				
				if(!line.children(".cell:nth-child(" + $(this).index() + ")").hasClass("selectedCell")
						&& $(this).position().left >= 0 && $(this).position().left <= element.width())	//	LEFT
				{
					$(selectedBorder).appendTo(element).css({
																"width": "2px",
																"height": ($(this).outerHeight() + 1),
																"left": leftPos,
																"top": topPos
															});
				}
				if(!line.children(".cell:nth-child(" + ($(this).index() + 2) + ")").hasClass("selectedCell")
						&& $(this).position().left + ($(this).outerWidth() + 1) <= element.width() && $(this).position().left + ($(this).outerWidth() + 1) >= 0)	//	RIGTH
				{
					$(selectedBorder).appendTo(element).css({
																"width": "2px",
																"height": ($(this).outerHeight() + 1),
																"left": leftPos + ($(this).outerWidth() + 1),
																"top": topPos
															});
				}
				if(!previousLine.children(".cell:nth-child(" + ($(this).index() + 1) + ")").hasClass("selectedCell"))				//	TOP
				{
					var finalLeftPos;
					var finalWidth;
					if($(this).position().left < 0)
					{
						finalLeftPos = element.find(".spreadSheetContainer").position().left;
						finalWidth = ($(this).outerWidth() + 2) - Math.abs($(this).position().left);
					}
					else
					{
						var maxWidth = element.outerWidth() - $(this).position().left;
						
//						console.log(element.width());
//						console.log(maxWidth);
						
						finalWidth = ($(this).outerWidth() + 2) <= maxWidth ? ($(this).outerWidth() + 2) : maxWidth;
						
						finalLeftPos = leftPos;
					}
					
					$(selectedBorder).appendTo(element).css({
																"width": finalWidth,
																"height": "2px",
																"left": finalLeftPos,
																"top": topPos
															});
				}
				if(!nextLine.children(".cell:nth-child(" + ($(this).index() + 1) + ")").hasClass("selectedCell"))					//	BOTTOM
				{
					var finalLeftPos;
					var finalWidth;
					if($(this).position().left < 0)
					{
						finalLeftPos = element.find(".spreadSheetContainer").position().left;
						finalWidth = ($(this).outerWidth() + 2) - Math.abs($(this).position().left);
					}
					else
					{
						var maxWidth = element.outerWidth() - $(this).position().left;
						
						finalWidth = ($(this).outerWidth() + 2) <= maxWidth ? ($(this).outerWidth() + 2) : maxWidth;
						
						finalLeftPos = leftPos;
					}
					
//					console.log(element.width());
//					console.log(($(this).offset().left - 1) - parseInt(mainContainer.css("marginLeft")));
//					console.log(maxWidth);
//					console.log(finalWidth);
					
					$(selectedBorder).appendTo(element).css({
																"width": finalWidth,
																"height": "2px",
																"left": finalLeftPos,
																"top": topPos + ($(this).height() + 1)
															});
				}
			});
			
			updatingBorders = false;
		}
		
		function updateColspans()
		{
//			console.log(settings);
//			console.log(settings.colspan == undefined || !settings.colspan.length);
			
			if(settings.colspan == undefined || !settings.colspan.length)
				return;
				
			element.find(".line:nth-child(2)").children(".cell").each(function()
			{
				elem.setCellValue($(this), "");
			});
			
			element.find(".SPCell[data-colspanDataBegin]").each(function()
			{
				var from = $(this).attr('data-colspanDataBegin');
				
				var fromElementIndex = $(this).index();
				var toElementIndex = element.find(".SPCell[data-colspanDataEnd='" + from + "']").index();
				
//				console.log(fromElementIndex + " " + toElementIndex);
				
				element.find(".line:nth-child(2)")
						.children(".SPCell")
						.slice(fromElementIndex + 1, toElementIndex + 1)
						.addClass("colspan")
						.children("span")
							.addClass(settings.colspan[parseInt(from) - 1][2][0].join(" ") + " bold");
				
				element.find(".line:nth-child(2)")
						.children(".SPCell")
						.slice(fromElementIndex + 2, toElementIndex + 1)
						.addClass("noBorderBorderLeft");
				
				element.find(".line:nth-child(3)")
						.children(".SPCell")
						.slice(fromElementIndex + 1, toElementIndex + 1)
						.children("span")
							.addClass(settings.colspan[parseInt(from) - 1][2][0].join(" "));
				
				elem.setCellValue(element.find(".line:nth-child(2)").children(".SPCell:nth-child(" + ($(this).index() + 2) + ")"),
						settings.colspan[parseInt(from) - 1][3]);
			});
		}
		
		function getMaxChildrenOfColumn()
		{
			var maxNbChildren = 0;
			for(var i = 0; i < settings.columns.length; i++)
				if(settings.columns[i].length > maxNbChildren)
					maxNbChildren = settings.columns[i].length;
			
			return maxNbChildren;
		}

		function getMaxChildrenOfRow()
		{
			var maxNbChildren = 0;
			for(var i = 0; i < settings.lines.length; i++)
				if(settings.lines[i].length > maxNbChildren && settings.lines[i][0].type != "header")
				{
//					console.log(settings.lines[i]);
					maxNbChildren = settings.lines[i].length;
				}
			
			return maxNbChildren;
		}
		
		return this;
	};
	
}(jQuery));	