<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
	
	<link rel="stylesheet" type="text/css" href="../../css/maskHandler.css" />
	<link rel="stylesheet" type="text/css" href="../../css/displayGrid.css" />
	<link rel="stylesheet" type="text/css" href="../../css/spreadsheet/spreadsheet.css" />
	<link rel="stylesheet" type="text/css" href="../../css/toolbar.css" />
	<link rel="stylesheet" href="../../font-awesome/css/font-awesome.css">
</head>


<body>
	<%@ include file="../../template/navbar.jsp" %>
	
	<%@ include file="../../template/busyIndicator.jsp" %>

	
	<div class="wrapper">
		<div class="container-fluid toolbar sideContainer">
			<div class="row">
				<div id="showInfos" class="col-md-12 toolbarElement" data-toggle="tooltip" data-placement="right" title="Informations">
					<i class="fa fa-info-circle fa-3x button-toolbar"></i><!--  gridInfos : gridName maskName -->
				</div>
			</div>
			<div class="row">
				<div id="showComment" class="col-md-12 toolbarElement" data-toggle="tooltip" data-placement="right" title="Comment">
					<i class="fa fa-comment fa-3x button-toolbar"></i> <!-- display comment -->
				</div>
			</div>
			<div class="row">
				<div id="showScenarioParameters" class="col-md-12 toolbarElement" data-toggle="tooltip" data-placement="right" title="ScenarioParameters">
					<i class="fa fa-plug fa-3x button-toolbar"></i><!-- save scenarioParameters -->
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 toolbarElement toolbarElementNoSelect" data-toggle="tooltip" data-placement="right" title="Retrieve">
					<i id="performRetrieve" class="fa fa-download fa-3x"></i><!-- retrieve -->
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 toolbarElement toolbarElementNoSelect" data-toggle="tooltip" data-placement="right" title="Lock & Send">
					<i id="performLockSend" class="fa fa-lock fa-3x"></i><!-- lock & send -->
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 toolbarElement toolbarElementNoSelect" data-toggle="tooltip" data-placement="right" title="Toolbox">
					<i class="fa fa-wrench fa-3x"></i>
				</div>
			</div>
			<div class="row">
				<div id="saveGridStyle" class="col-md-12 toolbarElement toolbarElementNoSelect" data-toggle="tooltip" data-placement="right" title="Save style">
					<i class="fa fa-font fa-3x"></i>
				</div>
			</div>
		</div>
		<%@ include file="grid.jsp" %>
		<%@ include file="../../template/footer.jsp" %>
	</div>
		

	<script type="text/javascript">
		var readOnly = false;
	</script>
	<script type="text/javascript" src="../../js/spreadsheet/spreadsheet.js"></script>
	<script type="text/javascript">
		var grid = <%= request.getAttribute("grid") %>;
		var gridValues = <%= request.getAttribute("gridValues") %>;
		
		var mask = grid.Mask;
		
		$(".nameMask").text(mask.NameMask);
		$(".nameGrid").text(grid.Name);
		$("#gridComment").val(grid.Comment);
		
		console.log(grid);
		console.log(gridValues);

	</script>
	<script src="../../js/bootstrap-switch.js"></script>
	<script type="text/javascript" src="../../js/grid/toolbar.js"></script>
	<script type="text/javascript" src="../../js/grid/handleData.js"></script>
	<script type="text/javascript" src="../../js/grid/scenarioParameters.js"></script>
	<script type="text/javascript" src="../../js/spreadsheet/grid/initSpreadsheet.js"></script>
	<script type="text/javascript" src="../../js/jquery-migrate-1.1.0.js"></script>
	<script type="text/javascript">
		$(document).ready(function()
		{
			$("#performRetrieve").click();
		});
	</script>
</body>
</html>