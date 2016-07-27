window.onbeforeunload = function (e) {
    e = e || window.event;

    if($(".modified").length || $(".created").length)
    {
    	// For IE and Firefox prior to version 4
    	if (e)
    		e.returnValue = 'Your have unsaved data. Please save it before leavign the page.';
	  
    	// For Safari
    	return  'Your have unsaved data. Please save it before leavign the page.';
    }
};