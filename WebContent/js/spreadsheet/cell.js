/**
 * Object Cell
 * An object representing a cell in a spreadsheet.
 */
var Cell =
{
	init: function(options, elem)
	{
	    // Mix in the passed in options with the default options
	    this.options = $.extend({}, this.options, options);
	
	    // Save the element reference, both as a jQuery
	    // reference and a normal reference
	    this.elem  = elem;
	    this.$elem = $(elem);
	
	    // Build the dom initial structure
	    this._build();
	
	    // return this so we can chain/use the bridge with less code.
	    return this;
	},
	_build: function()
	{
		this.$elem.html('<h1>'+this.options.name+'</h1>');
	}
};
