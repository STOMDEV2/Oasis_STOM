var accessToolbar = {};

$(document).ready(function () { 

	var toolbarAction = function () {

			var showModal = false,
				showComment = false,
				showInfos = false,
				showScenarioParameters = false,
				displayedElts = 0;

			return {
				isShowModal : function () {
					return this.showModal;
				},
				isShowComment : function () {
					return this.showComment;
				},
				isShowScenarioParameters : function () {
					return this.showScenarioParameters;
				},
				setShowModal : function ( showModal ) {
					this.showModal = showModal;
				},
				setShowComment : function ( showComment ) {
					this.showComment = showComment;
				},
				setShowScenarioParameters : function ( showScenarioParameters ) {
					this.showScenarioParameters = showScenarioParameters;
				},
				isShowInfos : function () {
					return this.showInfos;
				}, 
				setShowInfos : function( showInfos ) {
					this.showInfos = showInfos;
				},
				getDisplayedElts : function ( ) {
					return this.displayedElts;
				},
				setDisplayedElts : function ( displayedElts ) {
					this.displayedElts = displayedElts;
				},
				displayModal : function ( ) {

					if( displayedElts > 0 ) {
						$('#modalWrapper').css('display','inline-block');
						this.showModal = true;
					}
					else {
						$('#modalWrapper').css('display','none');
						this.showModal = false;	
					}
							
					
				},
				displayInfos : function ( ) {
					if( !this.isShowInfos() ) {
						if(! $('#panelInfos').hasClass('show') )
							$('#panelInfos').removeClass('hide').addClass('show');
						
						/*if( !this.isShowInfos() )*/
							displayedElts += 1;

						this.setShowInfos(true);
					} else {
						if(! $('#panelInfos').hasClass('hide') )
							$('#panelInfos').removeClass('show').addClass('hide');
						this.setShowInfos(false);

						if(displayedElts > 0)
							displayedElts -= 1;
					}

					this.displayModal();
				},
				displayComments : function ( ) {

					if( ! this.isShowComment() ) {
						if( ! $('#panelComment').hasClass('show') )
						$('#panelComment').removeClass('hide').addClass('show');
						
						/*if( !this.isShowComment() )*/
							displayedElts += 1;

						this.setShowComment(true);
					} else {
						if( ! $('#panelComment').hasClass('hide') )
							$('#panelComment').removeClass('show').addClass('hide');
						this.setShowComment(false);

						if(displayedElts > 0)
							displayedElts -= 1;
					}

					this.displayModal();
				},
				displayScenarioParameters : function ( show ) {

					if( ( show )  || !this.showScenarioParameters && show != false) {

						if( ! $('#panelScenarioParameter').hasClass('show') ) 
							$('#panelScenarioParameter').removeClass('hide').addClass('show');
						
						if(!this.showScenarioParameters)
							displayedElts += 1;
						this.showScenarioParameters = true;
						
					} else {

						if( ! $('#panelScenarioParameter').hasClass('hide') ) 
							$('#panelScenarioParameter').removeClass('show').addClass('hide');
						this.showScenarioParameters = false;

						if(displayedElts > 0)
							displayedElts -= 1;
					}

					this.displayModal();

				}
			};
		},
		toolbar = toolbarAction ();

		accessToolbar.toolbar = toolbar;

		$('[data-toggle="tooltip"]').tooltip();
		
	$('.toolbarElement:not(.toolbarElementNoSelect)').on('click', function ( event ) {
		$(this).toggleClass("toolbarElementSelected");
	});
		
	$('#showScenarioParameters').on('click', function ( event ) {
		toolbar.displayScenarioParameters();
	});

	$('#showInfos').on('click', function ( event ) {
		toolbar.displayInfos();
	});

	$('#showComment').on('click', function ( event ){
		toolbar.displayComments();
	});

	$('#saveComment').on('click',function ( event ) {
		$.ajax({
	        url: 'saveGridComment',
	        type: 'POST',
	        dataType: 'json',
	        data: {
	        	gridComment : $('#gridComment').val(),
	        	id : grid.Id
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
	            
	            if(data.success){

	            	u.notify({
	            		message		: data.success,
	            		shouldGet	: false,
	            		type		: "success",
	            		pckg		: ''
	            	});

	            } else if(data.error)


	            	u.notify({
	            		message		: data.error,
	            		shouldGet	: false,
	            		type		: "error",
	            		pckg 		: ''
	            	});
	        }
	    });
	});
	

});