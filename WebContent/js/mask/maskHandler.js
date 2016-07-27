function handleDropping(elementBeingDropped, target, isStarting, isHumanCalled)
{
	var dimensionName = ( elementBeingDropped.text().replace('_',' ') ),
	idParent = elementBeingDropped.parent().attr('id'),
	idDimensionName = elementBeingDropped.attr('id');

	elementBeingDropped.detach().css({top: 0,left: 0}).appendTo(target);

	if(idParent == target.attr('id')) //IF DROP ELEMENT ON CURRNET CONTAINER => NO CHANGES
		return;

	if(target.attr('id') === 'divRowContext')
	{
		if(idParent == "divColumnContext")
		{
			/*	COLUMNS	*/
			spreadSheetColumns.autoSelect(dimensionName);
			spreadSheetColumns.removeLine();
		}
		
		spreadSheetLines.autoSelect("Formule");
		spreadSheetLines.addColumn([
			                            {
			                            	data: ""
			                            },
			                            {
			                            	data: dimensionName,
			                            	isEditable: true
			                            }
		                            ], false, false, (isStarting != undefined ? isStarting : true), isHumanCalled);

		spreadSheetLines.autoSelect("Formule2");
		spreadSheetLines.addColumn([
			                            {
			                            	data: ""
			                            },
			                            {
			                            	data: dimensionName + "2",
			                            	isEditable: true
			                            }
		                            ], false, false, (isStarting != undefined ? isStarting : true), isHumanCalled);

	}
	else if(target.attr('id') === 'divColumnContext')
	{
		if(idParent == "divRowContext")
		{
			/*	LINES	*/
			spreadSheetLines.autoSelect(dimensionName);
			spreadSheetLines.removeColumn();
			spreadSheetLines.autoSelect(dimensionName + "2");
			spreadSheetLines.removeColumn();
		}
		
		spreadSheetColumns.autoSelect("Data");
		spreadSheetColumns.addLine([
			                            {
			                            	data: dimensionName,
			                            	isEditable: true
			                            }
		                            ], false, (isStarting != undefined ? isStarting : true), isHumanCalled);
	}
	else if(target.attr('id') === 'divDimensions')
	{
		if(idParent == "divRowContext")
		{
			/*	LINES	*/
			spreadSheetLines.autoSelect(dimensionName);
			spreadSheetLines.removeColumn();
			spreadSheetLines.autoSelect(dimensionName + "2");
			spreadSheetLines.removeColumn();
		}
		else if(idParent == "divColumnContext")
		{
			/*	COLUMNS	*/
			spreadSheetColumns.autoSelect(dimensionName);
			spreadSheetColumns.removeLine();
		}
	}
}

function getDimensionElementByLabel(label)
{
	console.log(label);
	console.log($(".btnDraggable").length);
	var element;
	
	$(".btnDraggable").each(function()
	{
		console.log($(this).attr('name') + " " + label);
		
		if($(this).attr('name') == label)
		{
			element = $(this);
			return false;
		}
	});
	
	return element;
}

function getInputType(input)
{
	if(input.parents(".cell").length)
	{
		var container = input.parents(".spreadSheetContainer");
		
		var cellIndex = input.parents(".cell").index();
		
		if(container.parents("#spreadsheetColumns").length)
		{
			var finalValue = "";
			
			container.find(".cell:nth-child(" + (cellIndex + 1) + ")").each(function()
			{
				var cellValue = ($(this).find("select").length ? $(this).find("select").val() : "");
				
				if(cellValue == "Retrieve" || cellValue == "Capture")
				{
					finalValue = cellValue;
					return false;
				}
			});
			
			return finalValue;
		}
		else if(container.parents("#spreadsheetLines").length)
		{
			var colspanCell = container.find(".line:nth-child(2)").children(".cell:nth-child(" + (cellIndex + 1) + ")");
			
			while(colspanCell.hasClass("noBorderBorderLeft"))
				colspanCell = colspanCell.prev();
			
			return colspanCell.find("span").text();
		}
	}
	else
	{
		var divHeader = $("#divHeader");
		
		var liActive = divHeader.find(".nav.active");
		
		return liActive.find("a").text();
	}
}

