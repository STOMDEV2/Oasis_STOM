/**
 * Object Spreadsheet
 * An object representing a spreadsheet.
 */
var notStyleClasses = ["cell", "SPCell", "firstCell", "selectedCell", "editable",
                       "formulaFirstCell", "formulaSelected", "tempCell", "opened",
                       "resizing", "moving", "context", "startingContext"];

var availableColors = [];
var availableAlignments = ["left", "center", "right", "justify"];
var availableFontStyles = ["bold", "underline", "italic"];
var leftButtonDown = false;

var Spreadsheet =
{
	spreadsheet: [],
	init: function(options, elem)
	{
		this.settings = $.extend({
			data: [ [ ["MyFirstCell", ["blue", "center"]] ] ],
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
				toolbarBorderBottom: true
			},
			autocomplete: undefined
		}, options);
	
	    this.elem  = elem;
	    this.$elem = $(elem);
	
	    this._build();
	
	    return this;
	},
	_build: function()
	{
		this.placeContainers();
		this.initContextualMenu();
		this.initCopyPaste();
	},
		placeContainers: function()
		{
			this.initToolbar();
			this.initAutocomplete();
			this.initColors();
			this.initCursors();
			this.$elem.append(spreadSheetTemplate);
		},
			initToolbar: function()
			{
				if(checkIfToolbarEnabled(settings.toolbarTools))
				{
					var toolbar = $(toolbarTemplate).appendTo(this.$elem);
					
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
					formula.css("margin-left", this.$elem.find("#tools").width() + 30);
				}
			},
				checkIfToolbarEnabled: function(elem)
				{
					var result = true;
					
					for(var key in elem)
						result &= elem[key];
					
					return result;
				},
			initAutocomplete: function()
			{
				if(settings.autocomplete != undefined)
					this.$elem.append(autocompleteTemplate);
			},
			initColors: function()
			{
				this.$elem.append(colors);
				
				if(availableColors.length)
					return;
				
				element.find(".colorPicker-swatch").each(function()
				{
					availableColors.push($(this).attr('name'));
				});
			},
			initCursors: function()
			{
				this.$elem.append(cursors);
			},
		initContextualMenu: function()
		{
			this.$elem.append(contextualMenu);
			
			var contextMenu = this.$elem.find(".contextMenu");

			this.$elem.on("contextmenu", ".SPCell", function(e) {
				contextMenu.css({
					display: "block",
					left: e.pageX,
					top: e.pageY
				});
				
				return false;
			});
			  
			contextMenu.on("click", "a", function() {
				contextMenu.hide();
			});
		},
		initCopyPaste: function()
		{
			this.$elem.append("<textarea id='copyPasteHandler' style='position: absolute; left: -500px; width: 400px;'></textarea>");
		},
		placeContext: function()
		{
			this.initColumns();
			this.placeRows();
		},
			initColumns: function()
			{
				for(var i = 0; i < this.getMaxChildrenOfRow(); i++)
					this.spreadsheet.push([]);
				for(var i = 0; i < this.getMaxChildrenOfColumn(); i++)
					for(var j = 0; j < this.getMaxChildrenOfRow(); j++)
						this.spreadsheet[i].push(Object.create(Speaker));
				
				if(settings.colspan != undefined && settings.colspan.length)
					this.spreadsheet.splice(0, 0, []);
			},
				getMaxChildrenOfRow: function()
				{
					var result = 0;
					for(var i = 0; i < settings.lines.length; i++)
						if(settings.lines[i].length > result)
							result = settings.lines[i].length;
					
					return result;
				},
				getMaxChildrenOfColumn: function()
				{
					var result = 0;
					for(var i = 0; i < settings.columns.length; i++)
						if(settings.columns[i].length > result)
							result = settings.columns[i].length;
					
					return result;
				},
			placeRows: function()
			{
				if(!settings.lines.length)
					return;
				
				for(var i = 0; i < settings.lines.length; i++)
				{
					this.spreadsheet.push([]);
					for(var j = 0; j < settings.lines[i].length; j++)
						this.spreadsheet[i].push(Object.create(Cell));
				}
			},
			placeColumns: function()
			{
				if(settings.colspan != undefined && settings.colspan.length)
				{
					for(var i = 0; i < settings.colspan.length; i++)
					{
						colspanId++;
						
						for(var j = 0; j < settings.colspan[i].length; j+=settings.colspan[i].length)
						{
							var fromCellId = settings.colspan[i][j];
							var toCellId = settings.colspan[i][j + 1];
							
							element.find(".line:nth-child(2)").children(".SPCell:nth-child(" + (parseInt(fromCellId) + 1) + ")")
																.attr('data-colspanDataBegin', colspanId);
							element.find(".line:nth-child(2)").children(".SPCell:nth-child(" + (parseInt(toCellId) + 1) + ")")
																.attr('data-colspanDataEnd', colspanId);
						}
					}
				}
			}
		
//		initListeners();
};
