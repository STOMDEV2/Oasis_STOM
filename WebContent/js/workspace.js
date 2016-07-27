$(document).ready( function(){

	$.ajax({
		url: 'workspace?action=getInfos',
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

          var message = "Bienvenue " + data.firstname + " " + data.name + " !" ;
          var infos = "Connecté sous " + data.login + " à " + data.appliCube + ".";
          var n = noty({
                            text        : message,
                            type        : 'information',
                            dismissQueue: true,
                            layout      : 'topRight',
                            timeout     : 5000,
                            theme       : 'bootstrapTheme',
                            closeWith   : ['button', 'click'],
                            maxVisible  : 20,
                            modal       : false
                        });
          n = noty({
                        text        : infos,
                        type        : 'information',                                                  
                        dismissQueue: true,                                                     
                        layout      : 'topRight',
                        timeout     : 5000,
                        theme       : 'bootstrapTheme',
                        closeWith   : ['button', 'click'],
                        maxVisible  : 20,
                        modal       : false
                    });

        },
        error:function(data,status,er) {
            
        }
	});
});