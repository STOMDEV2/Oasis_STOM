$(document).ready( function() {

	var selectors = {
			form 			: '#actualForm',
			selectAppliCube : '#selectAppliCube',
			connectButton	: '#connectButton',
			inputs 			: {
								login 	 : '#inputLogin',
								password : '#inputPassword',
								server 	 : '#inputServer' 
							  },
			button  		: '#connectButton'
		},
		u = utility();
		
		$.ajax({ 
			type: 'GET', 
			url: 'login?action=load', 
			async: true,
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
		    success: function(data) {
						if(data) {
							console.log(data);

							var json = $.parseJSON(data);

							$(selectors.inputs.login).attr('value',json.credentials[0]);
							$(selectors.inputs.server).attr('value', json.credentials[1]);	
						}						
					}
			}
		);


	var connexionForm = function (sel) {

		return {
			selectors 		: sel,
			getCredentials : function () {

				return {
					login 		: $.trim($(selectors.inputs.login).val()),
					password 	: $.trim($(selectors.inputs.password).val()),
					server 		: $.trim($(selectors.inputs.server).val())
				};
			},
			getForm: function () {

				return {
					login 				 : $.trim($(selectors.inputs.login).val()),
					inputSaveCredentials : $('#inputSaveCredentials').is(':checked'),				
					application 		 : $.trim( $(selectors.selectAppliCube + ' option:selected').attr('value') ),
					server 				 : $.trim($(selectors.inputs.server).val())
				};
			},
			showSelectApplications : function() {

				$(selectors.selectAppliCube).removeClass('hide').addClass('show');

			},
			hideSelectApplications : function() {

				$(selectors.selectAppliCube).removeClass('show').addClass('hide');
			},
			addApplications : function( data ) {

				for(var i = 0, cpt = data.applications.length; i < cpt; i += 1) {
					$(selectors.selectAppliCube).append('<option name = "application" value="' + data.applications[i] + '">' 
													+ data.applications[i] +'</option>');
				}

			}
		};

		},
		actualForm = connexionForm(selectors);

	//Evènements du formulaire
	//____________________________________________________________________________________________________________________________________
	
	// annihile le comportement par défaut de l'évènement submit du formulaire (validation par touche entrée)
	$(actualForm.selectors.form).keypress(function( event ){
		return(event.which !== 13);
	});

	
  	function getApplicationsRequest ( event , source)
  	{
  		var ok = false;

		if(source) {
			ok	= source;
		}

		if((event.which === 13 && !$( selectors.selectAppliCube ).is( ":visible" )) || (event.type === 'keyup' && ok)) {

			var credentials = JSON.stringify( actualForm.getCredentials() );

	        $.ajax({
	              url: 'login?action=getApplications',
	              type: 'POST',
	              dataType: 'json',
	              data: credentials, 
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
	            	  			if(data.applications) {
	            	  				$(selectors.messageField).html('');
	            	  				$('label[for*="selectAppliCube"]').html('');
	            	  				$('label[for*="selectAppliCube"]').text('Applications');

	            	  				actualForm.addApplications(data);
	            	  				actualForm.showSelectApplications();
	            	  			} else {
	            	  				$('label[for*="selectAppliCube"]').html(''); 
	            					
	            					u.notify({
	            						message 	: data.error,
	            						type 		: 'error',
	            						shouldGet	: false
	            					});
	            	  				
	            	  			}
	              },
	              error:function(data,status,er) {
	                

	              }
	        });
	
//	        $('label[for*="selectAppliCube"]').html('<img src="img/ajax-loader.gif" />');
        } 
  	}
  		

	$(selectors.inputs.server).on( 'keyup', getApplicationsRequest );

	
	$(actualForm.selectors.button).click(function( event ){

		if($(actualForm.selectors.form).find('option:selected').attr('value') === "none") {

			if( !$( selectors.selectAppliCube ).is( ":visible" ) ) {
				$(actualForm.selectors.inputs.server).trigger( 'keyup', true);

				u.notify({
					key 	: 'pressEnterAppList',
					type 	: 'information',
					pckg	: 'connection'
				});

			} else {
				
				u.notify({
					key 	: 'needAppSelected',
					type 	: 'warning',
					pckg	: 'connection'
				});
			}

			return false;
			
		} else {

			console.log('getForm');
			console.log(actualForm.getForm());

			$.ajax({
				url: 'login?action=connexion',
				type: 'POST',
				dataType: 'json',
			    data: {datas :JSON.stringify( actualForm.getForm() )}, 
			    beforeSend: function()
			    {
			        if(typeof(busyIndicatorBeforeSend) == "function")
			        	busyIndicatorBeforeSend();
			    },
			    complete: function()
	          	{
	          		if(typeof(busyIndicatorOnComplete) == "function")
	          			busyIndicatorOnComplete();

	          		$.ajax({
						url: 'login?action=redirect',
						type: 'POST',
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
	          				
	          				if(data.redirect)
	          					$(window.location).attr('href',data.redirect);
	          			},
	          			error:function(data,status,er) {

	          				console.log(data);
	          				console.log(status);
	          				console.log(er);
	          			}
					});
	          	},
	          	success: function (data) {

	          		sessionStorage.setItem('applicationCube', $(selectors.selectAppliCube + ' option:selected').attr('value') );

	          		//already JSONed data
	          		if(data.bottomLevelPerDimension)
	          			localStorage.setItem('bottomLevelPerDimension', JSON.stringify(data.bottomLevelPerDimension) );
	          		if(data.cubes)
	          			localStorage.setItem('cubes', JSON.stringify( data.cubes ));

	          		if( data.cube ) 
	          			sessionStorage.setItem('cube', JSON.stringify(data.cube) );

	          		if( data.dimensions )
	          			localStorage.setItem('dimensions' , JSON.stringify(data.dimensions) );

	          		if( data.membersPerDimension) 
	          			localStorage.setItem('membersPerDimension', JSON.stringify(data.membersPerDimension));

	          		if( data.variablesPerDimension )
	          			localStorage.setItem('variablesPerDimension', JSON.stringify(data.variablesPerDimension));

	          		console.log('data');
	          		console.log(data);

	          	},
	          	error:function(data,status,er) {

	          		console.log(data);
	          		console.log(status);
	          		console.log(er);
	          	}
			});

			return false;
//			$('#loader').html('<img src="img/ajax-big-loader.gif" />');
		}
	});

	
	
	


});