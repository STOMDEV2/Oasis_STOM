const treeElementContainer = '<div class="listContainer collapsed">' +
								'</div>';
const treeElement = '<div style="position: relative; text-align: left;">' + 
						'<div style="position: relative; height: 20px; display: inline-block; margin-bottom: 2px;">' +
							'<button type="button" class="collapseButton treeCollapseButton btn btn-default btn-xs" style="float: left;"></button>' +
							
							'<span class="checkBoxTreeElement">' +
								'<i></i>' +
							'</span>' +
							
							'<span class="treeElement"></span>' +
						'</div>' +
					'</div>';

function hasChildren(members, index)
{
	var member = members[index];
	var nextMember = members[index + 1];
	
	if(nextMember == undefined)
		return false;
	
	if(nextMember.GenerationNumber == member.GenerationNumber + 1)
		return true;
	
	return false;
}

function hasDescendantOk(members, index, initialIndex)
{
	var member = members[index];
	
	if(member.isOK && index != initialIndex)
		return true;
	
	var result = false;
	
	for(var i = index + 1; i < members.length; i++)
	{
		var children = members[i];
		
		if(children.GenerationNumber <= member.GenerationNumber)
			break;
		
		if(children.GenerationNumber == member.GenerationNumber + 1)
			result |= hasDescendantOk(members, i, initialIndex);
	}
	
	return result;
	
	
	
//	for(var i = index + 1; i < members.length; i++)
//	{
//		var children = members[i];
//		
//		if(children.GenerationNumber > member.GenerationNumber)
//		{
//			if(children.isOk)
//				return true;
//			
//			member = children;
//		}
//		else
//			return false;
//	}
//	
//	return false;
}


function buildTree(container, members, dimension, levels, gens, udas)
{
	container.empty();
	
	var levels = levels.split(",");
	var gens = gens.split(",");
	console.log("LEVELS: " + levels);
	console.log("GENS: " + gens);
	var udas = udas.split(";");
	
	var dimensionMembers = members[dimension];
	
	for(var i = 0; i < dimensionMembers.length; i++)
	{
		var member = dimensionMembers[i];
		
//		console.log(member);
		
		if(udas == "")
			var udaIntersect = true;
		else
		{
			var udaIntersect = false;
			if(member.UDAs != null)
			{
				for(var j = 0; j < member.UDAs.length; j++)
				{
					if($.inArray(member.UDAs[j], udas))
					{
						udaIntersect = true;
						break;
					}
				}
			}
		}
		
//		if(member.UniqueName == "CLBI")
//		{
//			console.log(member);
//			console.log(udaIntersect);
//		}
		if(($.inArray(member.GenerationNumber.toString(), gens) != -1 || $.inArray(member.LevelNumber.toString(), levels) != -1) && udaIntersect && !member.IsDynamicCalc && !member.IsSharedMember)
		{
//			console.log("OUAIS CA PASSE LA");
			member.isOK = true;
		}
	}
	
	console.log(dimensionMembers);
	
	var baseMembers = [];
	for(var i = 0; i < dimensionMembers.length; i++)
		if(dimensionMembers[i].GenerationNumber == 2)
			baseMembers.push(i);
	
	for(var i = 0; i < baseMembers.length; i++)
		buildDOMTree(baseMembers[i], dimensionMembers, container);
	
//	var container = $(".treeContainer");
//	/*	CONSTRUCTION	*/
//	for(var i = 0; i < dimensionMembers.length; i++)
//	{
//		var member = dimensionMembers[i];
//		
//		if(hasDescendantOk(dimensionMembers, i) || member.isOK)
//		{
//			var newElement = $(treeElement);
//			newElement.find(".treeElement").text(member.UniqueName);
//			
//			console.log("HASCHILDREN: " + hasChildren(dimensionMembers, i));
//			
//			if(!hasChildren(dimensionMembers, i))
//				newElement.removeClass("listContainer");
//			if(!member.isOK)
//				newElement.removeClass(".checkBoxTreeElement");
//			
//			container.append(newElement);
//			
//			if(dimensionMembers[i + 1] != undefined && dimensionMembers[i + 1].GenerationNumber == member.GenerationNumber + 1)
//				container = newElement;
//		}
//	}
	
	updateTreeListStyle();
}

function buildDOMTree(index, dimensionMembers, container)
{
	var member = dimensionMembers[index];
	
	if(hasDescendantOk(dimensionMembers, index, index) || member.isOK)
	{
		var newContainer = addContainer(index, dimensionMembers, container);
//		console.log(newContainer);
		
		/*	CONSTRUCTION	*/
		for(var i = index + 1; i < dimensionMembers.length; i++)
		{
			var children = dimensionMembers[i];
			
			if(children.GenerationNumber <= member.GenerationNumber)
				break;
			
			if(children.GenerationNumber == member.GenerationNumber + 1)
			{
				buildDOMTree(i, dimensionMembers, newContainer);
			}
		}
	}
}

function addContainer(i, dimensionMembers, container)
{
	var member = dimensionMembers[i];
	
	var newElement = $(treeElement);
	newElement.find(".treeElement").html("<b>" + member.UniqueName + "</b>: " + member.Alias);
	
//	console.log("HASCHILDREN: " + hasChildren(dimensionMembers, i));
//	console.log("hasDescendantOk: " + hasDescendantOk(dimensionMembers, i));
	
	if(hasDescendantOk(dimensionMembers, i, i))
	{
		var treeElementChildrenContainer = $(treeElementContainer);
		newElement.append(treeElementChildrenContainer);
	}
	else
		newElement.find("button").remove();
	
//	console.log(member);
	
	if(!member.isOK)
		newElement.find(".checkBoxTreeElement").remove();
	else
		newElement.addClass("selectableLine");
	
	container.append(newElement);
	
	return treeElementChildrenContainer != undefined ? treeElementChildrenContainer : newElement;
}





$(document).on("click", "button.treeCollapseButton", function(e)
{
	e.stopPropagation();
	
	$(this).parent().parent().children(".listContainer").toggleClass("collapsed");
	
	updateTreeListStyle();
});
$(document).on("click", ".checkBoxTreeElement i", function(e)
{
	e.stopPropagation();
	
	var u = utility();
	
	var parentTreeContainer = $(this).parents(".treeContainer");
	if(parentTreeContainer.hasClass("simpleValue"))
	{
		if(parentTreeContainer.find(".selected").length + ($(this).parent().hasClass("selected") ? -1 : 1) <= 1)
			$(this).parent().toggleClass("selected");
		else
        	u.notify({
        		message: "You can't select any more members in this tree! Check the calcul parameters and set the variable as multiple value to select more than one member!",
        		shouldGet: false,
        		type: "error"
        	});
	}
	else
		$(this).parent().toggleClass("selected");
});

function updateTreeListStyle()
{
	$(".treeCollapseButton").each(function()
	{
		if($(this).parent().parent().children(".listContainer").hasClass("collapsed"))
			$(this).text("+");
		else
			$(this).text("-");
	});
}

function expandAllNodesToSelectedElements()
{
	$(".parametersContainer").find("tr").each(function()
	{
		var treeContainer = $(this).find(".treeContainer");
		
		treeContainer.find(".checkBoxTreeElement.selected").each(function()
		{
			$(this).parents(".listContainer.collapsed").each(function()
			{
				var memberContainer = $(this).prev();
				
				memberContainer.find("button").trigger("click");
			});
		});
	});
}