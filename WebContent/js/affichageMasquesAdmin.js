$(document).ready(function(){

console.time('start');

    var selectors = {

            table  : {
                         name   : '#usersMaskTable',
                         body   : '#usersMaskTable tbody',
                         head   : '#usersMaskTable thead tr',
                         lines  : '#usersMaskTable tbody tr'
                     },
            navBar : {
                         name   : '#masksNav',
                         pages  : '#masksNav li',
                         links  : '.links',
                         prev   : '#prevPage',
                         next   : '#nextPage'
                     }

    },
    masksTableView = function (selectors) {

        return {
            selectors  : selectors.table,
            currentPage: 0,
            nbPages    : 0,
            reset      : function () {
                $(this.selectors.lines).addClass('hide').find('td').text('');
            },
            setContent : function (masks) {

                var nbMasks = masks.length;
                /*
                    $.each([ 52, 97 ], function( index, value ) {
                        alert( index + ": " + value );
                    });

                */
                //remplacer les for | comparer perf 
                for(var i = 0, cpt = nbMasks ; i < cpt; i += 1) {
                    
                    $(this.selectors.lines + ':eq('+ i+')').removeClass('hide');
                    $(this.selectors.lines + ':eq('+ i+') td:eq(0)').text(masks[i].name);
                    $(this.selectors.lines + ':eq('+ i+') td:eq(1)').text(masks[i].author);
                    $(this.selectors.lines + ':eq('+ i+') td:eq(2)').text(masks[i].lastModification);
                    $(this.selectors.lines + ':eq('+ i+') td:eq(3)').text(masks[i].lastEditor);

                }
            },
            getDataJSON : function () {
                return {
                    currentPage : this.currentPage,
                    nbPages     : this.nbPages
                };
            }

        };
    },
    navBar = function (selectors) {
        return {
            selectors : selectors.navBar,
            reset     : function () {
                $(this.selectors.links).remove();
            },
            setNavBar : function ( nbPages , currentPage ) {

                this.reset();

                if(currentPage === 1) {
                    $(this.selectors.prev).addClass('disabled');

                }
                else
                {
                    $(this.selectors.prev).removeClass('disabled');
                }

                if(currentPage === nbPages) {

                    $(this.selectors.next).addClass('disabled');

                } else {

                    $(this.selectors.next).removeClass('disabled');
                }

                for(var i = 0, cpt = nbPages; i < cpt; i += 1) {

                    if((i+1) === currentPage) {

                        $(this.selectors.pages +':eq('+ i +')').after('<li class="active links"><a href="#">'+ (i+1) +'</a></li>');

                    } else {

                        $(this.selectors.pages +':eq('+ i +')').after('<li class="links"><a href="/JavaProject/workspace/affichageMasquesAdmin?action=getMasks&page='+ (i+1) +'">'+ (i+1) +'</a></li>');

                    }
                    
                }
            }
        };
    },
    maskTable = masksTableView(selectors),
    nav = navBar(selectors);
    
    //  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    // |                                                         |
    // |          requête pour la première page                  |
    // |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|

	$.ajax({
    	url: 'affichageMasquesAdmin?action=getMasks',
        type: 'GET',
        dataType    : 'json',
        contentType : 'application/json; charset=UTF-8',
        mimeType    : 'application/json',
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

        	if(data.masks) {
        		
                maskTable.setContent(data.masks);
        	}

            if(data.nbPages && data.currentPage) {

                maskTable.currentPage = data.currentPage;
                maskTable.nbPages = data.nbPages;

                nav.setNavBar( data.nbPages, data.currentPage );
                
            }
       
        },
        error:function(data,status,er) {
                  

        }
    });

    //  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    // |                                                         |
    // |            Les évènements des liens                     |
    // |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|

    // liens numérotés 
    $(nav.selectors.name).on('click', nav.selectors.links , function ( event ) {
        
        event.preventDefault();

        $.ajax({
            url: 'affichageMasquesAdmin?action=getMasks&page=' + $(this).text(),
            type: 'GET',
            dataType    : 'json',
            contentType : 'application/json; charset=UTF-8',
            mimeType    : 'application/json',
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

                if(data.masks) {
                    maskTable.reset();
                    maskTable.setContent(data.masks);
                }
                
                if(data.nbPages && data.currentPage) {

                    maskTable.currentPage = data.currentPage;
                    maskTable.nbPages = data.nbPages;

                    $(nav.selectors.prev).removeClass('disabled');
                    $(nav.selectors.next).removeClass('disabled');
                    nav.setNavBar( data.nbPages, data.currentPage);
                    
                }
                            
            },
            error:function(data,status,er) {
                  

            }
        });

    });
    
    //lien précédent
    $(nav.selectors.prev).on('click', 'a', function ( event ) {
        event.preventDefault();

        console.log(maskTable.getDataJSON());

        if(maskTable.currentPage === 1) {

            return;

        } else {

            $.ajax({
                url         : $(nav.selectors.prev).find('a').attr('href'),
                type        : 'POST',
                dataType    : 'json',
                data        :  JSON.stringify(maskTable.getDataJSON()),
                contentType : 'application/json; charset=UTF-8',
                mimeType    : 'application/json',
                success     : function (data) {

                if(data.masks) {
                    maskTable.reset();
                    maskTable.setContent(data.masks);
                }

                if(data.nbPages && data.currentPage) {

                    maskTable.nbPages = data.nbPages;
                    maskTable.currentPage = data.currentPage;
                    nav.setNavBar( data.nbPages , data.currentPage );    
                }
                                
                },
                error       : function(data,status,er) {

                }

            });
        }
    });
    
    //lien suivant
    $(nav.selectors.next).on('click', 'a', function ( event ) {
        event.preventDefault();
        console.log(maskTable.getDataJSON());

        if(maskTable.currentPage === maskTable.nbPages) {

            return;

        } else {

            $.ajax({
                url         : $(nav.selectors.next).find('a').attr('href'),
                type        : 'POST',
                dataType    : 'json',
                data        : JSON.stringify(maskTable.getDataJSON()),
                contentType : 'application/json; charset=UTF-8',
                mimeType    : 'application/json',
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
                success     : function (data) {

                if(data.masks) {
                    maskTable.reset();
                    maskTable.setContent(data.masks);
                }

                if(data.nbPages && data.currentPage) {

                    maskTable.nbPages = data.nbPages;
                    maskTable.currentPage = data.currentPage;
                    nav.setNavBar( data.nbPages , data.currentPage );    
                }
                                
                },
                error       : function(data,status,er) {

                }

            });
        }
    });
    
    

console.timeEnd('start');

});