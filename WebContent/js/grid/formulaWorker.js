function updateFormula(spreadSheet)
{
	spreadSheet.find(".context[data-formula]").each(function()
	{
		var formulaCell = $(this);
		
		console.log($(this).attr('data-formula'));
		
		var formula = $(this).attr('data-formula');
		formula = formula.replace("=", "").split(/\s/g);
		
		for(var i = 0; i < formula.length; i++)
		{
			if(formula[i].indexOf("SUM") > -1)
			{
				if($(this).index() == 1)
				{
					var tmpValue = formula[i].replace("SUM(", "").replace(")", "").replace("-", " ").split(" ");
					
					var firstCoord = tmpValue[0];
					var secondCoord = tmpValue[1];
					
					var firstLetter;
					var firstNumber;
					var secondNumber;
					
					for(var j = 0; j < firstCoord.length; j++)
						if(!isNaN(firstCoord.substring(j, firstCoord.length)))
						{
							firstLetter = firstCoord.substring(0, j);
							firstNumber = parseInt(firstCoord.substring(j, firstCoord.length)) + 2;
							break;
						}
					
					for(var j = 0; j < secondCoord.length; j++)
						if(!isNaN(secondCoord.substring(j, secondCoord.length)))
						{
							secondNumber = parseInt(secondCoord.substring(j, secondCoord.length)) + 2;
							break;
						}
					
//					console.log(firstCoord);
//					console.log(firstLetter);
//					console.log(secondLetter);
//					console.log(letters);
//					
//					var firstLetterIndex = $.inArray(firstLetter, letters);
//					var secondLetterIndex = $.inArray(secondLetter, letters);

//					console.log(firstLetterIndex);
//					console.log(secondLetterIndex);
					
					formula[i] = "( ";
					for(var j = firstNumber; j <= secondNumber; j++)
						formula[i] += firstLetter + j + " + ";
					formula[i] = formula[i].substring(0, formula[i].length - " + ".length);
					formula[i] += " )";
					
//					console.log(formula[i]);
				}
				else
				{
					var tmpValue = formula[i].replace("SUM(", "").replace(")", "").replace("-", " ").split(" ");
					
					var firstCoord = tmpValue[0];
					var secondCoord = tmpValue[1];
					
					var firstLetter;
					var secondLetter;
					var number;
					
					for(var j = 0; j < firstCoord.length; j++)
						if(!isNaN(firstCoord.substring(j, firstCoord.length)))
						{
							firstLetter = firstCoord.substring(0, j);
							number = firstCoord.substring(j, firstCoord.length);
							break;
						}
					
					for(var j = 0; j < secondCoord.length; j++)
						if(!isNaN(secondCoord.substring(j, secondCoord.length)))
						{
							secondLetter = secondCoord.substring(0, j);
							break;
						}
					
//					console.log(firstCoord);
//					console.log(firstLetter);
//					console.log(secondLetter);
//					console.log(letters);
//					
					var firstLetterIndex = $.inArray(firstLetter, letters);
					var secondLetterIndex = $.inArray(secondLetter, letters);

//					console.log(firstLetterIndex);
//					console.log(secondLetterIndex);
					
					formula[i] = "( ";
					for(var j = firstLetterIndex; j <= secondLetterIndex; j++)
						formula[i] += letters[j] + number + " + ";
					formula[i] = formula[i].substring(0, formula[i].length - " + ".length);
					formula[i] += " )";
					
//					console.log(formula[i]);
				}
			}
		}
		
		
		formula = formula.join(" ");
		console.log(formula);
		formula = formula.split(" ");
		console.log(formula);
		
		
		
		if($(this).index() == 1)
		{
			formulaCell.parents(".line").children().each(function()
			{
				var finalValue = "";
				
				var cell = $(this);
				
				if(cell.hasClass("header") || cell.hasClass("context"))
					return true;
				
				for(var i = 0; i < formula.length; i++)
				{
					console.log(formula[i]);
					var baseCell = spreadSheet.getCellByCoordiantes(formula[i]);
					console.log(baseCell);
					
					var number;
					
					if(baseCell == undefined)
					{
						finalValue += formula[i];
						continue;
					}
					else if(baseCell == 99999999)
					{
						var itsok = false;
						for(var j = 0; j < formula[i].length; j++)
							if(!isNaN(formula[i].substring(j, formula[i].length)))
							{
								if(j == 0)
								{
									itsok = true;
									finalValue += formula[i];
									break;
								}
								
								number = formula[i].substring(j, formula[i].length);
								break;
							}
						
						if(itsok)
							continue;
					}
					else
					{
						console.log(formula[i]);
						for(var j = 0; j < formula[i].length; j++)
							if(!isNaN(formula[i].substring(j, formula[i].length)))
							{
								number = formula[i].substring(j, formula[i].length);
								break;
							}
					}
					
					console.log(number);
//					console.log(baseCell.index());
					var cell = $(".line:nth-child(" + number + ")").children(".SPCell:nth-child(" + (cell.index() + 1) + ")");
					
//					console.log(formula[i]);
					console.log(cell);
					console.log(spreadSheet.getCellValue(cell));
					finalValue += (spreadSheet.getCellValue(cell) == "" ? 0 : spreadSheet.getCellValue(cell));
//					formula[i] = spreadSheet.getCellValue(cell);
				}
				
//				var finalValue;
				console.log(finalValue);
				try
				{
					finalValue = eval(finalValue);
				}
				catch(ex)
				{
//					console.log(ex);
				}
				
//				console.log(formulaCell);
				console.log(finalValue);
//				console.log(formula.join(" "));
				spreadSheet.setCellValue($(this), finalValue, true);
			});
		}
		else
		{
			spreadSheet.find(".line").each(function()
			{
				var finalValue = "";
				
				for(var i = 0; i < formula.length; i++)
				{
//					console.log(formula[i]);
					var baseCell = spreadSheet.getCellByCoordiantes(formula[i]);
//					console.log(baseCell);
					if(baseCell == undefined)
					{
						finalValue += formula[i];
						continue;
					}
					else if(baseCell == 99999999)
					{
						finalValue += formula[i];
						continue;
					}
					
//					console.log(baseCell.index());
					var cell = $(this).children(".SPCell:nth-child(" + (baseCell.index() + 1) + ")");
					
//					console.log(cell);
					
					if(cell.hasClass("header") || cell.hasClass("context"))
						break;
					
//					console.log(formula[i]);
//					console.log(cell);
//					console.log(spreadSheet.getCellValue(cell));
					finalValue += (spreadSheet.getCellValue(cell) == "" ? 0 : spreadSheet.getCellValue(cell));
					//formula[i] = spreadSheet.getCellValue(cell);
				}
				
				var finalValue;
				try
				{
					finalValue = eval(finalValue);
				}
				catch(ex)
				{
//					console.log(ex);
				}
				
//				console.log(formulaCell);
//				console.log(finalValue);
//				console.log(formula.join(" "));
				var cellToModify = $(this).children(".SPCell:nth-child(" + (formulaCell.index() + 1) + ")");
				if(cellToModify.hasClass("header") || cellToModify.hasClass("context"))
					return;
				
				spreadSheet.setCellValue(cellToModify, finalValue, true);
			});
		}
	});
}

self.onmessage = function(e) {
	console.log("JGERIJGEIPO");
	
	updateFormula(e.spreadSheet);
}