$(document).ready(function()
{
	var historicCalculLaunchs;
	
	$.ajax({
		url: 'getHistoricCalculLaunch?action=getData',
        type: 'GET',
        dataType: 'json',
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
        	
        	historicCalculLaunchs = JSON.parse(data.object);
        	
        	buildTable(historicCalculLaunchs);
        },
        error:function(data,status,er)
        {
        	u.notify({
        		message: er,
        		shouldGet: false,
        		type: "error"
        	});
        }
	});
	
	$("#usersMaskTable").on("click", ".failedCalculLaunch", function()
	{
		var dataComment = $(this).attr('data-comment').replace(/\\n/g, '<br />');
		
		$("#logContent").html(dataComment);
	});
	
	function buildTable(data)
	{
		console.log(data);
		
		var table = $("#usersMaskTable");
		var container = table.find("tbody");
		
		container.empty();
		
		for(var i = 0; i < data.length; i++)
		{
			var historicLaunch = data[i];
			
			var line = $("<tr>");
			$("<td>").appendTo(line).text(historicLaunch.Calcul.Cube.Application + "." + historicLaunch.Calcul.Cube.Name);
			$("<td>").appendTo(line).text(historicLaunch.Launcher.Login);
			$("<td>").appendTo(line).text(historicLaunch.Calcul.Name);
			$("<td>").appendTo(line).text(historicLaunch.Parameters);
			$("<td>").appendTo(line).text(historicLaunch.DateBegin);
			$("<td>").appendTo(line).text(historicLaunch.TimeBegin);
			$("<td>").appendTo(line).text(historicLaunch.DateEnd);
			$("<td>").appendTo(line).text(historicLaunch.TimeEnd);
			$("<td>").appendTo(line).text(historicLaunch.Duration);
			switch(historicLaunch.State)
			{
				case 0:
					$("<td>").appendTo(line).text("Ongoing");
					break;
				case 1:
					$("<td>").appendTo(line).text("Success");
					break;
				case 2:
					$("<td><span data-toggle='modal' data-target='#myModal' class='failedCalculLaunch' data-comment='" + historicLaunch.Comments + "'>Failed</span>").appendTo(line);
					break;
			}
			
			container.append(line);
		}
	}
	
	$(".filter").click(function()
	{
		var thParent = $(this).parents("th").first();
		
		if(thParent.find("input").length)
		{
			thParent.find("input").remove();
			
			rebuild();
		}
		else
		{
			var input = $("<input type='text' class='filterInput form-control' style='padding: 6px; font: initial;' />").appendTo(thParent);
			
			input.focus();
		}
	});
	
	$("#usersMaskTable").on("input", ".filterInput", function()
	{
		rebuild();
	});
	
	$(".sortSelect").change(function()
	{
		rebuild();
	});
	
	$(".sort").click(function()
	{
		if($(this).hasClass("ascSort"))
			$(this).removeClass("ascSort").addClass("descSort");
		else if($(this).hasClass("descSort"))
			$(this).removeClass("descSort").addClass("ascSort");
//		else
//			$(this).addClass("ascSort");
		
		rebuild();
	});
	
	function getValueFromObject(object, key, shouldConvert)
	{
		var keys = key.split(".");
		var result = object;
		
		for(var i = 0; i < keys.length; i++)
			result = result[keys[i]];
		
		if(key == "State")
		{
			switch(result)
			{
				case 0:
					result = "Ongoing";
					break;
				case 1:
					result = "Success";
					break;
				case 2:
					result = "Failed";
					break;
			}
		}
		
		if(shouldConvert)
		{
			if(key.indexOf("Time") > -1)
				result = Date.parse('01/01/2011 ' + result);	//.replace("CET", "")
			else if(key.indexOf("Date") > -1)
				result = Date.parse(result);
		}
		
		return result;
	}
	
	function buildData()
	{
		var data = historicCalculLaunchs.slice();
		
		var theadLine = $("#usersMaskTable thead tr");
		
		theadLine.children("th").each(function()
		{
			var th = $(this);
			var filterInput = $(this).find(".filterInput");
			
			var className = $(this).find("span").attr('class');
			
			if(filterInput.length)
			{
				var filterValue = filterInput.val();
				
				for(var i = 0; i < data.length; i++)
				{
					if(getValueFromObject(data[i], className, false).indexOf(filterValue) == -1)
					{
						data.splice(i, 1);
						i--;
					}
				}
			}
		});
		
		var className = $(".sortSelect").val();
		var sortImg = $(".sort");
		data.sort(function(a, b)
		{
			if(sortImg.hasClass("ascSort"))
				return getValueFromObject(a, className, true) > getValueFromObject(b, className, true);
			else if(sortImg.hasClass("descSort"))
				return getValueFromObject(a, className, true) < getValueFromObject(b, className, true);
		});
		
		return data;
	}
	
	function rebuild()
	{
		var data = buildData();
		buildTable(data);
	}
	
	$("#exportClipboardTable").click(function()
	{
		var content = "";
		$("#usersMaskTable tbody tr").each(function()
		{
			$(this).find("td").each(function()
			{
				content += $(this).text() + "\t";
			});
			if(content.indexOf("\t") != -1)
				content = content.substring(0, content.length - "\t".length);
			
			content += "\n";
		});
		if(content.indexOf("\n") != -1)
			content = content.substring(0, content.length - "\n".length);
		
		setTimeout(function()
		{
			$("#textareaContent").val(content);
			$("#textareaContent").focus();
			$("#textareaContent").select();
		}, 200);
	});
	
	$("#exportTable").click(function()
	{
		var content = "";
		$("#usersMaskTable thead tr").each(function()
		{
			$(this).find("th").each(function()
			{
				content += $(this).text() + "||";
			});
			if(content.indexOf("||") != -1)
				content = content.substring(0, content.length - "||".length);
			
			content += ";";
		});
		$("#usersMaskTable tbody tr").each(function()
		{
			$(this).find("td").each(function()
			{
				content += $(this).text() + "||";
			});
			if(content.indexOf("||") != -1)
				content = content.substring(0, content.length - "||".length);
			
			content += ";";
		});
		if(content.indexOf(";") != -1)
			content = content.substring(0, content.length - ";".length);
		
		console.log(content);
		window.location.href = "exportCalculTable?content=" + content;
	});
});