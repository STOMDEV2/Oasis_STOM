const webContext = "JavaProject";

const autocompleteTemplate = "<div class='autocompleteContainer ui-autocomplete ui-front ui-menu ui-widget ui-widget-content'>" + 
								"</div>";
const autocompleteHeaderTemplate = "<li class='autocompleteHeader' style='padding: 3px;'>" + 
										"<span class='autocompleteHeaderElement'></span>" + 
									"</li>";
const autocompleteElementTemplate = "<li style='padding: 3px;'>" + 
										"<a class='autocompleteElement'></a>" + 
									"</li>";


var baseAjaxObject = {
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
    error:function(data,status,er)
    {
    	u.notify({
    		message: er,
    		shouldGet: false,
    		type: "error"
    	});
    }
};

var utility = function () {

	var syncTimer;

	return {
		//verify input's type is number | voir si améliorer
		onlyNumberOnInput : function ( event ) {
			var key = event.keyCode || event.charCode;

			if( key === 16 ) return;
			if( ( key < 48 ) || ( key > 59 ) || (!event.shiftKey) ) {
				$(event.data.elementSelector).val( $(event.data.elementSelector).val().slice(0,-1) );
				//$(event.data.elementSelector).val('');
			}
		},
		//highlight row
		highlight : function ( action , selectorRow ) {

		    if( action ) {
		        $(selectorRow).attr('style','background-color : rgba(51,122,183,0.1);');
		    } else {
		        $(selectorRow).attr('style','').removeClass('selected');
		    }
		},
		//light button
		light : function( action , selectorButton) {

		    if( action ) {
		        $(selectorButton).addClass('btn-info').removeClass('btn-default');
		    } else {
		        $(selectorButton).addClass('btn-default').removeClass('btn-info');
		    }
		},
 		isRowSelected: function( el ) {

		    var selection;

		    if( $(el).hasClass('btn-default') && !$(el).parent().parent().hasClass('selected') ) {
		        selection = true;
		    } else {        
		        selection = false;
		    }    

		    return selection;

		},
		selectRow : function ( el ) {

		    if( $(el).hasClass('btn-info') && $(el).parent().parent().hasClass('selected') ) {
		        return;
		    } else {        
		        this.light( true, $(el) );
		        this.highlight( true, $(el).parent().parent());
		        $(el).parent().parent().addClass('selected');
		    }    

		    return $(el).parent().parent();

		},
		uniq : function(a) {
    		var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

		    return a.filter(function(item) {
		        var type = typeof item;
		        if(type in prims)
		            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
		        else
		            return objs.indexOf(item) >= 0 ? false : objs.push(item);
		    });
		},
		unSelectRow : function ( el ) {

		    if( $(el).hasClass('btn-default') && !$(el).parent().parent().hasClass('selected') ) {
		        return;
		    } else {        
		        this.light( false, $(el) );
		        this.highlight( false, $(el).parent().parent());
		        $(el).parent().parent().removeClass('selected');
		    }    

		    return $(el).parent().parent();
		},
		next : function ( add, cpt ) {
    		if(add) {
        		return cpt + 1;
    		} else {
        		return cpt - 1
        	}
    	},
		checkUncheck : function ( el ) {

		    var selection;

		    if( $(el).hasClass('btn-default') && !$(el).parent().parent().hasClass('selected') ) {
		        selection = true;
		        $(el).parent().parent().addClass('selected');
		    } else {        
		        selection = false;
		        $(el).parent().parent().removeClass('selected');
		    }    

		    return selection;

		},
		changeText : function ( event ) {

	        var rowIndexReceiver = $(event.target).parent().parent().index(),
	            tableSource = $(event.target).parents('table').attr('id'),
	            tableReceiver = ( tableSource === 'maskTableRetrieve' ) ? 'maskTableCapture' : 'maskTableRetrieve',
	            classCellSelector = ( tableSource === 'maskTableRetrieve' ) ? 'cellC2' : 'cellR2',
	            args = {
	                inputSource   : event.target,
	                inputReceiver : $('#' + tableReceiver + ' tbody tr:eq(' + rowIndexReceiver + ') td.' + classCellSelector +' input')
	        };

	        $(args.inputReceiver).val( $(args.inputSource).val() );

    	},
		inputModificator : function( event ) {

			if(	$(event.data.listenedElementInput).val() !== '') {

				$(event.data.elementTarget).html($(event.data.listenedElementInput).val());

			} else {

				$(event.data.elementTarget).html(event.data.content);
			}
				
		},
		isInArrayOfAttributes : function ( specifier ) {
			
			var vals = [],
				index;
			for(var i=0;typeof(specifier.elements[i])!='undefined';vals.push( Number.parseInt( specifier.elements[i++].getAttribute(specifier.attributeName) ) ) );

			index =  $.inArray(specifier.value, vals);

			for(var i = 0, cpt = vals.length; i < cpt ; i += 1) {
				console.log("value");
				console.log(specifier.value);
				console.log("current");
				console.log(vals[i]);
				if(specifier.value === vals[i])
					return true;
			}

			
			return false;
		},
		urlParam : function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		    
		    if (results == null){
		       return null;
		    }
		    else{
		       return results[1] || 0;
		    }
		},
		notify 			 : function (specifier) {

			var args = {
					message		: specifier.message,
					parameter 	: specifier.parameters,
					type 		: specifier.type,
					layout  	: specifier.layout || 'bottomCenter',
					timeout 	: specifier.timeout || 5000,
					key			: specifier.key,
					pckg		: specifier.pckg,
					shouldGet	: specifier.shouldGet
				};
			
			if(args.shouldGet == undefined)
			{
				$.ajax({
					url: '/' + webContext + '/GetInternationalizedMessage?key=' + args.key + '&pckg=' + args.pckg,
			        type: 'GET',
			        dataType: 'json',
			        success: function (data)
			        {
			        	console.log(data);
			        	
			        	args.message = data.message;
			        	
						var i = 0;
						while((pos = args.message.indexOf("%")) != -1)
						{
							args.message = args.message.replaceAt(pos, args.parameter[i]);
							console.log(pos);
							console.log(args.message);
							i++;
						}
						
						var n = noty({
			            	text        : args.message,
			                type        : args.type,
			                dismissQueue: true,
			                layout      : args.layout,
			                timeout     : args.timeout,
			                theme       : 'bootstrapTheme',
			                closeWith   : ['button', 'click'],
			                maxVisible  : 20,
			                modal       : false
			       		 });
			        },
			        error:function(data,status,er)
			        {
			            
			        }
				});
			}
			else
			{
				console.log(args);
				
				var n = noty({
	            	text        : args.message,
	                type        : args.type,
	                dismissQueue: true,
	                layout      : args.layout,
	                timeout     : args.timeout,
	                theme       : 'bootstrapTheme',
	                closeWith   : ['button', 'click'],
	                maxVisible  : 20,
	                modal       : false
	       		 });
			}
		},
		extractUrlParams : function () {
			
			var t = $(window.location).attr('href').substring(1).split('&');
			var f = [];
			
			for (var i=0; i<t.length; i++) {
				var x = t[ i ].split('=');
				f[x[0]]=f[1];
			}

			return f;
		},
		startPeriodicSync : function ( specifier ) {
			this.stopPeriodicSync();
			syncTimer = setTimeout( specifier.callback, specifier.timeout );
		},
		stopPeriodicSync  : function ( syncTimer ) {
			clearTimeout(syncTimer);
		},
		appendOptionsToSelect : function ( specifier ) {
			//créer une fonction générique pour ajouter des options voir de quoi t'as besoin puis deal
		}
	};
};

