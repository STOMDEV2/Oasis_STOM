/*	TEMPLATING	*/
var spreadSheetTemplate = "<div id='spreadSheetContainer'>" +
								"<div class='line'>" +
									"<div class='SPCell header initial'>" +
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
							"<div class='moveElement'>" +
							"</div>" +
						"</div>";
var resizeTemplate = "<div class='resize'>" +
						"</div>";
var cellSimpleValueTemplate = "<span class='cellValue black'>" +
								"</span>";
var cellModelTemplate = "<select class='cellValue'>" +
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
					"<div class='colorPicker-swatch white' name='white'>&nbsp;</div>" +
					"<div class='colorPicker-swatch black' name='black'>&nbsp;</div>" +
					"<div class='colorPicker-swatch blue' name='blue'>&nbsp;</div>" +
					"<div class='colorPicker-swatch sandybrown name='sandybrown'>&nbsp;</div>" +
					"<div class='colorPicker-swatch brown name='brown'>&nbsp;</div>" +
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
var selectedBorder = "<div class='selectedBorder'>" +
						"</div>";
var cursors = "<div class='cursor downCursor'>" +
				"</div>" +
				"<div class='cursor rightCursor'>" +
				"</div>";
var inputTemplate = "<input type='text'' class='spreadsheetInput' />";
var autocompleteTemplate = "<div class='autocompleteContainer'>" + 
							"</div>";
var autocompleteElementTemplate = "<span class='autocompleteElement'></span>";