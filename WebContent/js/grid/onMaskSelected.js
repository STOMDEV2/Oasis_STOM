$(document).ready(function()
{
	$("#maskSelect").change(function()
	{
		var value = $(this).val();
		
		getMask(value);
	});
});

var mask;

function getMask(id)
{
	$.ajax({
		  	url: "getMask",
		  	method: "GET",
		  	data: {
		  		id: id
		  	},
		  	success: function(result)
		  	{
		  		console.log(result);
		  		
		  		mask = result;
		  		
		  		displayEmptyFields();
		  	}
	});
}