String.prototype.replaceAt=function(index, character) {
	
	console.log(this.substr(0, index));
	console.log(this.substr(index, this.length));
	
    return this.substr(0, index) + character + this.substr(index + 1, this.length);
}

function getCurrentInfos()
{
	$.ajax({
		url: '/' + webContext + '/workspace/workspace?action=getInfos',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
 
        success: function (data) {
        	
        	
        	var u = utility();
        	
//	      var message = "Bienvenue " + data.firstname + " " + data.name + " !" ;
//	      var infos = "Connecté sous " + data.login + " à " + data.appliCube + ".";
          var n = u.notify({
                            parameters  : [data.firstname, data.name],
                            type        : 'information',
                            key			: "welcome",
                            pckg		: "message"
                        });
          n = u.notify({
        	  			parameters  : [data.login, data.appliCube],
                        type        : 'information',
                        key			: "connected",
                        pckg		: "message"
                    });
        },
        error:function(data,status,er) {
            
        }
	});
}

$(document).ready(function () {
	//  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
	// |                                                                                               |
	// |                                                                                               |
	// |                                                                                               |
    // |                                     Les évènements                                            |
    // |                                        généraux                                                       |
    // |                                                                                               |
    // |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|

	
	var url = window.location.href;
	console.log(url);
	if(url.indexOf("getCurrentInfos") > -1)
		getCurrentInfos();
	

	//Gestion des onglets du menu

	//$('body').scrollspy({ target: '#menu-nav' });

	$('.nav li a').on('click', function(){
  		$('.nav').find('.active').removeClass('active');
   		$(this).parent().addClass('active');
	});
});

