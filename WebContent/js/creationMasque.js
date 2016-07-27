$(document).ready(function(){
//1- retirer le code mort
//  2 - réécrire les events et mettre tout dans specifier

// 6 - la colonne formule unité - redemander





 

    var u = utility(),
        selectors = {
            maskForm : {
                nameTitle         : '#nameTitle',
                inputs : {
                    input         : '#nameMask' // appelé comme ça parce qu'à la base un seul input sur la page qui était pour le nom du masque, à changer après
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
                    captureHader      : '#tabCaptureHeader',
                    retrieveHistoric  : '#tabRetrieveHistoric',
                    captureHistoric   : '#tabCaptureHistoric'
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
    contextTableMaker = function ( ) {
        
        var appliCube = "",
            membersPerDimension,
            variablesPerDimension;


        return {
            that                : this, 
            selectors           : selectors.maskForm,
            getAppliCube        : function ( ) {
                return this.appliCube;
            },
            setAppliCube        : function ( appliCube ) {
                this.appliCube = appliCube;
            },
            getMembersPerDimension : function ( )
            {
                return this.membersPerDimension;
            },
            setMembersPerDimension : function ( membersPerDimension )
            {
                this.membersPerDimension = membersPerDimension;
            },
            getVariablesPerDimension : function ( )
            {
                return this.variablesPerDimension;
            },
            setVariablesPerDimension : function ( variablesPerDimension )
            {
                this.variablesPerDimension = variablesPerDimension;
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

                    }

                }

                $(this.selectors.dragNDrop.elements).css('z-index','100');

                

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
                        +               '<input type="text" class="form-control easyCapture" id="headerRetrieve_' + id +'" name="headerRetrieve_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        $(that.selectors.blocks.headerPairC).append(
                            '<div id="formCapture_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerCapture_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control easyCapture" id="headerCapture_' + id +'" name="headerCapture_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                    } else {

                        $(that.selectors.blocks.headerImpairR).append(
                            '<div id="formRetrieve_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerRetrieve_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control easyCapture" id="headerRetrieve_' + id +'" name="headerRetrieve_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        $(that.selectors.blocks.headerImpairC).append(
                            '<div id="formCapture_' + id + '" class="form-horizontal">'
                        +       '<div class="form-group">'
                        +           '<label for="headerCapture_'+ id + '" class="col-md-offset-3 col-md-2 control-label">' + name + '</label>'
                        +           '<div class="col-md-3">'
                        +               '<input type="text" class="form-control easyCapture" id="headerCapture_' + id +'" name="headerCapture_' + id + '" placeholder="var">'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');
                    }
                });




            },
            enableDimensionsDragNDrop : function ( ) {

                var that = this;

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

                        if(droppedOn.attr('id') === 'divRowContext')
                        {

                            //retrait des dimensions de la zone d'en-tête
                            $(that.selectors.blocks.forms.retrieve + idDimensionName).remove();
                            $(that.selectors.blocks.forms.capture + idDimensionName).remove();
                            //fin retrait

                        	spreadSheetLines.autoSelect("Formule 1");
                        	spreadSheetLines.addColumn([
	                    	                            	{
	                    	                            		data: ""
	                    	                            	},
															{
																data: dimensionName,
																isEditable: true
															}
														], false);
                        	
                        	spreadSheetLines.autoSelect("Formule 2");
                        	spreadSheetLines.addColumn([
                        	                            	{
                        	                            		data: ""
                        	                            	},
															{
																data: dimensionName + "2",
																isEditable: true
															}
														], false);

                        }
                        else if( $(this).attr('id') === 'divColumnContext' )
                        {
                            //retrait des dimensions de la zone d'en-tête
                            $(that.selectors.blocks.forms.retrieve + idDimensionName).remove();
                            $(that.selectors.blocks.forms.capture + idDimensionName).remove();
                            //fin retrait
                        	console.log("JE PASSE PAR LA");
                        	
							spreadSheetColumns.addLine([
															{
																data: dimensionName,
																isEditable: true
															}
														]);
                        }
                        else if( $(this).attr('id') === 'divDimensions')
                        {
                             if(idParent != 'divDimensions') {

                                var nbChildsPairR   = $(that.selectors.blocks.headerPairR).children().length,
                                    nbChildsImpairR = $(that.selectors.blocks.headerImpairR).children().length;

                                if( nbChildsPairR >= nbChildsImpairR ) {
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

                        	if(idParent == "divRowContext")
                        	{
	                        	/*	LINES	*/
	                        	spreadSheetLines.autoSelect(dimensionName);
	                        	spreadSheetLines.removeLine();
	                        	spreadSheetLines.autoSelect(dimensionName + "2");
	                        	spreadSheetLines.removeLine();
                        	}
                        	else if(idParent == "divColumnContext")
                        	{
	                        	/*	COLUMNS	*/
								spreadSheetColumns.autoSelect(dimensionName);
								spreadSheetColumns.removeLine();
                        	}
                        }
                });
            },
            getMaskObject : function ( maskObject ) {
                var maskObjectJSON = JSON.stringify(maskObject);

                console.log(maskObjectJSON);


                $.ajax({
                    url: 'createMask?saveMask=true',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                    	mask: JSON.stringify(maskObject)
                    },             
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
            saveMask : function ( selectorMaskTable, selectorContextTable, maker ) {
               

                var i,
                    maskObject = {
	                    mask			: {
	                    	nameMask: $(this.selectors.inputs.input).val() || ""
	                    },
	                    rowContext    	: spreadSheetLines.getRowContext(),
	                    columnContext 	: spreadSheetColumns.getColumnContext()
                };

                if(maskObject.nameMask === "") {
                    
                    u.notify({
                        message : 'Veuillez saisir un nom pour le masque.',
                        type    : 'error'
                    });

                    return ;
                }

                return maker.getMaskObject(maskObject);
    

            }

        };
    },
    maker = contextTableMaker();

    $.get('createMask?action=getApplication', function( data ) {
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
        url: 'createMask?action=getDimensions',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
 
        success: function (data) {

            if(data.dimensions) {
                maker.getDimensionsButton( data );
                maker.enableDimensionsDragNDrop(  );
                
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
        url: 'createMask?action=getMembersPerDimension',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
 
        success: function (data) {

            if(data.membersPerDimension) {
                maker.setMembersPerDimension( data.membersPerDimension );
            }      

            console.timeEnd("getMembersPerDimension");
        },
        error:function(data,status,er) {

            u.notify({
                message : er,
                type    : 'error' 
            });

        }
    });

    $.ajax({
        url: 'createMask?action=getVariablesPerDimension',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
 
        success: function (data) {

            console.log(data);

            if(data.variablesPerDimension)
            {
                maker.setVariablesPerDimension( data.variablesPerDimension );
                maker.makeHeader();    
            }
            
                        
        },
        error:function(data,status,er) {

          
        }
    });


  
    //var selectorContextTable = '#maskTableRetrieve tbody',
    //selectorMaskTable = '#contextTable tbody tr';
/*
   $('.formCols').keypress(function( event ){
        return(event.which !== 13);
    });

    $(maker.selectors.buttons.save).click(function () {
        //'#maskTable tbody tr','#contextTable tbody tr'
        maker.saveMask(maker.selectors.maskTableRetrieve.lines,maker.selectors.contextTable.lines,maker);
    });*/

 /*   $(maker.selectors.buttons.addRow).click(function () {

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

    });*/


    $(maker.selectors.inputs.input).keyup({
        listenedElementInput : maker.selectors.inputs.input,
        content              : 'Nom du masque',
        elementTarget        : maker.selectors.nameTitle
    }, u.inputModificator );

    $(maker.selectors.inputs.addRow).keyup({
        elementSelector : maker.selectors.inputs.addRow
    }, u.onlyNumberOnInput);
    
    //à refactoriser
   /* $(maker.selectors.inputs.historicCols).bind('keyup change', function ( event ) {
        
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
    });*/

    // 2 -  penser à faire les cas lorsqu'il y a déjà une formule d'appliquée sur la ligne, copier comportement essbase
    
   /* $(maker.selectors.buttons.applyFormula).click({
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
    }, maker.applyProperty);*/
    
    
   /* $(maker.selectors.maskTableRetrieve.name).on( 'mouseup' , '.cellR1', function(e) {
        magic.isOnSelection = false;
        //click = false;
    });*/

   /* $(maker.selectors.maskTableCapture.name).on( 'mouseup' , '.cellC1', function(e) {
        //click = false;
        magic.isOnSelection = false;
    });

    $(maker.selectors.maskTableRetrieve.name).on( 'keyup', 'td.cellR2 input', u.changeText );

    $(maker.selectors.maskTableCapture.name).on( 'keyup', 'td.cellC2 input', u.changeText );*/

});