$(document).on("keydown", ".easyCapture", function()
{
	var input = $(this);
	
	setTimeout(function()
	{
		var dimension = {
				data: input.parents(".form-group").find("label").text()
		};
		var container = $(".autocompleteContainerParent").find(".autocompleteContainer");
		var data = {
			Variables: maker.getVariablesPerDimension(),
			Members: maker.getMembersPerDimension()
		};
		
		if(input.hasClass("scenarioParametersCapture"))
			delete data.Variables;
		
//		console.log(input);
//		console.log(container);
//		console.log(data);
//		console.log(dimension);
		
		input.addClass("autocompleteOn");
		
		console.log(getInputType(input));
		
		buildAutoComplete(input, container, data, dimension, (input.attr('name').indexOf("Retrieve") > -1));
	}, 100);
});
$(document).click(function()
{
	$(".autocompleteContainerParent").find(".autocompleteContainer").hide();
	
	$(".autocompleteOn").removeClass("autocompleteOn");
});
$(document).on({
					click: function()
					{
						var autocompleteElement = $(this);
						
						$(".autocompleteOn").val(autocompleteElement.text());
						$(".autocompleteOn").focus();
						
						autocompleteElement.parents(".autocompleteContainer").empty()
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
				}, ".autocompleteContainerParent .autocompleteContainer li:not(.autocompleteHeader)");


var maker;

console.log('appliCube');
console.log(sessionStorage.getItem('applicationCube'));


console.log('dimensions');
console.log(JSON.parse(localStorage.getItem('dimensions')));


console.log('cube parse');

//    console.log(JSON.parse( $.trim(sessionStorage.getItem('cube'))));

    


console.log('bottomLevelPerDimensionparse');

    console.log(JSON.parse( sessionStorage.getItem('bottomLevelPerDimension')));



    console.log('membersPerDimensionparse');
    console.log(JSON.parse(localStorage.getItem('membersPerDimension')));

    console.log('variablesPerDimension');
    console.log(JSON.parse(localStorage.getItem('variablesPerDimension')));
 




$(document).ready(function(){

	$(".autocompleteContainerParent").append(autocompleteTemplate);
	
    var u = utility();
    
    var selectors = {
            maskForm : {
                contextTable : {
                    name          : '#contextTable tbody',
                    head          : '#contextTable thead tr',
                    lines         : '#contextTable tbody tr'
                },
                nameTitle         : '#nameTitle',
                inputs : {
                    input         : '#nameMask', // appelé comme ça parce qu'à la base un seul input sur la page qui était pour le nom du masque, à changer après
                    formula       : '#inputFormula',
                    note          : '#inputNote',
                    addRow        : '#inputAddRow',
                    historicCols  : '#inputNbHistoricColumns',
                    phasingCols   : '#inputNbPhasingColumns'
                },
                blocks            : {
                    dimensions        : '#divDimensions',                 // faire un seul objet block pour tous les blocs de la page done, s'assurer 
                    rowContext        : '#divRowContext',                 // de leur utilisation
                    columnContext     : '#divColumnContext',
                    header            : '#divHeader',
                    headerPairR       : '#pairR',
                    headerImpairR     : '#impairR',
                    headerPairC       : '#pairC',
                    headerImpairC     : '#impairC',
                    forms             : {
                        retrieve      : '#formRetrieve_',
                        capture       : '#formCapture_'
                    }
                },
                tabs              : {
                    retrieveHeader    : '#tabRetrieveHeader',
                    captureHeader      : '#tabCaptureHeader'
                },
                dragNDrop : {
                    elements      : '.btnDraggable',
                    drop          : '.dimensionContainer',
                    container     : '#dragArea'
                },
                buttons           : {
                    save          : '#btnSaveMask'
                }
            }

    },
    contextTableMaker = function() {
        
//    	console.log(mask);
//       	console.log(mask == undefined);
    	
        var appliCube,
            dimensions,
            cube,
            membersPerDimension,
            url,
            variablesPerDimension, 
            mask,
            maskPreview,
            grids,
            overwrite,
            gridValues,
            /*initSpreadSheet,*/
            readOnly = false;

        return {
            autoSave            : (typeof mask != 'undefined' && mask.AutoSave != undefined ? mask.AutoSave : false),
            duration            : (typeof mask != 'undefined' && mask.Duration != undefined ? mask.Duration : -1),
            actionModalGrid     : false,
          	that                : this, 
            selectors           : selectors.maskForm,
            getAppliCube        : function ( ) {
                return this.appliCube;
            },
            setAppliCube        : function ( appliCube ) {
                this.appliCube = appliCube;
            },
            getMaskPreview : function ( ) {
                return this.maskPreview;
            },
            setMaskPreview : function ( maskPreview ) {
                this.maskPreview = maskPreview;
            },
            /*isSpreadSheet : function ( ) {
                return this.initSpreadSheet;
            },
            setIsSpreadSheet : function ( initSpreadSheet ) {
                this.initSpreadSheet = initSpreadSheet;
            },*/
            getDimensions : function () {
                return this.dimensions;
            },
            setDimensions : function ( dimensions ) {
                this.dimensions = dimensions;
            },
            setAutoSave : function ( autoSave ) {
                this.autoSave = autoSave;
            },
            getAutoSave : function () {
                return this.autoSave;
            },
            setDuration : function ( duration ) {
                this.duration = duration;
            },
            getDuration : function () {
                return this.duration;
            },
            getCube : function () {
                return this.cube;
            },
            setCube : function ( cube ) {
                this.cube = cube;
            },
            getMembersPerDimension : function () {
                return this.membersPerDimension;
            },
            setMembersPerDimension : function ( membersPerDimension ) {
                this.membersPerDimension = membersPerDimension;
            },
            getURL : function () {
                return this.url;
            },
            setURL : function ( url ) {
                this.url = url;
            },
            getMask :  function () {
                return this.mask;
            },
            setMask : function ( mask ) {
                this.mask = mask;
            }, 
            getGrids : function ( ) {
                return this.grid;
            },
            setGrids : function ( grid ) { 
                this.grid = grid;
            },
            getReadOnly : function ( ) {
                return this.readOnly;
            },
            setReadOnly : function ( readOnly ) {
                this.readOnly = readOnly;
            },
            getGridValues : function ( ) {
                return this.gridValues;
            },
            setGridValues : function ( gridValues ) {
                this.gridValues = gridValues;
            },
            getVariablesPerDimension : function ( ) {
                return this.variablesPerDimension;
            },
            setVariablesPerDimension : function ( variablesPerDimension ) {
                this.variablesPerDimension = variablesPerDimension;
            },
            getDimensionsButton : function(  )/*data*/{

                console.log(dimensions);
                
                var buttonId;

                    /*dimensions = data.dimensions;*/

                for(var i = 0 , cpt = this.dimensions.length ; i < cpt ; i+=1 ) {


                    buttonId = this.dimensions[i];
                    buttonId = buttonId.replace(' ','_');
                    
                    $(this.selectors.blocks.dimensions).
                    append('<button id="' + buttonId + '" ' + (readOnly ? 'disabled="disabled"' : '') + ' class="' + (readOnly ? "noDrag " : "") + ' btnDraggable btn btn-default dimensionButton" name ="' + this.dimensions[i] + '">' + this.dimensions[i] + '</button>');
                    
                }

//                $(this.selectors.dragNDrop.elements).css('z-index','100');

                

            },
            checkUnloading : function () {
                 e = e || window.event;

                if($(".modified").length || $(".created").length)
                {
                    // For IE and Firefox prior to version 4
                    if (e)
                        e.returnValue = 'Your have unsaved data. Please save it before leavign the page.';
          
                    // For Safari
                    return  'Your have unsaved data. Please save it before leavign the page.';
                }
            },
            reloadData : function () {

                var mask = this.mask;

                $("#nameMask").val(mask.NameMask);

                console.log('spreadsheetColumns');
                console.log(spreadsheetColumns);

                spreadSheetColumns.updateData({
                    columnContext : maker.getMask().ColumnContext
                });

                spreadSheetLines.updateData({
                    rowContext : maker.getMask().RowContext
                });

                spreadSheetLines.placeData();
                spreadSheetColumns.placeData();

                spreadSheetColumns.deselectAll();
                spreadSheetLines.deselectAll();

                if( typeof mask !== "undefined" && typeof mask.HeaderContext !== "undefined")
                {
                    for(var i = 0, cpt = mask.HeaderContext.length; i <cpt; i += 1 ) {

                        var idName = mask.HeaderContext[i].Dimension.Name.replace(' ','_');

                        if(mask.HeaderContext[i].Retrieve) {    
                            $('#headerRetrieve_' + idName).val(mask.HeaderContext[i].Value);
                        }
                        else
                        {
                            $('#headerCapture_'+ idName ).val(mask.HeaderContext[i].Value);
                        }
                    }               
                }
            },
            initDimensions : function ( ) {
                //remettre this.mask
                var maskObject = maker.getMask();

                
                if(maskObject.ColumnContext.length)
                {
                    var columnContextContainer = $("#divColumnContext");
                    var dimensions = maskObject.ColumnContext[0].ColumnsDimensions;

                    if(dimensions.length) {
                        for(var i = 0; i < dimensions.length; i++) {
                            var dimensionName = dimensions[i].Dimension.Name;

                            var element = getDimensionElementByLabel(dimensionName);
                            console.log(element);
                            handleDropping(element, columnContextContainer, true);
                        }    
                    }
                    
                }

                if(maskObject.RowContext.length)
                {
                    var rowContextContainer = $("#divRowContext");
                    var dimensions = maskObject.RowContext[0].RowDimensions;
                    var dimensionNames = [];

                    if(dimensions.length) {
                        for(var i = 0; i < dimensions.length; i++) {
                            var dimensionName = dimensions[i].Dimension.Name;

                            if($.inArray(dimensionName, dimensionNames) > -1)
                                continue;

                            var element = getDimensionElementByLabel(dimensionName);
                            console.log(element + 'elt');
                            console.log(dimensionName + " dimensionName");

                            if(element)
                                handleDropping(element, rowContextContainer, true);

                            dimensionNames.push(dimensionName);
                        }    
                    }
                    
                }


                maker.organizeHeader();

            },
            makeHeader: function (  ) {

                var that = this;

                $(this.selectors.blocks.dimensions).find('button').each( function ( index, button ) {

                    var id = $(button).attr('id'),
                        name = $(button).text(), // le nom de la dimension
                        source;

                       
                       
                    if( index%2 === 0 ) {

                        $(that.selectors.blocks.headerPairR).append(
                            '<div id="formRetrieve_' + id + '" class="form-horizontal formCapture">'
                        +       '<div class="form-group">'
                        +           '<label for="headerRetrieve_'+ id + '" class="col-md-offset-2 col-md-3 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" ' + (that.getReadOnly() ? "disabled=\"disabled\"" : "") + ' class="form-control easyCapture" id="headerRetrieve_' + id +'" name="headerRetrieve_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        $(that.selectors.blocks.headerPairC).append(
                            '<div id="formCapture_' + id + '" class="form-horizontal formCapture">'
                        +       '<div class="form-group">'
                        +           '<label for="headerCapture_'+ id + '" class="col-md-offset-2 col-md-3 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" ' + (that.getReadOnly()  ? "disabled=\"disabled\"" : "") + ' class="form-control easyCapture" id="headerCapture_' + id +'" name="headerCapture_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                    } else {

                        $(that.selectors.blocks.headerImpairR).append(
                            '<div id="formRetrieve_' + id + '" class="form-horizontal formCapture">'
                        +       '<div class="form-group">'
                        +           '<label for="headerRetrieve_'+ id + '" class="col-md-offset-3 col-md-3 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" ' + (that.getReadOnly()  ? "disabled=\"disabled\"" : "") + ' class="form-control easyCapture" id="headerRetrieve_' + id +'" name="headerRetrieve_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        $(that.selectors.blocks.headerImpairC).append(
                            '<div id="formCapture_' + id + '" class="form-horizontal formCapture">'
                        +       '<div class="form-group">'
                        +           '<label for="headerCapture_'+ id + '" class="col-md-offset-3 col-md-3 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" ' + (that.getReadOnly()  ? "disabled=\"disabled\"" : "") + ' class="form-control easyCapture" id="headerCapture_' + id +'" name="headerCapture_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');
                    }
                });
                

            },
            organizeHeader : function() {

                var elementsR = $.merge( $('#pairR').children().detach(),  $('#impairR').children().detach()).toArray(),
                    elementsC = $.merge( $('#pairC').children().detach(),  $('#impairC').children().detach()).toArray();


                if( !$('#divDimensions').children('button').length )
                    $('#divDimensions').css({
                        height : '100%',
                        width  : '100%' 
                    });
                

                $('#tabRetrieveHeader .formCapture').each( function ( index , form ){

                    var idDimensionName = $(form).attr('id').substring( idDimensionName.indexOf('_'), idDimensionName.length);

                    if( !$('#divDimensions').children(idDimensionName) ) {
                        $('#formRetrieve_' + idDimensionName).remove();
                        $('#formCapture_' + idDimensionName).remove();
                    }
                });


                $(this.selectors.blocks.dimensions).find('button').each( function ( index, button ) {
                    
                    var id = $(button).attr('id'),
                        appendToR = index%2 === 0 ? $('#pairR') : $('#impairR'),
                        appendToC = index%2 === 0 ? $('#pairC') : $('#impairC'),
                        // indexFormToAddR = elementsR.indexOf($('#formRetrieve_' + id).get(0)),
                        indexForm;
                        /*indexFormToAddC;*/


                        for(var i = 0, cpt = elementsR.length; i < cpt; i += 1) {

                            if( $( elementsR[i] ).attr('id') === 'formRetrieve_' + id  ) {
                                indexForm = i;
                                break;
                            }
                        }

                       /*for(var i = 0, cpt = elementsR.length; i < cpt; i += 1) {

                            if( $( elementsC[i] ).attr('id') === 'formCapture_' + id  ) {
                                indexFormToAddC = i;
                                break;
                            }
                        }*/

                        var formToAddR = $( elementsR[indexForm] ),
                            formToAddC = $( elementsC[indexForm] );

                        if( index % 2 === 0) {
                            if( formToAddR.find('label').hasClass('col-md-offset-3') )
                                formToAddR.find('label').removeClass('col-md-offset-3').addClass('col-md-offset-2');
                            
                            if( formToAddC.find('label').hasClass('col-md-offset-3') )
                                formToAddC.find('label').removeClass('col-md-offset-3').addClass('col-md-offset-2');
                        } else {
                            
                            if( formToAddR.find('label').hasClass('col-md-offset-2') )
                                formToAddR.find('label').removeClass('col-md-offset-2').addClass('col-md-offset-3');

                            if( formToAddC.find('label').hasClass('col-md-offset-2') )
                                formToAddC.find('label').removeClass('col-md-offset-2').addClass('col-md-offset-3');
                        }

                        $(appendToR).append( formToAddR );
                        $(appendToC).append( formToAddC );

                });

                
            },
            enableDimensionsDragNDrop : function (  ) {

                var that = this;

                $(this.selectors.dragNDrop.elements + ":not(.noDrag)").draggable({
                    appendTo : this.selectors.dragNDrop.drop,
                    revert: "invalid",
                    scope : "dimensions",
                    snap : this.selectors.dragNDrop.drop,
                    containment: this.selectors.dragNDrop.container,
                    cancel : false,
                    clone : false
                });

              
                // à variabiliser entièrement
                $(this.selectors.dragNDrop.drop).droppable({ 
                  accept: this.selectors.dragNDrop.elements,
                  scope : "dimensions",
                  over : function(event,ui) {

                    $(this).css('z-index', '100');
                  }
                }).
                on( 'drop', function( event, ui ) {
                    
                    var dropped = ui.draggable,
                        dimensionName = $(ui.draggable).text().replace('_',' '),
                        droppedOn = $(this),
                        idParent = $(dropped).parent().attr('id'),
                        idDimensionName   = $(dropped).attr('id');
                    
                   	var idParent = $(ui.draggable).parent().attr('id');
                   	var idDimensionName = $(ui.draggable).attr('id');
                   	var dimensionName = $(ui.draggable).text().replace('_',' ');
                   	
                    if(droppedOn.attr('id') !== "divDimensions")
                   	    droppedOn.css({
                   		   "height": "100%",
                   		   "display": "inline-block"
                   	    });

                   	console.log($(dropped).parent());
                   	
                   	if($(dropped).parent().children().length - 1)
	                   	$(dropped).parent().css({
                            "width" : "100%",
	                   		"display": "inline-block"
	                   	});
                   	else
	                   	$(dropped).parent().css({
	                   		"width": "100%",
	                   		"height": "100%",
	                   		"display": "block"
	                   	});
                    
                    handleDropping($(ui.draggable), $(this), undefined, event.originalEvent !== undefined);

                    if( $(this).attr('id') === 'divDimensions') {
                        if(idParent != 'divDimensions') {

                            var nbChildsPairR   = $(that.selectors.blocks.headerPairR).children().length,
                                nbChildsImpairR = $(that.selectors.blocks.headerImpairR).children().length;

                            if( (nbChildsPairR === 0 && nbChildsImpairR === 0) || (nbChildsImpairR === nbChildsPairR) || (nbChildsImpairR > nbChildsPairR )) {
                                $(that.selectors.blocks.headerPairR).append(
                                    '<div id="formRetrieve_' + idDimensionName + '" class="form-horizontal formCapture">'
                                +       '<div class="form-group">'
                                +           '<label for="headerRetrieve_'+ idDimensionName + '" class="col-md-offset-2 col-md-3 control-label">' + dimensionName + '</label>'
                                +           '<div class="col-md-3">'
                                +               '<input type="text" class="form-control easyCapture" id="_headerRetrieve' + idDimensionName +'" name="headerRetrieve_' + idDimensionName + '" placeholder="var">'
                                +           '</div>'
                                +       '</div>'
                                +   '</div>');

                                $(that.selectors.blocks.headerPairC).append(
                                    '<div id="formCapture_' + idDimensionName + '" class="form-horizontal formCapture">'
                                +       '<div class="form-group">'
                                +           '<label for="headerCapture_'+ idDimensionName + '" class="col-md-offset-2 col-md-3 control-label">' + dimensionName + '</label>'
                                +           '<div class="col-md-3">'
                                +               '<input type="text" class="form-control easyCapture" id="headerCapture' + idDimensionName +'" name="headerCapture_' + idDimensionName + '" placeholder="var">'
                                +           '</div>'
                                +       '</div>'
                                +   '</div>');


                            } else {

                                $(that.selectors.blocks.headerImpairR).append(
                                    '<div id="formRetrieve_' + idDimensionName + '" class="form-horizontal formCapture">'
                                +       '<div class="form-group">'
                                +           '<label for="headerRetrieve_'+ idDimensionName + '" class="col-md-offset-3 col-md-3 control-label">' + dimensionName + '</label>'
                                +           '<div class="col-md-3">'
                                +               '<input type="text" class="form-control easyCapture" id="headerRetrieve_' + idDimensionName +'" name="headerRetrieve_' + idDimensionName + '" placeholder="var">'
                                +           '</div>'
                                +       '</div>'
                                +   '</div>');

                                $(that.selectors.blocks.headerImpairC).append(
                                    '<div id="formCapture_' + idDimensionName + '" class="form-horizontal formCapture">'
                                +       '<div class="form-group">'
                                +           '<label for="headerCapture_'+ idDimensionName + '" class="col-md-offset-3 col-md-3 control-label">' + dimensionName + '</label>'
                                +           '<div class="col-md-3">'
                                +               '<input type="text" class="form-control easyCapture" id="headerCapture_' + idDimensionName +'" name="headerCapture_' + idDimensionName + '" placeholder="var">'
                                +           '</div>'
                                +       '</div>'
                                +   '</div>');
                            }
                        } 
                    } else {
                        $(that.selectors.blocks.forms.retrieve + idDimensionName).remove();
                        $(that.selectors.blocks.forms.capture + idDimensionName).remove();

                        maker.organizeHeader();
                    }

                    $(dropped).removeAttr('style');
                });
            },
            sendMaskObject : function ( maskObjectJSON ) {
                /*var maskObjectJSON = JSON.stringify(maskObject);*/
                console.log('maskObjectJSON');
                console.log(maskObjectJSON);

                $.ajax({
                    url: maker.getURL(),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                    	mask: maskObjectJSON
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
                    success: function ( data ) {
                    	
                    	console.log(data);

                        
                        $('#nameMask').parent().removeClass('has-error');

                        $(maker.selectors.buttons.save).attr('disabled', false);
                    	
                        if( data.message && data.id) {
                            
                            u.notify({
                                type	: 'success',
                                key		: 'maskSaved',
                                pckg	: 'mask'
                            });
                            
                            maker.setURL( 'modifyMask?id=' + data.id);

                            window.onbeforeunload = null;

                            if(window.location.href.indexOf('#modify') < 0) {
                                window.location.href += '#modify?id=' + data.id;
                                $('#saveCreate').addClass('hide');
                                $('#saveModify').removeClass('hide').addClass('show');
                                maker.setMask( JSON.parse(data.mask) );
                            
                            } else if ( idParameter != data.id) {
                                window.location.href = window.location.href.substring(0,window.location.href.indexOf('?'));
                                window.location.href += '?id=' + data.id;
                                maker.setMask( JSON.parse( data.mask ));
                                maker.setGrids( JSON.parse( data.grids ));

                                $('#nameMask').val(maker.getMask().NameMask);
                            }

                            if(maker.getMask())
                                u.notify({
                                    message     : 'You\'re currently viewing mask : "' + maker.getMask().NameMask + '"',
                                    type        : 'information',
                                    shouldGet   : false
                                });


                        } else if(data.error) {


                            u.notify({
                                message 	: data.error,
                                type    	: 'error',
                                shouldGet	: false
                            });

                            if(maker.getMask())
                                u.notify({
                                    message     : 'You\'re currently viewing mask : "' + maker.getMask().NameMask + '"',
                                    type        : 'information',
                                    shouldGet   : false
                                });
                            
                            $(maker.selectors.buttons.save).attr('disabled', false);

                            //factoriser
                            /*$('#isAutoSave').bootstrapSwitch('state', false);
                            $('#divSaveInterval').hide();
                            $('#inputSaveInterval').removeClass('has-success').val('');
                            clearInterval(intervalID);
                            $('#submitSaveInterval').removeClass('btn-success').addClass('btn-default');*/

                            if(data.errorMaskName)
                                $('#nameMask').parent().addClass('has-error');
                        }
                    },
                    error:function(data,status,er) {

                        u.notify({
                            message 	: er,
                            type    	: 'error',
                            shouldGet	: false
                        });
                        
                        console.log("error: "+data+" status: "+status+" er:"+er);
                        
                        $(that.selectors.buttons.save).removeAttr('disabled');
                    }
                });

                return maskObjectJSON;
            },
            getHeaderContext : function ( ) {
                var headerContext = [],
                    cube = maker.getCube(),
                    idCube = cube.Id;

                $(maker.selectors.tabs.retrieveHeader + ' .well .form-group').each( function(index, form ){
                    var dimensionName = $(form).children('label').html(),
                        value = $(form).children().find('input.easyCapture').val(),
                        o = {};

                    if(value === "")
                        return;

                    if(idCube !== undefined)
                        o.idCube = idCube;

                    o.dimension = dimensionName;
                    o.value = value;
                    o.retrieve = true;

                    headerContext.push(o);

                });

                $(maker.selectors.tabs.captureHeader + ' .well .form-group').each( function(index, form ){
                    var dimensionName = $(form).children('label').html(),
                        value = $(form).children().find('input.easyCapture').val(),
                        o = {};

                    if(value === "")
                        return;
                    
                    if(idCube !== undefined)
                        o.idCube = idCube;

                    o.dimension = dimensionName;
                    o.value = value;
                    o.retrieve = false;

                    headerContext.push(o);

                });

                console.log('headerContext');
                console.log(headerContext);

                return headerContext;

            },
            getModifiedMask: function()
            {
            	var modifiedGridsIds = [];
            	
            	$(".modifiedMaskCheckbox:checked").each(function()
            	{
            		modifiedGridsIds.push($(this).attr('id'));
            	});
            	
            	return modifiedGridsIds;
            },
            shouldOverwrite: function()
            {
            	return window.location.href.indexOf('#modify') > 0 && $(".overwriteMask").is(":checked");
            },
            getNewMaskName: function()
            {
            	return $("#modifiedMaskName").val();
            },
            shouldDropMask: function()
            {
            	return $(".dropMask").is(":checked");
            },
            getMaskObject : function ( isSave ) {
                if ( isSave ) {
                    var maskObject = {
                        mask                    : {
                            nameMask: $('#nameMask').val(),
                            autoSave: maker.getAutoSave(),
                            duration: maker.getDuration()
                        },
                        rowContext              : spreadSheetLines.getRowContext(),
                        columnContext           : spreadSheetColumns.getColumnContext(),
                        headerContext           : maker.getHeaderContext(),
                        removedColumnContext    : spreadSheetColumns.getRemovedColumnsContext(),
                        removedColumnDimension  : spreadSheetColumns.getRemovedColumnsDimension(),
                        removedRowContext       : spreadSheetLines.getRemovedRowsContext(),
                        removedRowDimension     : spreadSheetLines.getRemovedRowsDimension(),
                        shouldOverwrite         : maker.shouldOverwrite(),
                        modifiedGrids           : maker.getModifiedMask(),
                        newMaskName             : maker.getNewMaskName(),
                        shouldDropMask          : maker.shouldDropMask()
                    };
                } else {
                    var maskObject = {
                        nameMask                : $('#nameMask').val(),
                        idCube                  : this.getCube().Id,
                        rowContext              : spreadSheetLines.getRowContext(),
                        columnContext           : spreadSheetColumns.getColumnContext(),
                        headerContext           : maker.getHeaderContext() 
                    };
                }
                

                return maskObject;
            },
            saveMask: function (  )
            {
                
                var nameMask = $('#nameMask').val(),
                    maskStringified,
                    maskObject = this.getMaskObject( true );

                if(maskObject.mask.nameMask === "") {
                    
                    u.notify({
                        key 	: 'erroNoMaskName',
                        type    : 'error',
                        pckg	: 'mask'
                    });

                    return;
                }
                
                $(maker.selectors.buttons.save).attr('disabled', true);
                
                
                maskStringified = JSON.stringify( maskObject );

                console.log('maskObject');
                console.log(maskObject);

                console.log('maskStringified');
                console.log(maskStringified);

               
                return maker.sendMaskObject(maskStringified);
            },
            updateFormula : function () {
                console.log("GJPER GJPE RJKGPEJK RPOGKEP");
    
                spreadSheet.find(".context[data-formula]").each(function()
                {
                    var formulaCell = $(this);
                    
            //      console.log($(this).attr('data-formula'));
                    
                    var formula = $(this).attr('data-formula');
                    formula = formula.replace("=", "").split(/\s/g);
                    
                    for(var i = 0; i < formula.length; i++)
                    {
                        if(formula[i].indexOf("SUM") > -1)
                        {
                            if($(this).index() == 1)
                            {
                                var tmpValue = formula[i].replace("SUM(", "").replace(")", "").replace("-", " ").split(" ");
                                
                                var firstCoord = tmpValue[0];
                                var secondCoord = tmpValue[1];
                                
                                var firstLetter;
                                var firstNumber;
                                var secondNumber;
                                
                                for(var j = 0; j < firstCoord.length; j++)
                                    if(!isNaN(firstCoord.substring(j, firstCoord.length)))
                                    {
                                        firstLetter = firstCoord.substring(0, j);
                                        firstNumber = parseInt(firstCoord.substring(j, firstCoord.length)) + 2;
                                        break;
                                    }
                                
                                for(var j = 0; j < secondCoord.length; j++)
                                    if(!isNaN(secondCoord.substring(j, secondCoord.length)))
                                    {
                                        secondNumber = parseInt(secondCoord.substring(j, secondCoord.length)) + 2;
                                        break;
                                    }
                                
            //                  console.log(firstCoord);
            //                  console.log(firstLetter);
            //                  console.log(secondLetter);
            //                  console.log(letters);
            //                  
            //                  var firstLetterIndex = $.inArray(firstLetter, letters);
            //                  var secondLetterIndex = $.inArray(secondLetter, letters);

            //                  console.log(firstLetterIndex);
            //                  console.log(secondLetterIndex);
                                
                                formula[i] = "( ";
                                for(var j = firstNumber; j <= secondNumber; j++)
                                    formula[i] += firstLetter + j + " + ";
                                formula[i] = formula[i].substring(0, formula[i].length - " + ".length);
                                formula[i] += " )";
                                
            //                  console.log(formula[i]);
                            }
                            else
                            {
                                var tmpValue = formula[i].replace("SUM(", "").replace(")", "").replace("-", " ").split(" ");
                                
                                var firstCoord = tmpValue[0];
                                var secondCoord = tmpValue[1];
                                
                                var firstLetter;
                                var secondLetter;
                                var number;
                                
                                for(var j = 0; j < firstCoord.length; j++)
                                    if(!isNaN(firstCoord.substring(j, firstCoord.length)))
                                    {
                                        firstLetter = firstCoord.substring(0, j);
                                        number = firstCoord.substring(j, firstCoord.length);
                                        break;
                                    }
                                
                                for(var j = 0; j < secondCoord.length; j++)
                                    if(!isNaN(secondCoord.substring(j, secondCoord.length)))
                                    {
                                        secondLetter = secondCoord.substring(0, j);
                                        break;
                                    }
                                
            //                  console.log(firstCoord);
            //                  console.log(firstLetter);
            //                  console.log(secondLetter);
            //                  console.log(letters);
            //                  
                                var firstLetterIndex = $.inArray(firstLetter, letters);
                                var secondLetterIndex = $.inArray(secondLetter, letters);

            //                  console.log(firstLetterIndex);
            //                  console.log(secondLetterIndex);
                                
                                formula[i] = "( ";
                                for(var j = firstLetterIndex; j <= secondLetterIndex; j++)
                                    formula[i] += letters[j] + number + " + ";
                                formula[i] = formula[i].substring(0, formula[i].length - " + ".length);
                                formula[i] += " )";
                                
            //                  console.log(formula[i]);
                            }
                        }
                    }
                    
                    
                    formula = formula.join(" ");
                    console.log(formula);
                    formula = formula.split(" ");
                    console.log(formula);
                    
                    
                    
                    if($(this).index() == 1)
                    {
                        formulaCell.parents(".line").children().each(function()
                        {
                            var cell = $(this);
                                            
                            if(cell.hasClass("header") || cell.hasClass("context"))
                                return true;
                            
                            console.log(columns);
                            console.log(cell.index());
                            var columnData = columns[cell.index() - 1][0];
                            if(columnData.type == "Comment")
                                return;
                            
                            var finalValue = "";

                            for(var i = 0; i < formula.length; i++)
                            {
            //                  console.log(formula[i]);
                                var baseCell = spreadSheet.getCellByCoordiantes(formula[i]);
            //                  console.log(baseCell);
                                
                                var number;
                                
                                if(baseCell == undefined)
                                {
                                    finalValue += formula[i];
                                    continue;
                                }
                                else if(baseCell == 99999999)
                                {
                                    var itsok = false;
                                    for(var j = 0; j < formula[i].length; j++)
                                        if(!isNaN(formula[i].substring(j, formula[i].length)))
                                        {
                                            if(j == 0)
                                            {
                                                itsok = true;
                                                finalValue += formula[i];
                                                break;
                                            }
                                            
                                            number = formula[i].substring(j, formula[i].length);
                                            break;
                                        }
                                    
                                    if(itsok)
                                        continue;
                                }
                                else
                                {
            //                      console.log(formula[i]);
                                    for(var j = 0; j < formula[i].length; j++)
                                        if(!isNaN(formula[i].substring(j, formula[i].length)))
                                        {
                                            number = formula[i].substring(j, formula[i].length);
                                            break;
                                        }
                                }
                                
            //                  console.log(number);
            //                  console.log(baseCell.index());
                                var cell = $(".line:nth-child(" + number + ")").children(".SPCell:nth-child(" + (cell.index() + 1) + ")");
                                
            //                  console.log(formula[i]);
            //                  console.log(cell);
            //                  console.log(spreadSheet.getCellValue(cell));
                                finalValue += (spreadSheet.getCellValue(cell) == "" ? 0 : spreadSheet.getCellValue(cell));
            //                  formula[i] = spreadSheet.getCellValue(cell);
                            }
                            
            //              var finalValue;
            //              console.log(finalValue);
                            try
                            {
                                finalValue = eval(finalValue);
                            }
                            catch(ex)
                            {
            //                  console.log(ex);
                            }
                            
            //              console.log(formulaCell);
            //              console.log(finalValue);
            //              console.log(formula.join(" "));
                            spreadSheet.setCellValue($(this), finalValue, true);
                        });
                    }
                    else
                    {
                        spreadSheet.find(".line").each(function()
                        {
                            var finalValue = "";
                            
                            for(var i = 0; i < formula.length; i++)
                            {
            //                  console.log(formula[i]);
                                var baseCell = spreadSheet.getCellByCoordiantes(formula[i]);
            //                  console.log(baseCell);
                                if(baseCell == undefined)
                                {
                                    finalValue += formula[i];
                                    continue;
                                }
                                else if(baseCell == 99999999)
                                {
                                    finalValue += formula[i];
                                    continue;
                                }
                                
            //                  console.log(baseCell.index());
                                var cell = $(this).children(".SPCell:nth-child(" + (baseCell.index() + 1) + ")");
                                
            //                  console.log(cell);
                                
                                if(cell.hasClass("header") || cell.hasClass("context"))
                                    break;
                                
            //                  console.log(formula[i]);
            //                  console.log(cell);
            //                  console.log(spreadSheet.getCellValue(cell));
                                finalValue += (spreadSheet.getCellValue(cell) == "" ? 0 : spreadSheet.getCellValue(cell));
                                //formula[i] = spreadSheet.getCellValue(cell);
                            }
                            
                            var finalValue;
                            try
                            {
                                finalValue = eval(finalValue);
                            }
                            catch(ex)
                            {
            //                  console.log(ex);
                            }
                            
            //              console.log(formulaCell);
            //              console.log(finalValue);
            //              console.log(formula.join(" "));
                            var cellToModify = $(this).children(".SPCell:nth-child(" + (formulaCell.index() + 1) + ")");
                            if(cellToModify.hasClass("header") || cellToModify.hasClass("context"))
                                return;
                            
                            spreadSheet.setCellValue(cellToModify, finalValue, true);
                        });
                    }
                });
            },
            initGridPreview : function ( ) {

                var gridValues,
                    that = this;

               
                $.ajax({
                    url: 'previewGrid',
                    type: 'POST',
                    dataType: 'json',
                    data : {
                        mask : JSON.stringify( that.getMaskObject( false ) )
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
                    success: function (data) {
                        if(data.mask) {
                            if(data.gridValues)
                                that.setGridValues( JSON.parse( data.gridValues ) );
                            

                            console.log('data.mask');
                            console.log(data.mask);

                            that.setMaskPreview( JSON.parse( data.mask ) );
                            that.buildPreview( that.getMaskPreview() );

                        if(data.error)
                                u.notify({
                                    message   : data.error,
                                    type      : 'error',
                                    shouldGet : false
                                });

                        } else {
                            u.notify({
                                message   : 'Something wrong happen',
                                type      : 'error',
                                shouldGet : false
                            });
                        }

        
                        /*that.setIsSpreadSheet(true);*/

                    },
                    error:function(data,status,er) {

                        u.notify({
                            message     : er,
                            type        : 'error',
                            shouldGet   : false
                        });

                        return false;
                    }

                });

                
                
                
            },
            buildPreview : function ( maskPreview ) {

                var mask = maskPreview,
                    lines = [],
                    columns = [],
                    that = this;

                if(mask.ColumnContext) { //controler en back mieux
                    for(var i = 0; i < mask.ColumnContext.length; i++)
                        columns.push([{
                            id: mask.ColumnContext[i].Id,
                            data: mask.ColumnContext[i].Title.Value,
                            type: mask.ColumnContext[i].Type.Value,
                            
                            cellStyle: (mask.ColumnContext[i].Title.Style.CellStyle != null) ? mask.ColumnContext[i].Title.Style.CellStyle.split(" ") : "",
                            childrenStyle: (mask.ColumnContext[i].Title.Style.ChildrenStyle != null) ? mask.ColumnContext[i].Title.Style.ChildrenStyle.split(" ") : "",
                            borderStyle: (mask.ColumnContext[i].Title.Style.BorderStyle != null) ? mask.ColumnContext[i].Title.Style.BorderStyle.split(" ") : "",
                            
                            defaultCellStyle: (mask.ColumnContext[i].DefaultStyle.Style.CellStyle != null) ? mask.ColumnContext[i].DefaultStyle.Style.CellStyle.split(" ") : "",
                            defaultChildrenStyle: (mask.ColumnContext[i].DefaultStyle.Style.ChildrenStyle != null) ? mask.ColumnContext[i].DefaultStyle.Style.ChildrenStyle.split(" ") : "",
                            defaultBorderStyle: (mask.ColumnContext[i].DefaultStyle.Style.BorderStyle != null) ? mask.ColumnContext[i].DefaultStyle.Style.BorderStyle.split(" ") : "",
                                
                            isEditable: (mask.ColumnContext[i].Type.Value == "Capture" || mask.ColumnContext[i].Type.Value == "Comment" ? true : false),
                            formula: (mask.ColumnContext[i].Type.Value == "Formula" ? mask.ColumnContext[i].ColumnsDimensions[0].GridElement.Value : undefined)
                        }]);
                } else { 

                    u.notify({
                        message   : 'Cannot generate grid over an empty column context.',
                        type      : 'warning',
                        shouldGet : false
                    });
                        
                    return false;
                }
                    
                if(mask.RowContext) { 

                    for(var i = 0; i < mask.RowContext.length; i++) {
                        console.log(i);
        
                        lines.push([{
                            id: mask.RowContext[i].Id,
                            data: mask.RowContext[i].Title.Value,
                            
                            cellStyle: (mask.RowContext[i].Title.Style.CellStyle != null) ? mask.RowContext[i].Title.Style.CellStyle.split(" ") : "",
                            childrenStyle: (mask.RowContext[i].Title.Style.ChildrenStyle != null) ? mask.RowContext[i].Title.Style.ChildrenStyle.split(" ") : "",
                            borderStyle: (mask.RowContext[i].Title.Style.BorderStyle != null) ? mask.RowContext[i].Title.Style.BorderStyle.split(" ") : "",
                            
                            defaultCellStyle: (mask.RowContext[i].DefaultStyle.Style.CellStyle != null) ? mask.RowContext[i].DefaultStyle.Style.CellStyle.split(" ") : "",
                            defaultChildrenStyle: (mask.RowContext[i].DefaultStyle.Style.ChildrenStyle != null) ? mask.RowContext[i].DefaultStyle.Style.ChildrenStyle.split(" ") : "",
                            defaultBorderStyle: (mask.RowContext[i].DefaultStyle.Style.BorderStyle != null) ? mask.RowContext[i].DefaultStyle.Style.BorderStyle.split(" ") : "",
                            
                            formula: (mask.RowContext[i].RowDimensions[0].GridElement.Value.indexOf("=") == 0 ? mask.RowContext[i].RowDimensions[0].GridElement.Value : undefined)
                        }]);
                    }
                } else { 

                    u.notify({
                        message   : 'Cannot gnerate grid over an empty row context.',
                        type      : 'warning',
                        shouldGet : false
                    });

                    return false;
                }

                spreadSheet = $("#spreadsheet").spreadSheet({
                    lines: lines,
                    columns: columns,
                    data: {
                        data: that.getGridValues()
                    },
                    autoSizeAfterCol: 0,
                    disableMovingForColumnSuperiorTo: 0,
                    disableMovingForRowInferiorTo: lines.length + 1 + 1
                });

                spreadSheet.placeData();
    
                this.updateFormula();

                $('#container').addClass('hide').removeClass('show');
                $('#previewContainer').removeClass('hide').addClass('show');

                displayEmptyFields(mask);
                
                if( $('.SCContainer').children().length ) 
                    accessToolbar.toolbar.displayScenarioParameters(true);
                

                return true;
            }


        };
    },
    intervalID,
    idParameter = u.urlParam('id');

    maker = contextTableMaker();

    maker.setURL('mask');
    maker.setDimensions ( JSON.parse(localStorage.getItem('dimensions')) );
    maker.setCube( JSON.parse( sessionStorage.getItem('cube') ) );
    maker.setAppliCube(sessionStorage.getItem('applicationCube'));
    maker.setMembersPerDimension(JSON.parse(localStorage.getItem('membersPerDimension')));
    maker.setVariablesPerDimension( JSON.parse(localStorage.getItem('variablesPerDimension')) );
    /*maker.setIsSpreadSheet(false);*/

    maker.getDimensionsButton( );
    maker.enableDimensionsDragNDrop();
    maker.makeHeader();
    
    $(document).trigger("dimensionsSet");

    if( idParameter) {

        if( localStorage) {

        }

        $.ajax({
            url: 'mask?action=getMaskGrids',
            type: 'GET',
            dataType: 'json',
            data : {
                id : Number.parseInt(idParameter)
            },
            contentType: 'application/json; charset=UTF-8',
            mimeType: 'application/json',
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
            success: function (data) {

                if(data.mask) {
                    console.log('mask');
                    console.log(data.mask);
                    maker.setMask( JSON.parse( data.mask )  );
                    maker.initDimensions();

                    
                    console.log(maker.getMask());
                    
                    maker.reloadData();
                    maker.setURL('modifyMask?id=' + idParameter);
                    $('#saveCreate').addClass('hide');
                    $('#saveModify').removeClass('hide').addClass('show');
                }

                if(data.grids) {
                    console.log('grids');
                    console.log(data.grids);
                    maker.setGrids ( JSON.parse( data.grids )  );
                }

            },
            error:function(data,status,er) {

                u.notify({
                    message     : er,
                    type        : 'error',
                    shouldGet   : false
                });
            }

        });

    }
    else
    {
    	spreadSheetColumns.initHeaders();
    	spreadSheetLines.initHeaders();
    }





    console.time("getMembersPerDimension");

   

    $('#tabHeader a').click(function (e) {
        e.preventDefault();
        var tab = $(this).attr('href');

        switch(tab)
        {
            case '#tabRetrieveHeader' : $('#tabRetrieveHeader').addClass('active');
                                        $('#tabCaptureHeader').removeClass('active');
                                        break;

            case '#tabCaptureHeader' :  $('#tabCaptureHeader').addClass('active');
                                        $('#tabRetrieveHeader').removeClass('active');
                                        break;
        }
    });

    $('#nameMask').on('keydown',function ( ) {
        if( $(this).parent().hasClass('has-error') )
            $(this).parent().removeClass('has-error');
    });

    $(".saveMask").click( function( e ) {

        
        
        if(($(".modifiedMaskCheckbox:checked").length != $(".modifiedMaskCheckbox").length && $(".dropMask").is(":checked")))
        {
            alert("Some grids are bind to this mask. Please remove them first.");
            return false;
        }
    
        if($("#modifiedMaskName:visible").length && $("#modifiedMaskName:visible").val() == "")
        {
            alert("Please enter a mask name.");
            return false;
        }

        if($('#myModal').is(':visible'))
            $('#closeMyModal').click();

        maker.saveMask();


    });

    $(document).on('startSave', function ( event ) {
        intervalID = setInterval( maker.sendMaskObject() , (maker.getAutoSave() ? maker.getAutoSave() : 10000 ) );
    });

    $('#previewGrid').click(function( event ){
       
        $('#spreadsheet').empty();
        maker.initGridPreview();

    });

    $('#viewMask').click(function( event ){

        $('#previewContainer').addClass('hide').removeClass('show');
        $('#container').removeClass('hide').addClass('show');

        spreadSheetColumns.autoSize();
        spreadSheetLines.autoSize();
       
    });
 
    $("#saveModify").click(function(e)
    {
        const gridElementTemplate = "<div class='col-lg-12'>" +
                                "<div class='col-lg-4'>" +
                                    "<span class='gridName'></span>" +
                                "</div>" +
                                "<div class='col-lg-1'>" +
                                    "<input type='checkbox' class='modifiedMaskCheckbox' />" +
                                "</div>" +
                            "</div>";

        var grids = maker.getGrids();

        $(".overwriteMask").prop('checked', false);
        $('#modifiedMaskName').val('');

        if(grids.length)
        {
            $(".overwrite").hide();
            //      $(".overwriteMask").attr('disabled', true);
            $(".modifiedMaskNameContainer").show();

            var modal = $("#myModal");
            var modalGridContainer = modal.find(".gridElementContainer");
            modalGridContainer.empty();

            for(var i = 0; i < grids.length; i++)
            {
                var gridElement = $(gridElementTemplate).appendTo(modalGridContainer);

                gridElement.find(".gridName").text(grids[i].Name);
                gridElement.find(".modifiedMaskCheckbox").attr('id', grids[i].Id);
            }

            $(".modifiedMaskCheckbox").trigger("change");
        }
        else
        {
            $(".gridSelectionContainer").hide();
        }
    });

    $("#performRetrieve").click(function() {
        console.log("maskPreview");
        
        console.log(maker.getMaskPreview());

        $.ajax({
            url: 'updatePreview',
            type: 'POST',
            dataType: 'json',
            data: {
                mask : JSON.stringify( maker.getMaskPreview() )
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
                
                if(data.gridValues)
                {
                    u.notify({
                        message     : 'Values updated.',
                        shouldGet   : false,
                        type        : "success"
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
                    maker.updateFormula();
                }
                else if(data.error)
                {   

                    u.notify({
                        message     : data.error,
                        shouldGet   : false,
                        type        : "error"
                    });

                    accessToolbar.toolbar.displayScenarioParameters(true);
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

    $(".saveScenarioParameters").click(function() {

        var mask = maker.getMaskPreview();

        $('.scenarioParametersCapture').each(function ( index, input){
            if( $(input).is('[data-cc]') && $(input).is('[data-cd]') )
                mask.ColumnContext[ $(input).attr('data-cc') ].ColumnsDimensions[ $(input).attr('data-cd') ].GridElement.Value = $(input).val();
            else if( $(input).is('[data-hd]') )
                mask.HeaderContext[ $(input).attr('data-hd') ].Value = $(input).val();
            else if(  $(input).is('[data-rc]') && $(input).is('[data-rd]') )
                mask.RowContext[ $(input).attr('data-rc') ].RowDimensions[ $(input).attr('data-rd')].GridElement.Value = $(input).val();
        });

        maker.setMaskPreview(mask);

        accessToolbar.toolbar.displayScenarioParameters(false);

        u.notify({
            message : 'Saved.',
            type    : 'success',
            shouldGet : false
        });
    });


});