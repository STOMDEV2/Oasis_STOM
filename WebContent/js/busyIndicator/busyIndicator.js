$(document).ready(function()
{
	$('body').mousedown(function(e)
	{
		console.log($(".busyIndicatorContainer").is(":visible"));
		
		if(e.button == 1 && $(".busyIndicatorContainer").is(":visible"))
			return false;
	});
});

var nbOfCalls = 0;

function busyIndicatorBeforeSend()
{
	nbOfCalls++;
	
	$("body").css("overflow", "hidden");
	$(".busyIndicatorContainer").css("top", $(document).scrollTop());
	$(".busyIndicatorContainer").show();
}

function busyIndicatorOnComplete()
{
	nbOfCalls--;
	
	if(nbOfCalls > 0)
		return;
	
	$("body").css("overflow", "auto");
	$(".busyIndicatorContainer").hide();
	
	$(document).trigger('busyIndicatorComplete');
}