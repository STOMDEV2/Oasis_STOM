$(document).ready(function(){
//1- retirer le code mort
//  2 - réécrire les events et mettre tout dans specifier
// 3 - régler l'affaire magicSelection
// 6 - la colonne formule unité - redemander
//7 -  revoir sauvegarde masque et script reconstruction tableau à faire - s'assurer que ok avec bdd

//sur input nbcols, saisie inférieure à 1 à refuser. !! - to do 

//bonus meilleur algo ^pour alignement variables en-tête
 // trouver une autre solution pour la coloration des entrées menu - say what ?????

    var u = utility(),
        magic,
        selList = document.getElementById( 'maskTableRetrieve' ),
        magicCapture,
        selListCapture = document.getElementById( 'maskTableCapture' );

        

        magic = new magicSelection( selList.querySelectorAll( '.cellR1 button' ), {
            onSelection : function( el , ev ) {

                //click = true;

                var selected = u.checkUncheck( el ) ;  

                u.highlight( selected , $(el).parent().parent() );
                u.light(selected , $(el) );

            },
            onClick : function( el) {



                if( event.ctrlKey ) {       

                    u.selectRow( $(el) ) ;


                } else if (event.shiftKey) {


                    var nbRowsSelected = $('.selected').length;

                    if( nbRowsSelected > 0 ) { 

                        var rowPosition = Number( $(el).text() ) - 1,
                            firstSelectRowPostion = $(el).parents().find('tr.selected:first').index(), //$(el).parent().parent().siblings().first('.selected').index()
                            lastSelectedRowPosition = $(el).parents().find('tr.selected:last').index(), //$(el).parents().parent().siblings().last('.selected').index()
                            closestSelectedRowPosition =  $(el).parent().parent().siblings().next('.selected').index(),
                            //alert('rowPosition ' + rowPosition + ' \n firstSelectRowPostion ' + firstSelectRowPostion  + ' \nlastSelectedRowPosition ' + lastSelectedRowPosition + '\n closestSelectedRowPosition ' + closestSelectedRowPosition)
                            rangeStopIndex = ( rowPosition - lastSelectedRowPosition ) > ( rowPosition - closestSelectedRowPosition ) ? lastSelectedRowPosition : closestSelectedRowPosition,
                            start = rowPosition > rangeStopIndex ? ( rangeStopIndex > 0 ? rangeStopIndex : rangeStopIndex + 1 ): rowPosition, 
                            cpt = start,
                            end = rowPosition > rangeStopIndex ? rowPosition : ( rangeStopIndex > 0 ? rangeStopIndex : rangeStopIndex + 1),
                            add = start < end ? true : false;
                                        


                        while(add ? cpt <= end : cpt >= end) {

                            var row = $('#maskTableRetrieve tbody tr:eq(' + ( cpt ) + ')');
                                u.selectRow( $(row).find('button') );

                            cpt = u.next(add, cpt);
                        }

                    } else {

                            u.selectRow( $(el) );
                    }

                } else {

                    var nbRowsSelect = $('.selected').length;
                    selected = u.checkUncheck( el );  

                    if( selected ) {
                        u.selectRow( $(el) );
                    } else {
                        u.unSelectRow( $(el) );
                    }
                        if ( nbRowsSelect > 0 ) { 
                            var siblings = $(el).parent().parent().siblings();

                            siblings.each( function ( rowIndex, tr ) {

                                u.unSelectRow( $(tr).find('button') ) ;
                            });
                        }


                    }


                                }
                            });

        /*magicCapture = new magicSelection( selList.querySelectorAll( '.cellR1 button' ), {
            onSelection : function( el , ev ) {

                //click = true;

                var selected = u.checkUncheck( el ) ;  

                u.highlight( selected , $(el).parent().parent() );
                u.light(selected , $(el) );

            },
            onClick : function( el) {



                if( event.ctrlKey ) {       

                    u.selectRow( $(el) ) ;


                } else if (event.shiftKey) {


                    var nbRowsSelected = $('.selected').length;

                    if( nbRowsSelected > 0 ) { 

                        var rowPosition = Number( $(el).text() ) - 1,
                        firstSelectRowPostion = $(el).parent().parent().siblings().first('.selected').index(),
                        lastSelectedRowPosition = $(el).parent().parent().siblings().last('.selected').index(),
                        closestSelectedRowPosition =  $(el).parent().parent().siblings().next('.selected').index()

                                        //alert('rowPosition ' + rowPosition + ' \n firstSelectRowPostion ' + firstSelectRowPostion  + ' \nlastSelectedRowPosition ' + lastSelectedRowPosition + '\n closestSelectedRowPosition ' + closestSelectedRowPosition)
                                        

                                        var rangeStopIndex = ( rowPosition - lastSelectedRowPosition ) > ( rowPosition - closestSelectedRowPosition ) ? lastSelectedRowPosition : closestSelectedRowPosition,
                                        start = rowPosition > rangeStopIndex ? rangeStopIndex : rowPosition, 
                                        cpt = start,
                                        end = rowPosition > rangeStopIndex ? rowPosition : rangeStopIndex,
                                        add = start < end ? true : false;
                                        


                                        while(add ? cpt <= end : cpt >= end) {

                                            var row = $('#maskTableCapture tbody tr:eq(' + ( cpt ) + ')');
                                            u.selectRow( $(row).find('button') );

                                            cpt = next(add, cpt);
                                        }

                                    } else {

                                        u.selectRow( $(el) );
                                    }

                                } else {

                                    var nbRowsSelect = $('.selected').length;
                                    selected = u.checkUncheck( el );  

                                    if( selected ) {
                                        u.selectRow( $(el) );
                                    } else {
                                        u.unSelectRow( $(el) );
                                    }
                                        //highlight( selected , $(el).parent().parent() );
                                        //light(selected, $(el) );

                                        if ( nbRowsSelect > 0 ) { 
                                            var siblings = $(el).parent().parent().siblings();

                                            siblings.each( function ( rowIndex, tr ) {

                                                u.unSelectRow( $(tr).find('button') ) ;
                                            });
                                        }


                                    }


                                }
                            });*/
    
    var membersPerDimension = {},
        selectors = {
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
                    header            : '#divPanelWebContext',
                    note              : '#divNote',
                    formula           : '#divFormula',
                    headerPairR       : '#pairR',
                    headerImpairR     : '#impairR',
                    headerPairC       : '#pairC',
                    headerImpairC     : '#impairC'
                },
                tabs              : {
                    retrieveHeader    : '#tabRetrieveHeader',
                    captureHader      : '#tabCaptureHeader',
                    retrieveHistoric  : '#tabRetrieveHistoric',
                    captureHistoric   : '#tabCaptureHistoric'
                },
                tableRetrieveHistoric : {
                    name  : '#tableRetrieveHistoric',
                    head  : '#tableRetrieveHistoric thead tr',
                    lines : '#tableRetrieveHistoric tbody tr'
                },
                tableCapturePhasing   : {
                    name  : '#tableCapturePhasing',
                    head  : '#tableCapturePhasing thead tr',
                    lines : '#tableCapturePhasing tbody tr'
                },
                maskTableRetrieve : {
                    name          : '#maskTableRetrieve tbody',
                    head          : '#maskTableRetrieve thead tr',
                    lines         : '#maskTableRetrieve tbody tr'
                },
                maskTableCapture  : {
                    name          : '#maskTableCapture tbody',
                    head          : '#maskTableCapture thead tr',
                    lines         : '#maskTableCapture tbody tr'
                },
                dragNDrop : {
                    elements      : '.btnDraggable',
                    drop          : '.dimensionContainer',
                    container     : '#dragArea'
                },
                buttons           : {
                    save          : '#btnSaveMask', 
                    addRow        : '.btnAddRow',
                    applyFormula  : '#applyFormula',
                    applyNote     : '#applyNote',
                    actions       : {
                        createStyle : '#createStyle',
                        addStyle    : '#addStyle',
                        addFormula  : 'i.fa.fa-calculator',
                        addNote     : 'i.fa.fa-pencil-square-o'
                    }
                },
                actionBar           : '#actionBar',
                glyphicons          : {
                    divider         : '.fa-magic',
                    formula         : '.fa-calculator',
                    note            : '.fa-pencil-square-o',
                    actions         : '.glyphicon-th-list',
                    remove          : '.glyphicon-remove'
                }



            }

    },
    contextTableMaker = function ( ) {
        
        var contextTable = document.querySelector(selectors.maskForm.contextTable.name),
            appliCube = "";


        return {
            that                : this, 
            selectors           : selectors.maskForm,
            getAppliCube        : function ( ) {
                return this.appliCube;
            },
            setAppliCube        : function ( appliCube ) {
                this.appliCube = appliCube;
            },
            getDimensionsButton : function( data ){

                var dimensions = [],
                    buttonId;

                    dimensions = data.dimensions;

                for(var i = 0 , cpt = dimensions.length ; i < cpt ; i+=1 ) {


                    buttonId = dimensions[i];
                    buttonId = buttonId.replace(' ','_');
                    
                   
                    if(i > 0)
                    {
                        $(this.selectors.blocks.dimensions).
                        append('<button id="' + buttonId + '" class="btnDraggable btn btn-default" name ="' + dimensions[i] + '">' + dimensions[i] + '</button>');

                    } else {
                        $(this.selectors.blocks.rowContext).
                        append('<button id="' + buttonId + '" class="btnDraggable btn btn-default" name ="' + dimensions[i] + '">' + dimensions[i] + '</button>');


                        this.addDimension({
                            selectorTable       : this.selectors.maskTableRetrieve,
                            classCellSelector   : '.cellR',
                            columnTitle         : dimensions[i]

                        });

                        this.addDimension({
                            selectorTable       : this.selectors.maskTableCapture,
                            classCellSelector   : '.cellC',
                            columnTitle         : dimensions[i]

                        });

                    }

                }

                $(this.selectors.dragNDrop.elements).css('z-index','100');

                

            },
            enableSortableTable : function ( spec ) {

                var args = {
                        maskTable : spec.maskTable
                    },
                    that = this;


                $(args.maskTable.name).on( 'click' , 'tr', function (e) {

                    if(e.target.nodeName === 'INPUT') return false; 
                    else if (e.target.nodeName === 'BUTTON') {

                        return;

                        
                    } else if ( $(e.target).hasClass('fa') ) {
                        if( $(e.target).hasClass('fa-calculator') ) {

                            that.displayActionBar({
                                input   : maker.selectors.inputs.formula,
                                bloc    : maker.selectors.blocks.formula
                            });



                        } else if( $(e.target).hasClass('fa-pencil-square-o') ) {

                            that.displayActionBar({
                                input   : maker.selectors.inputs.note,
                                bloc    : maker.selectors.blocks.note
                            });
                        }


                        return;

                    }

                    var row = e.currentTarget,
                    el = $(row).find('button');






                    if( event.ctrlKey ) {       

                        u.selectRow( $(el) ) ;


                    } else if (event.shiftKey) {


                        var nbRowsSelected = $('.selected').length;

                        if( nbRowsSelected > 0 ) { 

                            var rowPosition = Number( $(el).text() ) - 1,
                            firstSelectRowPostion = $(el).parent().parent().siblings().first('.selected').index(),
                            lastSelectedRowPosition = $(el).parent().parent().siblings().last('.selected').index(),
                            closestSelectedRowPosition =  $(el).parent().parent().siblings().next('.selected').index()

                                        //alert('rowPosition ' + rowPosition + ' \n firstSelectRowPostion ' + firstSelectRowPostion  + ' \nlastSelectedRowPosition ' + lastSelectedRowPosition + '\n closestSelectedRowPosition ' + closestSelectedRowPosition)


                                        var rangeStopIndex = ( rowPosition - lastSelectedRowPosition ) > ( rowPosition - closestSelectedRowPosition ) ? lastSelectedRowPosition : closestSelectedRowPosition,
                                        start = rowPosition > rangeStopIndex ? rangeStopIndex : rowPosition, 
                                        cpt = start,
                                        end = rowPosition > rangeStopIndex ? rowPosition : rangeStopIndex,
                                        add = start < end ? true : false;



                                        while(add ? cpt <= end : cpt >= end) {

                                            var row = $('#maskTableRetrieve tbody tr:eq(' + ( cpt ) + ')');
                                            u.selectRow( $(row).find('button') );

                                            cpt = u.next(add, cpt);
                                        }

                                    } else {

                                        u.selectRow( $(el) );
                                    }



                                } else {

                                    var nbRowsSelect = $('.selected').length,
                                    selected = u.checkUncheck( el );  

                                    u.highlight( selected , $(el).parent().parent() );
                                    u.light(selected, $(el) );

                                    if ( nbRowsSelect > 0 ) { 
                                        var siblings = $(el).parent().parent().siblings();

                                        siblings.each( function ( rowIndex, tr ) {
                                            u.unSelectRow( $(tr).find('button') );
                                        });
                                    }


                                }

                }).sortable({
                    connectWith: args.maskTable.name,
                    opacity : 0.4,
                    placeholder: 'placeHolder',
                    tolerance: 'pointer',
                    delay: 150, //Needed to prevent accidental drag when trying to select
                    revert: 0,
                    helper: function (e, item) {

                        //Bas ically, if you grab an unhighlighted item to drag, it will deselect (unhighlight) everything else
                        if (!item.hasClass('selected')) {
                            item.addClass('selected').siblings().removeClass('selected');
                        }
                        
                        //////////////////////////////////////////////////////////////////////
                        //HERE'S HOW TO PASS THE SELECTED ITEMS TO THE `stop()` FUNCTION:
                        
                        //Clone the selected items into an array
                        var elements = item.parent().children('.selected').clone(false,false);
                        
                        //Add a property to `item` called 'multidrag` that contains the 
                        //  selected items, then remove the selected items from the source list
                        item.data('multidrag', elements).siblings('.selected').remove();

                        item.children().each(function ( index ) {
                            if($(this).nodeType === 1) {
                                $(this).width(item.eq(index).width());
                            }
                        });
                        
                        //Now the selected items exist in memory, attached to the `item`,
                        //  so we can access them later when we get to the `stop()` callback
                        

                        //magic.isOnSelection = false;
                        //Create the helper
                        var helper = $('<tr/>');

                        return helper.append(elements);

                        
                        
                       
                    },
                    stop: function (e, ui) {

                       
                        

                        

                        var elements = ui.item.data('multidrag');
            
                                //`elements` now contains the originally selected items from the source list (the dragged items)!!
                                
                                //Finally I insert the selected items after the `item`, then remove the `item`, since 
                                //  item is a duplicate of one of the selected items.
                                ui.item.after(elements).remove();
                                
                                // faire au moins une fonction shortcut specifier ptet la mettre dans utility
                        var selList = document.getElementById( 'maskTableRetrieve' ),
                            items = selList.querySelectorAll( 'tbody tr' );
                        
                        // fill the initial checked elements (mozilla)
                        [].slice.call( items ).forEach( function( el ) {
                            if( $(el).hasClass('btn-info') ) {
                                u.selectRow( $(el) );
                            } else {
                                u.unSelectRow( $(el) );
                            }
                        });

                        

                        var newItems = $(elements).find('button');

                        magic.items = $.makeArray( newItems ); // repenser le magic
                        magic._initEvents(magic);



                        $(args.maskTable.name + ' button').each( function ( i, btns ) {
                            $(this).html( (i+1) );
                        });


                    }

                });//.disableSelection(); it's bad !!!!!!! but why was it used ? àsimply bad 
                


            },
            enableDimensionsDragNDrop : function ( maker ) {

                var table = this.selectors.maskTableRetrieve.name,
                    that = this;

                $(this.selectors.dragNDrop.elements).draggable({
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

                    $(this).css('z-index', '-1');
                  }
                }).
                on( 'drop', function( event, ui ) {
                    var dropped = ui.draggable,
                        dimensionName = $(ui.draggable).text().replace('_',' '),
                        droppedOn = $(this),
                        idParent = $(dropped).parent().attr('id'),
                        idDimensionName   = $(dropped).attr('id');

                        $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);

                       

                        if($(this).attr('id') === 'divDimensions') { 
                            if(idParent != 'divDimensions') {

                                var rand = 1 + Math.floor(Math.random() * 10);

                                if( rand % 2 === 0) {
                                    $(that.selectors.blocks.headerPairR).append(
                                        '<div id="formRetrieve_' + idDimensionName + '" class="form-horizontal">'
                                    +       '<div class="form-group">'
                                    +           '<label for="headerRetrieve_'+ idDimensionName + '" class="col-md-offset-3 col-md-2 control-label">' + dimensionName + '</label>'
                                    +           '<div class="col-md-3">'
                                    +               '<input type="text" class="form-control" id="_headerRetrieve' + idDimensionName +'" name="headerRetrieve_' + idDimensionName + '" placeholder="var">'
                                    +           '</div>'
                                    +       '</div>'
                                    +   '</div>');

                                    $(that.selectors.blocks.headerPairC).append(
                                        '<div id="formCapture_' + idDimensionName + '" class="form-horizontal">'
                                    +       '<div class="form-group">'
                                    +           '<label for="headerCapture_'+ idDimensionName + '" class="col-md-offset-3 col-md-2 control-label">' + dimensionName + '</label>'
                                    +           '<div class="col-md-3">'
                                    +               '<input type="text" class="form-control" id="headerCapture' + idDimensionName +'" name="headerCapture_' + idDimensionName + '" placeholder="var">'
                                    +           '</div>'
                                    +       '</div>'
                                    +   '</div>');

                                } else {

                                    $(that.selectors.blocks.headerImpairR).append(
                                        '<div id="formRetrieve_' + idDimensionName + '" class="form-horizontal">'
                                    +       '<div class="form-group">'
                                    +           '<label for="headerRetrieve_'+ idDimensionName + '" class="col-md-offset-3 col-md-2 control-label">' + dimensionName + '</label>'
                                    +           '<div class="col-md-3">'
                                    +               '<input type="text" class="form-control" id="headerRetrieve_' + idDimensionName +'" name="headerRetrieve_' + idDimensionName + '" placeholder="var">'
                                    +           '</div>'
                                    +       '</div>'
                                    +   '</div>');

                                    $(that.selectors.blocks.headerImpairC).append(
                                        '<div id="formCapture_' + idDimensionName + '" class="form-horizontal">'
                                    +       '<div class="form-group">'
                                    +           '<label for="headerCapture_'+ idDimensionName + '" class="col-md-offset-3 col-md-2 control-label">' + dimensionName + '</label>'
                                    +           '<div class="col-md-3">'
                                    +               '<input type="text" class="form-control" id="headerCapture_' + idDimensionName +'" name="headerCapture_' + idDimensionName + '" placeholder="var">'
                                    +           '</div>'
                                    +       '</div>'
                                    +   '</div>');
                                } 

                            } 
                        } else {
                            $('#formRetrieve_' + idDimensionName).remove();
                            $('#formCapture_' + idDimensionName).remove();
                        }


                        if($(this).attr('id') === 'divRowContext') { 

                            if(idParent != 'divRowContext') {
                                maker.addDimension({
                                    selectorTable       : maker.selectors.maskTableRetrieve,
                                    classCellSelector   : '.cellR',
                                    columnTitle         : dimensionName
                                });

                                maker.addDimension({
                                    selectorTable       : maker.selectors.maskTableCapture,
                                    classCellSelector   : '.cellC',
                                    columnTitle         : dimensionName
                                });
                            }

                        } else {
                            maker.removeDimension({
                                selector          : '#maskTableRetrieve',
                                cellClassName     : 'cellR',
                                columnTitle       : dimensionName
                            });


                            maker.removeDimension({
                                selector          : '#maskTableCapture',
                                cellClassName     : 'cellC',
                                columnTitle       : dimensionName
                            });

                        }

                        if( $(this).attr('id') === 'divColumnContext' ) {
                            if( idParent != 'divColumnContext' ) {
                                // on ajoute la ligne
                                maker.addDimensionInRow({
                                    table         : maker.selectors.tableRetrieveHistoric,
                                    dimensionName : dimensionName,
                                    cellClassName : 'cellRH'
                                });

                                maker.addDimensionInRow({
                                    table         : maker.selectors.tableCapturePhasing,
                                    dimensionName : dimensionName,
                                    cellClassName : 'cellCP'
                                });
                            }
                        } else {
                            // on retire la ligne
                            maker.removeDimensionfromRow({
                                table         : maker.selectors.tableRetrieveHistoric,
                                dimensionName : dimensionName
                            });

                            maker.removeDimensionfromRow({
                                table         : maker.selectors.tableCapturePhasing,
                                dimensionName : dimensionName
                            });
                        }
                });
            },
            enableAutocomplete : function ( spec ) {

                var args = {
                        source    : spec.source,
                        maskTable : spec.maskTable  
                    },
                    dimensionName = '',
                    source,
                    head = args.maskTable.head;

                $(args.maskTable.lines).each(function ( rowIndex, tr) {
                  
                        $(tr).children('td').each(function( cellIndex, td){
                            if(cellIndex > 1) {
                                
                                dimensionName = $(head + ' th:eq('+cellIndex+')').text();
                                
                                source = args.source[dimensionName];

                                $(td).find('input').autocomplete({source : source , messages: { noResults: '', results: function() {} } });
                            }
                        });
                    
                });
            },

            creationContext : function ( data ) {

                
                var dimensions = [],
                    newRow,
                    newDimension,
                    newInput,
                    newDisplay,
                    newCheckbox;    

                    dimensions = data.dimensions;

                for (var i = 0, cpt = dimensions.length ; i < cpt ; i += 1 ) {

                    newRow = contextTable.insertRow(0);

                    newDimension = newRow.insertCell(0);
                    newInput = newRow.insertCell(1);
                    newInput.className = 'cell-center';
                    newDisplay = newRow.insertCell(2);
                    newDisplay.className = 'cell-center';

                    newDimension.textContent = dimensions[i];

                    newCheckbox = document.createElement('input');
                    newCheckbox.setAttribute('type' , 'checkbox');
                    newInput.appendChild(newCheckbox);

                    newCheckbox = document.createElement('input');
                    newCheckbox.setAttribute('type', 'checkbox');

                    newDisplay.appendChild(newCheckbox);

                    }       

            },
            getWebContext : function ( selectorContextTable ) {
                var webContext = {
                    input : [],
                    display : []
                };

                $(selectorContextTable).each(function(rowIndex,tr) {
                
                    if($(tr).children('td:eq(1)').find('input').is(':checked')) {
                        webContext.input.push($(tr).children(' td:eq(0)').text());
                    }   
                
                    if($(tr).children('td:eq(2)').find('input').is(':checked')) {
                        webContext.display.push($(tr).children(' td:eq(0)').text());
                    }

                 });

        
                return webContext;
            },
            getRowContext : function ( ) {
                var rowContext = [];

                $('#divRowContext button').each(function(index,elt){
        
                    rowContext.push($(this).text());

                });

                return rowContext;
            },
            getColumnContext : function ( ) {

                var columnContext = [];


                $('#divColumnContext button').each(function(index){

                    console.log('each column ' + index);
   
                    columnContext.push($(this).text());
       
                });

                return columnContext;
            },
            getMaskObject : function ( maskObject ) {
                var maskObjectJSON = JSON.stringify(maskObject);

                console.log(maskObjectJSON);


                $.ajax({
                    url: 'creationMasque?saveMask=true',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(maskObject),
                    contentType: 'application/json; charset=UTF-8',
                    mimeType: 'application/json',
             
                    success: function ( data ) {
                        if( data.message ) {
                            
                            u.notify({
                                message : data.message,
                                type    : 'success'
                            });
                            
                        } else if( data.error) {

                            u.notify({
                                message : data.error,
                                type    : 'error'
                            });
                        }
                    },
                    error:function(data,status,er) {
                        
                        u.notify({
                            message : er,
                            type    : 'error'
                        });
                        
                        console.log("error: "+data+" status: "+status+" er:"+er);
                    }
                });


                return maskObjectJSON;
            },
            makeHeader: function (  ) {

                var that = this;

                $(this.selectors.blocks.dimensions).find('button').each( function ( index, button ) {

                    var id = $(button).attr('id'),
                        name = $(button).text();
                    
                    if( index%2 === 0 ) { // faire un truc propre

                        $(that.selectors.blocks.headerPairR).append(
                            '<div id="formRetrieve_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerRetrieve_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control" id="headerRetrieve_' + id +'" name="headerRetrieve_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        $(that.selectors.blocks.headerPairC).append(
                            '<div id="formCapture_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerCapture_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control" id="headerCapture_' + id +'" name="headerCapture_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                    } else {

                        $(that.selectors.blocks.headerImpairR).append(
                            '<div id="formRetrieve_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerRetrieve_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control" id="headerRetrieve_' + id +'" name="headerRetrieve_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        $(that.selectors.blocks.headerImpairC).append(
                            '<div id="formCapture_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerCapture_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control" id="headerCapture_' + id +'" name="headerCapture_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');
                    }
                });


                 
                
            },
            setClass : function ( table ) {
                for(var i=0, cpt = table.rows.length; i<cpt; i += 1) {
                    for(var j = 0, c = table.rows[i].cells.length; j<c; j+=1) {
                        console.log('i'+i);
                        table.rows[i].cells[j].setAttribute('class','cellR'+(j+1));
                    }
                }
            },
            removeDimension : function ( specifier ) {
                var args = {// en fait franchement nul
                        selector      : specifier.selector,
                        columnTitle   : specifier.columnTitle,
                        cellClassName : specifier.cellClassName
                    },
                    tableName = specifier.selector.slice(1,specifier.selector.length);
                console.time("surprise");

                var m = contextTableMaker();



                $(specifier.selector + ' tr:eq(0)').children().each(function(index,th){
                    var title = $(th).text();

                    if(title === args.columnTitle) {
                        var classColumnToDelete = $(th).attr('class');
                        
                        $('.'+ classColumnToDelete).remove();

                        m.setClass(document.getElementById(tableName));

                        return;
                    }
                });

                $(specifier.selector + ' tr').each( function (rowIndex, tr) {
                        $(tr).children().each ( function (tdIndex, td) {
                            $(td).attr('class','').addClass(specifier.cellClassName + ( tdIndex + 1 ) )
                        });
                        
                    });

                console.timeEnd("surprise");
    
            },
            addDimension : function ( spec ) {

                var args = {
                    selectorTable      : spec.selectorTable,
                    classCellSelector  : spec.classCellSelector,
                    columnTitle        : spec.columnTitle
                };


                var lastCell = $(args.selectorTable.name + ' tr td:last').attr( 'class' ),
                    numbers = /([0-9]+)/.exec(lastCell),
                    nbCells = Number.parseInt(numbers[0]),
                    col = args.classCellSelector + ( nbCells - 1 ),
                    columnTitle = args.columnTitle,
                    selectorTable = args.selectorTable.name,
                    head          = args.selectorTable.head,
                    cellClassName = args.classCellSelector.slice(1,args.classCellSelector.length);
                    source = membersPerDimension[columnTitle];//looool


                    //WHATEVER MAN §!
                    // $('col:nth-child('+x+')').whatever()

                    $(head + ' th:last').before('<th class="'+ cellClassName + nbCells + '">' + columnTitle + '</th>');

                    $(head + ' th:last').removeClass(cellClassName + nbCells).addClass(cellClassName + ( nbCells + 1 ) );

                    $('td' + col).after('<td class="' + cellClassName + nbCells + '"><input type="text"></td');
                    
                    $(selectorTable + ' tr').each( function (rowIndex, tr) {
                        $(tr).find('td:last').
                        removeClass( cellClassName + nbCells ).
                        addClass( cellClassName +( nbCells + 1));
                    });
                    
                    col = args.classCellSelector + nbCells;

                    $(selectorTable + ' tr td' + col ).find('input').autocomplete({source : source , messages: { noResults: '', results: function() {} } });

                    
                // rigolade - shut your pie ho'
                /*console.time("Mytimer");

                var nbCells = table.rows[0].cells.length,
                cellToCopy,
                newCell,
                newInput,
                columnTitle = columnTitle || 'Dimension',
                source;

                for(var i = 0, cpt = table.rows.length; i < cpt ; i += 1) {
                    newCell = table.rows[i].insertCell(nbCells);

                    if(i === 0 ){
                        cellToCopy = table.rows[i].cells[nbCells - 1];
                        newCell.setAttribute('class','cell' + (nbCells + 1)); 
                        table.rows[i].replaceChild(cellToCopy.cloneNode(true),newCell);
                    } else {
                        newInput = document.createElement('input');
                        newInput.setAttribute('class','editor');
                        newCell.appendChild(newInput);
                        newCell.setAttribute('class','cell' + (nbCells + 1));

                    }
                    
                    source = membersPerDimension[columnTitle];

                    $(newInput).autocomplete({source : source , messages: { noResults: '', results: function() {} } });

                }
                


                table.rows[0].cells[table.rows[0].cells.length - 1].textContent = columnTitle;

                $('#maskTable tr:eq(0) th:last').attr('class','cell' + (nbCells+1)); //pour mettre la classe sur l'entête parce que sinon on le fait que sur le body

                console.timeEnd("Mytimer");*/

            },
            //refactoriser
            addColumn : function ( specifier ) {
                var args = {
                    selectorTable      : specifier.selectorTable,
                    classCellSelector  : specifier.classCellSelector
                };


                var lastCell = $(args.selectorTable.head + ' th:last').attr( 'class' ),
                    numbers = /([0-9]+)/.exec(lastCell),
                    nbCells = Number.parseInt(numbers[0]),
                    col = args.classCellSelector + ( nbCells ),
                    cellClassName = args.classCellSelector.slice(1,args.classCellSelector.length);
                    //source = membersPerDimension[columnTitle];

                    $(args.selectorTable.head + ' th:last').after('<th class="'+ cellClassName + nbCells + '"><input type="text" class="cell-80 form-control"</th>');

                    $(args.selectorTable.head + ' th:last').removeClass(cellClassName + nbCells).addClass(cellClassName + ( nbCells + 1 ) );

                    $('td' + col).after('<td class="' + cellClassName + nbCells + '"><input type="text" class="cell-80 form-control"></td');
                    
                    $ (args.selectorTable.lines ).each( function (rowIndex, tr) {
                        $(tr).children().last().
                        removeClass( cellClassName + nbCells ).
                        addClass( cellClassName +( nbCells + 1));
                    });
                    
            },
            removeColumn : function ( specifier ) {

                var args = {
                        table : specifier.table
                    };

               $(args.table.head +' th:last').remove();
               $(args.table.lines).each( function( rowIndex , tr ) {
                    $(tr).find('td:last').remove();
               });

            },  
            displayActionBar : function ( spec ) {
                
            
                var actionBar = {
                    bar     : spec.bar || '#actionBar',
                    bloc   :  spec.bloc,
                    input   : spec.input
                };

                
                if( !$(actionBar.bloc).is(':visible') ) {
                    $(this.selectors.blocks.formula).removeClass('show').addClass('hide');
                    $(this.selectors.blocks.note).removeClass('show').addClass('hide');
                    $(actionBar.bar).attr('style','');
                    $(actionBar.input).val('');
                    $(actionBar.bloc).slideDown().removeClass('hide').addClass('show');
                } else {
                    return;
                }

            },
            applyProperty : function ( event ) {

                var specifier = {
                        input           : event.data.input,
                        blocs           : {
                            actionBar : event.data.blocs.actionBar,
                            property  : event.data.blocs.property
                        },
                        glyphicon       : event.data.glyphicon,
                        title           : event.data.title,
                        errors          : {
                            empty       : event.data.errors.empty,
                            noSelection : event.data.errors.noSelection,
                        },
                        success         : event.data.success || 'La propriété a bien été appliquée'
                    },
                    nbSelected = 0;

                    if( $(specifier.input).val() ) {

                        

                    } else {

                        u.notify({
                            message : specifier.errors.empty,
                            type    : 'warning',
                        });
                    }

            },
            closeActionBar : function ( event ) {
                var blocProperty = event.target.parentElement.parentElement,
                    specifier = {
                        
                        blocs : {
                            actionBar : event.data.actionBar,
                            property  : $(blocProperty).attr('id')
                        }

                    };

                console.log('specifier property' + specifier.blocs.property);

                 $(specifier.blocs.actionBar).slideUp({
                    duration : 400,
                    complete : function () {
                        $(specifier.blocs.property).removeClass('show').addClass('hide');
                    }
                });
            },
            addRow       : function ( spec )  {// refactoriser variables, fonctionner

                var args = {
                        maskTable         : spec.maskTable,
                        source            : spec.source,
                        classCellSelector : spec.classCellSelector
                    },
                    cellIndex,
                    dimensionName,
                    line = $(args.maskTable.lines + '.selected:last').length > 0 ? $(args.maskTable.lines +'.selected:last').clone(false,false) : $(args.maskTable.lines + ':last').clone(false,false),
                    cell1 = Number(line.children().first().text()), //position de la ligne pivot
                    index = indexStart = cell1 - 1,
                    selected = line.hasClass('selected') ? true : false,
                    newItems,
                    nbRowsToAdd,
                    indexLastRowAdded;

                    cell1 ++;//position de la ligne à insérer
                    line.attr('style','');
                    line.removeClass('selected');

                    
                    

                    if( !$(this.selectors.inputs.addRow).val() ) { // On ajoute qu'une ligne
                        
                        //à fonctionnaliser
                        $(line).children('td').each(function ( cellIndex, td) {

                            if(cellIndex > 1) {

                                dimensionName = $(args.maskTable.head + ' th:eq('+cellIndex+')').text();

                                if(args.source[dimensionName]) {
                                    var source = args.source[dimensionName];
                                    //console.log("i : " + cellIndex + ' dimensionName ' + dimensionName + ' source ' + source );
                                    //console.log('input' + $(td).find('input').attr('class'));
                                    $(td).find('input').autocomplete({source : source , messages: { noResults: '', results: function() {} } });
                                }
                                
                            }    
                        
                        });

                        if(selected) { // si on a des lignes sélectionnées, on ajoute après la dernière sélectionnée
                            line.children().first().html('<button class="button btn btn-default">' + cell1 + '</button">');
                            $(args.maskTable.lines + '.selected:last').after(line);

                            //renuméroter les lignes d'après
                            /*$(args.maskTable.lines + ':eq(' + ( cell1 - 1 ) + ')').nextAll().each( function ( rowIndex, tr) {
                                $(tr).children().first().html('<button class="button btn btn-default">' + (++cell1) + '</button">');
                            });*/

                            newItems =  $(args.maskTable.lines + ':eq(' + index  + ')').nextAll().find('button');

                        } else {
                            line.children().first().html('<button class="button btn btn-default">' + cell1 + '</button">');
                            $(args.maskTable.lines + ':last').after(line);
                            newItems = $(args.maskTable.lines + ':last td' + args.classCellSelector + ' button');
                        }

                        magic.items = $.makeArray( newItems );
                        //console.log('magic.items ' + magic.items);
                        magic._initEvents(magic);
                        

                    } else { // on ajoute plusieurs lignes

                        index = indexStart = $(args.maskTable.lines +'.selected:last').index();

                        if(selected) {
                            

                            nbRowsToAdd = Number.parseInt( $( this.selectors.inputs.addRow ).val() );
                            indexLastRowAdded = index + nbRowsToAdd;

                            console.log('index ' + index);
                            console.log('indexLastRowAdded' + indexLastRowAdded);

                            for( var i = 0; i < nbRowsToAdd; i+=1 ) {
                                var newLine = $(args.maskTable.lines + ':eq(' + index + ')').clone(false,false);
                                

                                $(newLine).children().first().html('<button class="button btn btn-default">' + (cell1++) + '</button>');
                                $(newLine).removeClass('selected').attr('style','');
                                    if(i===0) {
                                        $(args.maskTable.lines + '.selected:last').after(newLine);
                                    } else {
                                        $(args.maskTable.lines + ':eq(' + ( index ) + ')').after(newLine);
                                    }
                                        
                                index++;


                                $(newLine).children('td').each(function ( cellIndex, td) {

                                    if(cellIndex > 1) {

                                        dimensionName = $(args.maskTable.head + ' th:eq('+cellIndex+')').text();

                                        if(args.source[dimensionName]) {
                                            var source = args.source[dimensionName];
                                            //console.log("i : " + cellIndex + ' dimensionName ' + dimensionName + ' source ' + source );
                                            //console.log('input' + $(td).find('input').attr('class'));
                                            $(td).find('input').autocomplete({source : source , messages: { noResults: '', results: function() {} } });
                                        }
                            
                                    }    
                        
                                });
                            }

                            magic._removeEvents();
                            magic = new magicSelection( selList.querySelectorAll( '.cellR1 button' ), {
            onSelection : function( el , ev ) {

                //click = true;

                var selected = u.checkUncheck( el ) ;  

                u.highlight( selected , $(el).parent().parent() );
                u.light(selected , $(el) );

            },
            onClick : function( el) {



                if( event.ctrlKey ) {       

                    u.selectRow( $(el) ) ;


                } else if (event.shiftKey) {


                    var nbRowsSelected = $('.selected').length;

                    if( nbRowsSelected > 0 ) { 

                        var rowPosition = Number( $(el).text() ) - 1,
                            firstSelectRowPostion = $(el).parents().find('tr.selected:first').index(), //$(el).parent().parent().siblings().first('.selected').index()
                            lastSelectedRowPosition = $(el).parents().find('tr.selected:last').index(), //$(el).parents().parent().siblings().last('.selected').index()
                            closestSelectedRowPosition =  $(el).parent().parent().siblings().next('.selected').index(),
                            //alert('rowPosition ' + rowPosition + ' \n firstSelectRowPostion ' + firstSelectRowPostion  + ' \nlastSelectedRowPosition ' + lastSelectedRowPosition + '\n closestSelectedRowPosition ' + closestSelectedRowPosition)
                            rangeStopIndex = ( rowPosition - lastSelectedRowPosition ) > ( rowPosition - closestSelectedRowPosition ) ? lastSelectedRowPosition : closestSelectedRowPosition,
                            start = rowPosition > rangeStopIndex ? ( rangeStopIndex > 0 ? rangeStopIndex : rangeStopIndex + 1 ): rowPosition, 
                            cpt = start,
                            end = rowPosition > rangeStopIndex ? rowPosition : ( rangeStopIndex > 0 ? rangeStopIndex : rangeStopIndex + 1),
                            add = start < end ? true : false;
                                        


                        while(add ? cpt <= end : cpt >= end) {

                            var row = $('#maskTableRetrieve tbody tr:eq(' + ( cpt ) + ')');
                                u.selectRow( $(row).find('button') );

                            cpt = u.next(add, cpt);
                        }

                    } else {

                            u.selectRow( $(el) );
                    }

                } else {

                    var nbRowsSelect = $('.selected').length;
                    selected = u.checkUncheck( el );  

                    if( selected ) {
                        u.selectRow( $(el) );
                    } else {
                        u.unSelectRow( $(el) );
                    }
                        if ( nbRowsSelect > 0 ) { 
                            var siblings = $(el).parent().parent().siblings();

                            siblings.each( function ( rowIndex, tr ) {

                                u.unSelectRow( $(tr).find('button') ) ;
                            });
                        }


                    }


                                }
                            });

                        magic.items = u.uniq(magic.items);

                        }
                        else {

                        }
                    }

                    //renuméroter les lignes d'après
                            $(args.maskTable.lines + ':eq(' + ( cell1 - 1 ) + ')').nextAll().each( function ( rowIndex, tr) {
                                $(tr).children().first().html('<button class="button btn btn-default">' + (++cell1) + '</button">');
                            });

                            
                            //newItems = $(args.maskTable.lines+':gt(' + indexStart + '):lt(' + indexLastRowAdded + ') td' + spec.classCellSelector + ' button');



            },
            addDimensionInRow : function ( specifier ) {

                var args = {
                        table             : specifier.table,
                        source            : specifier.source || [],
                        dimensionName     : specifier.dimensionName,
                        cellClassName     : specifier.cellClassName         
                    },
                    tableName = args.table.name.slice(1,args.table.name.length),
                    dimensionName = args.dimensionName,
                    dimensionId   = args.dimensionName.replace(' ','_');
                    cellClassName = args.cellClassName,
                    nbColumn = $(args.table.head + ' th').length;
                    //$(args.maskTable.lines + '.selected:last').clone(false , false) || $(args.maskTable.lines +':last').clone( false, false ),  
                 
                if ( $( args.table.lines ).length === 0 ) {
                    
                    $(args.table.name + ' tbody'). append( '<tr id="' + tableName + '_' + dimensionId + '" ><th class="' + cellClassName + '1">' + dimensionName + '</th></tr>' );

                    for(var i = 1; i < nbColumn; i+=1 ) {
                             
                        $(args.table.lines +':last' ).children().last().after(
                            '<td class="' + cellClassName + (i+1) + '">'
                        +       '<input type="text" class="cell-80 form-control">'
                        +   '</td>');
                        
                    }

                } else {
                    
                    var line =  $(args.table.lines + ':last').clone(false , false);

                    $(line).attr('id',tableName + '_' + dimensionId)
                    line.children().first().html(dimensionName);
                    $(args.table.name).append(line);

                }

            },
            removeDimensionfromRow : function ( specifier ) {
                var args = {
                        table         : specifier.table,
                        dimensionName : specifier.dimensionName
                    },
                    tableName = args.table.name.slice(1,args.table.name.length);

                $('#' + tableName + '_' + args.dimensionName.replace(' ','_')).remove();
            },
            getOneRowContextValue : function ( selectorMaskTable, index ) {
                var context = [],
                    tr = $(selectorMaskTable)[index];
        
                $(tr).children('td').each(function(columnIndex,td){
        
                    if(columnIndex > 1) {            
                        context.push($(td).find('input').val());               
                    }
        
                });

                return context;
            },
            saveMask : function ( selectorMaskTable, selectorContextTable, maker ) {
               

                var i,
                    maskObject = {
                    nameMask      : $(this.selectors.inputs.input).val() || "",
                    cube          : this.appliCube,
                    webContext    :  {
                                         input : [],
                                         display : []
                                    },
                    rowContext    : {dimensions : []},
                    columnContext : {dimensions : []},
                    lines : []
                };

                if(maskObject.nameMask === "") {
                    
                    u.notify({
                        message : 'Veuillez saisir un nom pour le masque.',
                        type    : 'error'
                    });

                    return ;
                }

                $(selectorMaskTable).each(function(rowIndex,tr){


                    maskObject.lines[rowIndex] = {
                        "position"    : $(tr).find('td:eq(0)').text(),
                        "libel"       : $(tr).find('td:eq(1)').find('input').val(),
                        "idStyle"       : 1,
                        "context"     : {
                                            "dimensions" : maker.getOneRowContextValue(selectorMaskTable,rowIndex)
                                        }
                                        
                    }

                    

                });

               

                maskObject.rowContext.dimensions = maker.getRowContext();
                maskObject.columnContext.dimensions = maker.getColumnContext();
                maskObject.webContext = maker.getWebContext(selectorContextTable);

                return maker.getMaskObject(maskObject);
    

            }

        };
    },
    maker = contextTableMaker();

    $.get('creationMasque?action=getApplication', function( data ) {
        if(data.appliCube) {
            maker.setAppliCube(data.appliCube);

            u.notify({
                message : data.appliCube,
                type    : 'information',
                layout  : 'topRight'
            });
        } else {
            u.notify({
                message : data.error,
                type    : 'error'
            });
        }
        
    },'json');

     $.ajax({
        url: 'creationMasque?action=getDimensions',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
 
        success: function (data) {

            if(data.dimensions) {
                maker.getDimensionsButton( data );
                //maker.creationContext( data );
                maker.enableDimensionsDragNDrop( maker );
                maker.enableSortableTable( {maskTable:maker.selectors.maskTableRetrieve} );
                maker.enableSortableTable( {maskTable:maker.selectors.maskTableCapture} );
                maker.makeHeader();
                // why ? $('a[href="#retrieve"]').parent().addClass( 'active' );
                
            }

            if(data.membersPerDimension)
            {
                console.log('here ' + data.membersPerDimension);
            }
            
        },
        error:function(data,status,er) {

            data.dimensions = ['Time periods','Account','View','Flows','Scenarii','Sociétés','Measures','Activity','Cost Centre','Organisation'];

            maker.getDimensionsButton( data );
            //maker.creationContext( data );
            maker.enableDimensionsDragNDrop( maker );
            maker.makeHeader();
            u.notify({
                message : er,
                type    : 'error' 
            });

        }
    });

    console.time("getMembersPerDimension");

    $.ajax({
        url: 'creationMasque?action=getMembersPerDimension',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
 
        success: function (data) {

            if(data.membersPerDimension) {
                membersPerDimension = data.membersPerDimension;
            }

            maker.enableAutocomplete({
                maskTable : maker.selectors.maskTableRetrieve,
                source    : membersPerDimension
            });

            
            maker.enableAutocomplete({
                maskTable : maker.selectors.maskTableCapture,
                source    : membersPerDimension
            });            

            console.timeEnd("getMembersPerDimension");
        },
        error:function(data,status,er) {

            u.notify({
                message : er,
                type    : 'error' 
            });

        }
    });


  
    //var selectorContextTable = '#maskTableRetrieve tbody',
    //selectorMaskTable = '#contextTable tbody tr';

   $('.formCols').keypress(function( event ){
        return(event.which !== 13);
    });

    $(maker.selectors.buttons.save).click(function () {
        //'#maskTable tbody tr','#contextTable tbody tr'
        maker.saveMask(maker.selectors.maskTableRetrieve.lines,maker.selectors.contextTable.lines,maker);
    });

    $(maker.selectors.buttons.addRow).click(function () {

        maker.addRow({
            maskTable         : maker.selectors.maskTableRetrieve,
            source            : membersPerDimension,
            classCellSelector : '.cellR1'
        });
        
        maker.addRow({
            maskTable : maker.selectors.maskTableCapture,
            source    : membersPerDimension,
            classCellSelector : '.cellC1'
        });

    });


    $(maker.selectors.inputs.input).keyup({
        listenedElementInput : maker.selectors.inputs.input,
        content              : 'Nom du masque',
        elementTarget        : maker.selectors.nameTitle
    }, u.inputModificator );

    $(maker.selectors.inputs.addRow).keyup({
        elementSelector : maker.selectors.inputs.addRow
    }, u.onlyNumberOnInput);
    
    //à refactoriser
    $(maker.selectors.inputs.historicCols).bind('keyup change', function ( event ) {
        
        if(event.type === 'keyup') {
            
            if ( event.which !== 13 ) { return; }

            var nbPrevious = $(this).data('previous'),
                nbToAdd,
                add;

            nbToAdd = $(this).val() - nbPrevious;
            add = nbToAdd > 0 ? true : false;

            nbToAdd = Math.abs(nbToAdd);

            for(var i = 0; i < nbToAdd; i+=1)
            {
                if(add) {
                    maker.addColumn({
                        selectorTable      : maker.selectors.tableRetrieveHistoric,
                        classCellSelector  : '.cellRH'
                    });
                } else {
                    maker.removeColumn({
                        table      : maker.selectors.tableRetrieveHistoric
                    });
                }
            }

            $(this).data('previous',$(this).val());

        } else if (event.type === 'change') {
             
            var nbPrevious = $(this).data('previous'),
                nbToAdd,
                add;

            nbToAdd = $(this).val() - nbPrevious;
            add = nbToAdd > 0 ? true : false;

            nbToAdd = Math.abs(nbToAdd);

            for(var i = 0; i < nbToAdd; i+=1)
            {
                if(add) {
                    maker.addColumn({
                        selectorTable      : maker.selectors.tableRetrieveHistoric,
                        classCellSelector  : '.cellRH'
                    });
                } else {
                    maker.removeColumn({
                        table      : maker.selectors.tableRetrieveHistoric
                    });
                }
            }

            $(this).data('previous',$(this).val());
        }
    });

    $(maker.selectors.inputs.phasingCols).bind('keyup change', function ( event ) {
        if(event.type === 'keyup') {
            
            if ( event.which !== 13 ) { return; }

            var nbPrevious = $(this).data('previous'),
                nbToAdd,
                add;

            nbToAdd = $(this).val() - nbPrevious;
            add = nbToAdd > 0 ? true : false;

            nbToAdd = Math.abs(nbToAdd);

            for(var i = 0; i < nbToAdd; i+=1)
            {
                if(add) {
                    maker.addColumn({
                        selectorTable      : maker.selectors.tableCapturePhasing,
                        classCellSelector  : '.cellCP'
                    });
                } else {
                    maker.removeColumn({
                        table      : maker.selectors.tableCapturePhasing
                    });
                }
            }

            $(this).data('previous',$(this).val());

        } else if (event.type === 'change') {
             
            var nbPrevious = $(this).data('previous'),
                nbToAdd,
                add;

            nbToAdd = $(this).val() - nbPrevious;
            add = nbToAdd > 0 ? true : false;

            nbToAdd = Math.abs(nbToAdd);

            for(var i = 0; i < nbToAdd; i+=1)
            {
                if(add) {
                    maker.addColumn({
                        selectorTable      : maker.selectors.tableCapturePhasing,
                        classCellSelector  : '.cellCP'
                    });
                } else {
                    maker.removeColumn({
                        table      : maker.selectors.tableCapturePhasing
                    });
                }
            }

            $(this).data('previous',$(this).val());
        }
    });

    // 2 -  penser à faire les cas lorsqu'il y a déjà une formule d'appliquée sur la ligne, copier comportement essbase
    
    $(maker.selectors.buttons.applyFormula).click({
        input     : maker.selectors.inputs.formula,
        blocs     : {
            actionBar : maker.selectors.actionBar,
            property  : maker.selectors.formula
        },
        title     : 'Formule',
        glyphicon : 'glyphicon glyphicon-pushpin',
        errors    : {                                                                       // très moche, faire mieux que ça pour les erreurs
            empty       : 'Le champ formule est vide.',
            noSelection : 'Sélectionnez au moins une ligne où appliquer la formule.'
        },
        success   : 'La formule a été ajoutée.'
    }, maker.applyProperty);


    //multi autocomplete TODO! 

    $(maker.selectors.glyphicons.remove).click({
        actionBar : maker.selectors.actionBar
    }, maker.closeActionBar);


    $(maker.selectors.buttons.applyNote).click({
        input     : maker.selectors.inputs.note,
        blocs     : {
            actionBar : maker.selectors.actionBar,
            property  : maker.selectors.note,
        },
        glyphicon : 'glyphicon glyphicon-pencil',
        title     : 'Note',
        errors    : {
            empty       : 'Le champ note est vide.',
            noSelection : 'Sélectionnez au moins une ligne où appliquer la note.'
        },
        success   : 'La note a été ajoutée.'
    }, maker.applyProperty);


    /*$("#tab a").click(function(e){
        
        e.preventDefault();
        var tab = $(this).attr('href');

        switch(tab)
        {
            case '#retrieve'    : $('#retrieve').addClass('active');
            $('#capture').removeClass('active');

            break;

            case '#capture' : $('#capture').addClass('active');
            $('#retrieve').removeClass('active');

            break;
        }

    });*/


    /*$("#tabRowContext a").click(function(e){
        
        e.preventDefault();
        var tab = $(this).attr('href');

        switch(tab)
        {
            case '#tabRowContextRetrieve'    : $('#tabRowContextRetrieve').addClass('active');
            $('#tabRowContextCapture').removeClass('active');

            break;

            case '#tabRowContextCapture' : $('#tabRowContextCapture').addClass('active');
            $('#tabRowContextRetrieve').removeClass('active');

            break;
        }

    });

    $("#tabColumnContext a").click(function(e){
        
        e.preventDefault();
        var tab = $(this).attr('href');

        switch(tab)
        {
            case '#tabColumnContextRetrieve'    : $('#tabColumnContextRetrieve').addClass('active');
            $('#tabColumnContextCapture').removeClass('active');

            break;

            case '#tabColumnContextCapture' : $('#tabColumnContextCapture').addClass('active');
            $('#tabColumnContextRetrieve').removeClass('active');

            break;
        }

    });*/
    
    $(maker.selectors.maskTableRetrieve.name).on( 'mouseup' , '.cellR1', function(e) {
        magic.isOnSelection = false;
        //click = false;
    });

    $(maker.selectors.maskTableCapture.name).on( 'mouseup' , '.cellC1', function(e) {
        //click = false;
        magic.isOnSelection = false;
    });

    $(maker.selectors.maskTableRetrieve.name).on( 'keyup', 'td.cellR2 input', u.changeText );

    $(maker.selectors.maskTableCapture.name).on( 'keyup', 'td.cellC2 input', u.changeText );
        
    $("body").popover({ selector: '[data-toggle="popover"]' });

});





    