function buildAutoComplete(input, autocompleteContainer, data, dimensionData, isRetrieve, isAll, isPlain)
{
	autocompleteContainer.empty()
							.show();
	var inputValue = input.val();
	
	console.log(data);
	
	if(!isAll && !isPlain)
	{
		for(var key in data)
		{
			if(data.hasOwnProperty(key))
			{
				var obj = data[key];
	
	//			console.log(dimensionData.data);
	//			console.log(settings.autocomplete);
				
				dimensionData.data = dimensionData.data.replace(/[_0-9]+$/, '');
				
				var header = undefined;
				var itsok = false;
				if(obj[dimensionData.data] != undefined)
				{
					header = $(autocompleteHeaderTemplate).appendTo(autocompleteContainer);
					header.attr('name', key);
					header.find(".autocompleteHeaderElement").text(key);
					
					loop:
						for(var i = 0; i < obj[dimensionData.data].length; i++)
						{
							var autocompleteElementValue = obj[dimensionData.data][i];
		//						console.log(autocompleteElementValue);
							
		//							console.log(inputValue);
							
//							console.log(autocompleteElementValue);
							
							if(typeof autocompleteElementValue.IsMember === "undefined")
								autocompleteElementValue = [(isRetrieve? getVariableRetrieveName(autocompleteElementValue.name): 
								                            		getVariableCaptureName(autocompleteElementValue.name))];
							else
								autocompleteElementValue = [autocompleteElementValue.UniqueName, autocompleteElementValue.Alias];
							
//							console.log(autocompleteElementValue);
							
//							for(var j = 0; j < autocompleteElementValue.length; j++)
								if(autocompleteElementValue[0].toLowerCase().indexOf(inputValue.toLowerCase()) == -1 
										&& (autocompleteElementValue.length > 1 && autocompleteElementValue[1].toLowerCase().indexOf(inputValue.toLowerCase()) == -1) || autocompleteElementValue.length == 1)
									continue loop;
							
							itsok = true;
							
//							for(var j = 0; j < autocompleteElementValue.length; j++)
//							{
								var autocompleteElement = $(autocompleteElementTemplate).insertAfter(header);
								
								autocompleteElement.find(".autocompleteElement").text(autocompleteElementValue[0]);
								
//								j += 1;
//							}
						}
				}
				
				if(!itsok && header != undefined)
					header.remove();
			}
		}
	}
	else if(isAll)
	{
		console.log(data);
//		console.log("%TP_S%".toLowerCase() + " " + $("#textAreaScript").val().substring(selectionStart, $("#textAreaScript").prop("selectionStart")).toLowerCase());
//		console.log("%TP_S%".toLowerCase().indexOf($("#textAreaScript").val().substring(selectionStart, $("#textAreaScript").prop("selectionStart")).toLowerCase()));
		
		for(var key in data)
		{
			if(data.hasOwnProperty(key))
			{
				var obj = data[key];
				
//				console.log(data);
				
				loop:
					for(var i = 0; i < obj.length; i++)
					{
						var autocompleteElementValue = obj[i];
						
						autocompleteElementValue = [getVariableRetrieveName(autocompleteElementValue.name), getVariableCaptureName(autocompleteElementValue.name)] 
						
//						console.log(autocompleteElementValue);
						
						for(var j = 0; j < autocompleteElementValue.length; j++)
						{
//							console.log(autocompleteElementValue[j].toLowerCase() + " " + $("#textAreaScript").val().substring(selectionStart, $("#textAreaScript").prop("selectionStart")).toLowerCase());
							
							if(autocompleteElementValue[j].toLowerCase().indexOf($("#textAreaScript").val().substring(selectionStart, $("#textAreaScript").prop("selectionStart")).toLowerCase()) == -1)
								continue;
								
							var autocompleteElement = $(autocompleteElementTemplate).appendTo(autocompleteContainer);
							
							autocompleteElement.find(".autocompleteElement").text(autocompleteElementValue[j]);
						}
					}
			}
		}
	}
	else if(isPlain)
	{
		for(var i = 0; i < data.length; i++)
		{
			var autocompleteElementValue = data[i];
			
			var inputValue = input.val().replace(/ /g, "");
			
			var lastIndexOfComma = inputValue.lastIndexOf(";");
//			if(lastIndexOfComma == -1)
//				lastIndexOfComma = 0;
			var stringToTest = inputValue.substring(lastIndexOfComma + 1, inputValue.length);
			
			console.log(stringToTest);
			
			if(autocompleteElementValue.toLowerCase().indexOf(stringToTest.toLowerCase()) == -1)
				continue;
				
			var autocompleteElement = $(autocompleteElementTemplate).appendTo(autocompleteContainer);
			
			autocompleteElement.find(".autocompleteElement").text(autocompleteElementValue);
		}
	}
	
	console.log(autocompleteContainer.children());
	
	if(!autocompleteContainer.children().length)
	{
		autocompleteContainer.hide();
		return;
	}
	else
		autocompleteContainer.show();
	
	var mainContainer = $(".container-fluid");
	
	autocompleteContainer.css({
		"left": input.offset().left - parseInt(mainContainer.css("marginLeft")),
		"top": input.offset().top + input.height() - parseInt(mainContainer.css("marginTop")) + 10
	});
}

function getVariableRetrieveName(value)
{
	return "%" + value + "_R%";
}

function getVariableCaptureName(value)
{
	return "%" + value + "_S%";
}