$(document).ready( function () {


	var u = utility(),
		selectors = {
			settingsForm : {
				blocks : {
	            	dimensions   : "#formDimensions",
                    wellVariable : "#divVar_"
            	},
                buttons          : {
                    save    : ".save-button",
                    addVar  : "a.round-button"
                },
                inputs           : {
                    name    : '.varName',
                    base    : '.varBase'
                }
			}            	
        },
        settingsMaker = function () {

            var variablesLocalStorage;

        	return {
        		that : this, 
        		selectors : selectors.settingsForm,
                getvariablesLocalStorage : function () {
                    return this.variablesLocalStorage;
                },
                setVariablesLocalStorage : function ( variablesLocalStorage ){
                    this.variablesLocalStorage = variablesLocalStorage;
                },
        		displayDimensions : function ( spec ) {
        			
        			for (var i = 0, cpt = spec.dimensions.length; i < cpt ; i +=1 ) {
    	    			
    	    			var buttonName = spec.dimensions[i],
	                    	buttonId = buttonName.replace(' ','_');

        				$("#variableNav").append(
                            '<li class="nav' + ( i === 0 ? ' active"' : '"') + '><a href="#tab_' + buttonId + '" data-toggle="tab">'+ buttonName + '</a></li>' );

                        $('#variablePanes').append(
                            '<div class="tab-pane fade' + (i === 0 ? ' in active"' : '"') + ' id="tab_' + buttonId + '">'
                        +       '<div id="'+ buttonId + '" class="form-group">'
                        +           '<div class="col-lg-12">'
                        +               '<div id="divVar_'+ buttonId + '" class="well wells-content">'
                        +                   '<div class="row">'
                        +                       '<div class="col-md-offset-1 col-md-2">'
                        +                           '<h4>Ajouter Supprimer</h4>'
                        +                       '</div>'
                        +                       '<div class="col-md-3">'
                        +                           '<h4>Variable</h4>'
                        +                       '</div>'
                        +                       '<div class="col-md-3">'
                        +                           '<h4>Retrieve</h4>'
                        +                       '</div>'
                        +                       '<div class="col-md-3">'
                        +                           '<h4>Capture</h4>'
                        +                       '</div>'
                        +                   '</div>'
                        +                   '<div class="row line-spacing-1 varLine">'
                        +                       '<div class="form-group">'
                        +                           '<div class="col-md-offset-1 col-md-2">'
                        +                               '<button type="button" class="btn btn-primary addButton">+</button>'
                        +                               '<button type="button" class="btn btn-primary removeButton">-</button>'
                        +                           '</div>'
                        +                           '<div class="col-md-3">'
                        +                               '<input type="text" class="form-control wells-input varName" placeholder="Nom de la variable">'
                        +                           '</div>'
                        +                       '</div>'
                        +                   '</div>'
                        +                   '<div class="row line-spacing-2">'
                        +                       '<div class="col-md-offset-1 col-md-2">'
                        +                           '<span id="saveVar_' + buttonId +'" class="btn btn-primary save-button addVar">Sauvegarder les variables</span>'
                        +                       '</div>'
                        +                   '</div>'
                        +               '</div>'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>');

                        

        			}

               },
               getPositionVariableInArray : function ( variableWanted ) {
                    
                    for(var j = 0, jCpt = this.variablesLocalStorage[variableWanted.associatedDimension].length; j < jCpt; j+= 1 ) {

                        if( this.variablesLocalStorage[variableWanted.associatedDimension][j].Id === variableWanted.id ) {

                            this.variablesLocalStorage[variableWanted.associatedDimension][j] = variableWanted;
                            return j;
                       }
                    }

                    return -1;
               },
               displayRegistredVariables : function ( spec ) {

                    if(spec.variables.length > 0 ) {

                        var id,
                        name,
                        associatedDimension,
                        retrieve,
                        elements = $('.varName[data-stcg-id]').toArray();

                        for(var i = 0, cpt = spec.variables.length; i < cpt; i += 1)
                        {
                            console.log(spec.variables[i]);

                            id = spec.variables[i].id;

                            name = spec.variables[i].name;

                            associatedDimension = spec.variables[i].associatedDimension;
                            associatedDimension = associatedDimension.replace(' ','_');
                            console.log(maker.selectors.blocks.wellRetrieve + associatedDimension);


                            $( maker.selectors.blocks.wellVariable + associatedDimension).children('.varLine:first').before(
                                '<div class="row line-spacing-1 varLine">'
                                +        '<div class="form-group">'
                                +            '<div class="col-md-offset-1 col-md-2">'
                                +                '<button type="button" class="btn btn-primary addButton">+</button>'
                                +                '<button type="button" class="btn btn-primary removeButton">-</button>'
                                +            '</div>'
                                +            '<div class="col-md-3">'
                                +                '<input type="text" class="form-control wells-input varName" placeholder="Nom de la variable" data-stcg-id="' + id + '" value="' + name +'">'
                                +            '</div>'
                                +            '<div class="col-md-3 displayRetrieve">'
                                +                '<p class="blue wrapped-content">%' + name + '_R%</p>'
                                +            '</div>'
                                +            '<div class="col-md-3 displayCapture">'
                                +                '<p class="green wrapped-content">%' + name + '_C%</p>'
                                +            '</div>'
                                +        '</div>'
                                +    '</div>');                               

                        }

                        
                        

                        
                    }
               }
           };
        },
        maker = settingsMaker( ),
        idCube = JSON.parse( sessionStorage.getItem('cube')).Id,
        dimensions = JSON.parse( localStorage.getItem('dimensions') ),
        variablesArray = [];
        
        maker.setVariablesLocalStorage( JSON.parse(localStorage.getItem('variablesPerDimension')) );
        console.log('variablesLocalStorage');
        console.log(maker.getvariablesLocalStorage());
        
        maker.displayDimensions({
            dimensions :  dimensions
        });

        for(var i = 0, cpt = dimensions.length; i < cpt; i+=1 )
        	if(maker.getvariablesLocalStorage()[dimensions[i]] != undefined)
	            for(var j = 0, jCpt = maker.getvariablesLocalStorage()[ dimensions[i] ].length; j < jCpt; j+=1 ) 
	                variablesArray.push( maker.getvariablesLocalStorage()[dimensions[i]][j] );
        

	 	/*$.ajax({
        	url: 'settings?action=getDimensions',
        	type: 'GET',
        	dataType: 'json',
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

            	if(data.dimensions) {
                	// afficher/lister toutes les dimensions de l'application avec un interrupteur en face

                	maker.displayDimensions({
	                	dimensions : data.dimensions
                	});
                }
            
        	},
        	error:function(data,status,er) {
                   maker.displayDimensions({
                        dimensions : ['Time periods','Account','View','Flows','Scenarii','Sociétés','Measures','Activity','Cost Centre','Organisation']
                    });
         
            	u.notify({
                	message : er,
                	type    : 'error',
                	shouldGet: false
            	});

	        }
    	});*/

        /*$.ajax({
            url: 'settings?action=getIdCube',
            type: 'GET',
            dataType: 'json',
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

                if(data.idCube) {
                    // afficher/lister toutes les dimensions de l'application avec un interrupteur en face

                   idCube = data.idCube;
                }
            
            },
            error:function(data,status,er) {
                  
         
                u.notify({
                    message : er,
                    type    : 'error',
                    shouldGet: false
                });

            }
        });*/
    
        
        maker.displayRegistredVariables({
            variables : variablesArray
        });
        /*$.ajax({
            url: 'settings?action=getVariables',
            type: 'GET',
            dataType: 'json',
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

                if(data.variables) {
                    
                    maker.displayRegistredVariables({variables : data.variables});
                    console.log('vars ' + data.variables);
                }
            
            },
            error:function(data,status,er) {
                
                u.notify({
                    message : er,
                    type    : 'error',
                    shouldGet: false
                });

            }
        });*/

        $(maker.selectors.blocks.dimensions).on('click','span', function ( e ) {
            
            

            if( $(this).hasClass('bootstrap-switch-label') || $(this).hasClass('bootstrap-switch-handle-on') || $(this).hasClass('bootstrap-switch-handle-off') || $(this).hasClass('bootstrap-switch-primary') ) {
                return;
            }

            /**var id = $(this).attr('id');
            alert('id' + id);
            console.log(this);*/


        });

//        $(maker.selectors.blocks.dimensions).on('switchChange.bootstrapSwitch', '.switch', function(event, state) {
//
//                        var id = $(this).attr('id'),
//                            idDimensionName = id.substring(5,id.length),
//                            dimensionName = idDimensionName.replace('_',' ');
//
//                            
//
//                        if( $('#divVar'+ idDimensionName).length > 0 ) {
//                            
//                            if(state) {
//                                $('#divVar' + idDimensionName).removeClass('hide').addClass('show');
//                            } else {
//                                $('#divVar' + idDimensionName).removeClass('show').addClass('hide');
//                                
//                            }
//
//                        } else {
//
//                            $('#parent'+ idDimensionName).after(
//                                '<div id="divVar' + idDimensionName + '" class="form-group">'
//                            +       '<div class="col-md-offset-2 col-md-10">'
//                            +           '<div id="divVar_'+ idDimensionName + '" class="well wells-content">'
//                            +               '<div class="row">'
//                            +                   '<div class="col-md-2">'
//                            +                       '<span id="saveVar_' + idDimensionName +'" class="btn btn-primary save-button addVar">Sauvegarder les variables</span>'
//                            +                   '</div>'
//                            +                '</div>'
//                            +                '<div class="row line-spacing-2 varLine">'
//                            +                   '<div class="form-group">'
//                            +                       '<div class="col-md-offset-1 col-md-2">'
//                            +                           '<button type="button" class="btn btn-primary addButton">+</button>'
//                            +                           '<button type="button" class="btn btn-primary removeButton">-</button>'
//                            +                       '</div>'
//                            +                       '<div class="col-md-3">'
//                            +                           '<input type="text" class="form-control wells-input varName" placeholder="Nom de la variable">'
//                            +                       '</div>'
//                            +                   '</div>'
//                            +               '</div>'
//                            +           '</div>'
//                            +       '</div>'
//                            +   '</div>');
//                        
//
//                            
//
//                        }
//                        }
//
//
//
//                    
//
//
//
//        });

        $(maker.selectors.blocks.dimensions).on('click', maker.selectors.buttons.save, function ( e ) {
            var idWellParent = $(this).parents().closest('.well').attr('id'),
                vars = [],
                varsToModify = [],
                dimension = idWellParent.substring(idWellParent.indexOf('_'), idWellParent.length).replace('_',''),
                dimensionName = dimension.replace('_',' ');

            $('#' + idWellParent).children('.varLine').each(function( index, line ) {
                console.log('data-stcg-id');
                console.log($(line).children().find('input' + maker.selectors.inputs.name).data('stcg-id'));
                
                if ( $(line).children().find('input' + maker.selectors.inputs.name).val() !== '' && $(line).children().find('input' + maker.selectors.inputs.name).data('stcg-id') === undefined ){

                    var o = {};
                    o.id = 0;
                    o.name = $(line).children().find('input' + maker.selectors.inputs.name).val();
                    o.associatedDimension = dimensionName;

                    if(idCube !== undefined)
                        o.idCube = idCube;

                    vars.push(o);

                } else if ( $(line).children().find('input' + maker.selectors.inputs.name).data('stcg-id') >= 0 ) {

                    var o = {},
                        testName;

                    o.id = $(line).children().find('input' + maker.selectors.inputs.name).data('stcg-id');
                    o.name = $(line).children().find('input' + maker.selectors.inputs.name).val();
                    o.associatedDimension = dimension.replace('_',' ');

                    if(idCube !== undefined)
                        o.idCube = idCube;

                    testName = $(line).children().find('input' + maker.selectors.inputs.name).attr('value');

                    if( (o.name != testName )  ) {
                        varsToModify.push(o);
                    } else 
                        return;
                }
                else {//factoriser
                    
                    if( $(line).siblings().length > 1 ) {
                        $(line).remove();
                    } else {
                        $(line).children('.form-group').removeClass('has-success').removeClass('has-error').removeClass('has-warning');
                        $(line).children().find('.varName').val('');
                        $(line).children().find('.varName').attr('value','');
                        $(line).children().find('.varName').removeData('stcg-id');
                    }
                        
                }
            });

            
            console.log('vars');
            console.log( JSON.stringify(vars) );
            console.log('varsToModify');
            console.log( JSON.stringify(varsToModify) );
          
            if (vars.length > 0 ) {

                $.ajax({
                    url: 'settings?action=saveDimensionsVars',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                    	data: JSON.stringify(vars)
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

                        if( data.variables ) { // factoriser

                            for( var i =0, cpt = data.variables.length; i < cpt ; i += 1)
                            {
                                var name = data.variables[i].name,
                                    baseName = data.variables[i].name,
                                    id   = data.variables[i].id;

                                $('#' + idWellParent).children('.varLine').each( function (i, line ) {

                                    if( $(line).children().find(maker.selectors.inputs.name).val() === name  && $(line).children().find(maker.selectors.inputs.name).data('stcg-id') === undefined) {
                                        
                                        $(line).children().find(maker.selectors.inputs.name).data('stcg-id', id);
                                        $(line).children().find(maker.selectors.inputs.name).attr('value', baseName);
                                        $(line).children('.form-group').addClass('has-success').removeClass('has-error').removeClass('has-warning');
                                        $(line).children('.form-group').append(
                                            '<div class="col-md-3 displayRetrieve">'                          +
                                                '<p class="blue wrapped-content">%' + baseName + '_R%</p>'    +
                                            '</div>'                                                          +
                                            '<div class="col-md-3 displayCapture">'                           +
                                                '<p class="green wrapped-content">%' + baseName + '_S%</p>'   +
                                            '</div>');


                                        maker.getvariablesLocalStorage()[dimensionName].push({
                                            id                  : id,
                                            name                : name,
                                            associatedDimension : dimensionName
                                        });

                                        return false;
                                    }
                                });
                            }
                        }

                        if(data.saved)
                        {
                        	if(data.saved.indexOf(",") > -1)
	                            u.notify({
	                            	parameters	: [data.saved],
	                                key 		: 'variablesSaved',
	                                pckg 		: 'variable',
	                                type    	: 'success',
	                            });
	                        else
	                            u.notify({
	                            	parameters	: [data.saved],
	                                key 		: 'variableSaved',
	                                pckg 		: 'variable',
	                                type    	: 'success',
	                            });
                        }

                        if(data.duplicated)
                        {
                        	if(data.saved.indexOf(",") > -1)
	                            u.notify({
	                            	parameters	: [data.duplicated],
	                                key 		: 'variablesDuplicated',
	                                pckg 		: 'variable',
	                                type    	: 'error'
	                            });
                        	else
	                            u.notify({
	                            	parameters	: [data.duplicated],
	                                key 		: 'variableDuplicated',
	                                pckg 		: 'variable',
	                                type    	: 'error'
	                            });
                       }

                        if( data.unsaved ) {
                            

                            for( var i =0, cpt = data.unsaved.length; i < cpt ; i+= 1)
                            {
                                var name = data.unsaved[i].name.substring(0, data.unsaved[i].name.length - 2);
                                    id   = data.unsaved[i].id;

                                $('#' + idWellParent).children('.varLine').each( function (i, line ) {

                                    if( $(line).children().find(maker.selectors.inputs.name).val() === name  && $(line).children().find(maker.selectors.inputs.name).data('stcg-id') === undefined) {
                                        
                                        $(line).children('.form-group').addClass('has-error').removeClass('has-success');
                                    }
                                });
                            }
                        }


                        if( data.error ) {

                            for( var i = 0, cpt = data.error.length; i < cpt; i+= 1){
                                u.notify({
                                    message : data.error[i],
                                    type    : 'error',
                                    shouldGet: false
                                });
                            }
                        }




                    },
                    error:function(data,status,er) {
                        
                        u.notify({
                            message : er,
                            type    : 'error',
                            shoulGet: false
                        });
                        
                        console.log("error: "+data+" status: "+status+" er:"+er);
                    }
                });
            }

            if ( varsToModify.length > 0) {
                
                $.ajax({
                    url: 'settings?action=modifyVars',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                    	data: JSON.stringify(varsToModify)
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
                        
                        if(data.saved)                            
                        {
                        	if(data.saved.indexOf(",") > 0)
	                            u.notify({
	                            	parameters	: [data.saved],
	                                key 		: 'variablesModified',
	                                pckg 		: 'variable',
	                                type    : 'success'
	                            });
                        	else
	                            u.notify({
	                            	parameters	: [data.saved],
	                                key 		: 'variableModified',
	                                pckg 		: 'variable',
	                                type    : 'success'
	                            });
                        }

                        if(data.variables)
                        {
                            console.log('variables');
                            console.log(data.variables);

                            var variablesLS = maker.getvariablesLocalStorage();
                            //si id match on affiche en vert
                            for( var i =0, cpt = data.variables.length; i < cpt ; i+= 1)
                            {
                                var id   = data.variables[i].id,
                                    name = data.variables[i].name;


                                $('#' + idWellParent).children('.varLine').each( function (i, line ) {

                                    if( $(line).children().find(maker.selectors.inputs.name).data('stcg-id') === id ) {
                                        
                                        $(line).children().find(maker.selectors.inputs.name).val(name);
                                        $(line).children().find(maker.selectors.inputs.name).attr('value', name);
                                        $(line).children('.form-group').addClass('has-success').removeClass('has-error').removeClass('has-warning');
                                        $(line).children('.form-group').find('.displayRetrieve').html('<p class="blue wrapped-content">%' + name + '_R%</p>');
                                        $(line).children('.form-group').find('.displayCapture').html('<p class="green wrapped-content">%' + name + '_S%</p>');

                                        return false;
                                    }
                                });

                                /*for(var j = 0, jCpt = variabesLS[data.variables[i].associatedDimension].length; j < jCpt; j+=1 ) {
                                    if( variabesLS[data.variables[i].associatedDimension][j].Id === data.variables[i].id)
                                        vaSriabesLS[data.variables[i].associatedDimension][j] = data.variables[i];

                                    break;
                                }*/

                                variablesLS[data.variables[i].associatedDimension].splice( maker.getPositionVariableInArray( data.variables[i] ) ,1,data.variables[i]);
                            }


                        }

                        //tester pour voir si cas d'erreur possible 
                    },
                        error:function(data,status,er) {
                            
                            u.notify({
                                message : er,
                                type    : 'error',
                                shouldGet: false
                            });
                            
                            console.log("error: "+data+" status: "+status+" er:"+er);
                        }
                    });

            }

            if ( vars.length === 0 && varsToModify.length === 0 ) {
                u.notify({
                    message : 'Aucune nouvelle variable à sauvegarder.',
                    type    : 'information'
                });
            }


        });
        

        $(maker.selectors.blocks.dimensions).on('focus','.varName', function ( e ) {

            if($(this).data('stcg-id') >= 0) {

                $(this).parents('.form-group:first').removeClass('has-error').removeClass('has-success').removeClass('has-warning');

            }
 
        });

        $(maker.selectors.blocks.dimensions).on('focusout','.varName', function ( e ) {
                
            if( $(this).data('stcg-id') >= 0 ) {

                var value = $(this).attr('value'),
                    val   = $(this).val();

                    if( val  !== value ) 
                        $(this).parents('.form-group:first').removeClass('has-success').removeClass('has-error').addClass('has-warning');
            }

        });


        $(maker.selectors.blocks.dimensions).on('click','button.addButton', function ( e ) {
            
            var idWellParent = $(this).parents().closest('.well').attr('id'),
                indice,
                classToAdd;


            $('#' + idWellParent + ' .varLine:last').after(
                '<div class="row line-spacing-1 varLine">'
            +       '<div class="form-group">'                
            +           '<div class="col-md-offset-1 col-md-2">'
            +               '<button type="button" class="btn btn-primary addButton">+</button>'
            +               '<button type="button" class="btn btn-primary removeButton">-</button>'
            +           '</div>'
            +           '<div class="col-md-3">'
            +               '<input type="text" class="form-control wells-input varName" placeholder="Nom de la variable">'
            +           '</div>'
            +       '</div>'
            +   '</div>');
        });

        $(maker.selectors.blocks.dimensions).on('click','button.removeButton', function ( e ) {
            
            var rowParent = $(this).parents().closest('.row'),
                idWellParent = $(this).parents().closest('.well').attr('id'),
                idDimension = idWellParent.substring(idWellParent.indexOf('_'), idWellParent.length).replace('_','');
                

            if( $(rowParent).children().find('.varName').data('stcg-id') !== undefined ) {

                var o = {},
                    vars = [];

                o.id   = $(rowParent).children().find('.varName').data('stcg-id');
                o.name = $(rowParent).children().find('.varName').val();
                o.associatedDimension = idDimension.replace('_',' ');
                
                if(idCube !== undefined)
                        o.idCube = idCube;


                maker.getvariablesLocalStorage()[o.associatedDimension].splice( maker.getPositionVariableInArray( o ) ,1);

                vars.push(o);

                console.log(JSON.stringify(vars));

                $.ajax({
                    url: 'settings?action=removeVar',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                    	data: JSON.stringify(vars)
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
                        if( data.message ) {
                            
                            if( $(rowParent).siblings().length > 1 ) {

                                $(rowParent).remove();
                            } else {

                                $(rowParent).children('.form-group').removeClass('has-success').removeClass('has-error').removeClass('has-warning');
                                $(rowParent).children().find('.varName').val('');
                                $(rowParent).children().find('.varName').attr('value','false');
                                $(rowParent).children().find('.varName').removeData('stcg-id');
                            }

                            u.notify({
                            	parameters	: [data.message],
                            	pckg		: "variable",
                                key			: "variableRemoved",
                                type    	: 'success'
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
                                type    : 'error',
                                shouldGet: false
                            });
                            
                            console.log("error: "+data+" status: "+status+" er:"+er);
                        }
                    });

            }
            else
            {//factoriser
                if( $(rowParent).siblings().length > 1 ) {
                    $(rowParent).remove();
                } else {
                    $(rowParent).children('.form-group').removeClass('has-success').removeClass('has-error').removeClass('has-warning');
                    $(rowParent).children().find('.varName').val('');
                    $(rowParent).children().find('.varName').attr('value','');
                    $(rowParent).children().find('.varName').removeData('stcg-id');
                }
            }
                
            

        });
        
    

        window.onbeforeunload = function (e) {
            localStorage.setItem('variablesPerDimension', JSON.stringify( maker.getvariablesLocalStorage() ) );
        };      
    	
    
});