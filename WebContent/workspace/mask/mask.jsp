<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
	
	<link rel="stylesheet" type="text/css" href="../../css/maskHandler.css" />
	<link rel="stylesheet" type="text/css" href="../../css/toolbar.css" />
	<link rel="stylesheet" type="text/css" href="../../css/displayGrid.css" />
	<link rel="stylesheet" type="text/css" href="../../css/spreadsheet/spreadsheet.css" />
	<link href="../../css/bootstrap-switch.css" rel="stylesheet">
	<link rel="stylesheet" href="../../font-awesome/css/font-awesome.css">
</head>


<body>
	<%@ include file="../../template/navbar.jsp" %>
	
	<%@ include file="../../template/busyIndicator.jsp" %>

	<div class="wrapper">
		<div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
			<div class="row">
  				<h2 id="nameTitle" class="text-primary">Nom du masque</h2>
				<div class="col-md-12">
					<div class="form-group">
						<label for="nameMask">Saisir le nom du masque : </label>
						<input type="text" class="form-control" name="nameMask" id="nameMask"><br>
					</div>
  				</div>
			</div>
			
			
			
			<hr>
			
			
			
			<!-- CONTEXT DEFINITION -->
			<div class="panel panel-primary">
				<div class="panel-heading" style="font-size: 25px; text-align: center; padding: 5px;">
					Définition du contexte
				</div>
				<div id="dragArea" class="panel-body">
					<div>
						<h4 style="margin-top: 0px;">Contexte d'en-tête</h4>
						
						<div class="well" style="height: 80px;">
							<div id="divDimensions" class="dimensionContainer dimension-container" role="group" area-label="pow" style="display: inline-block;">
							</div>
						</div>
					</div>
		
					<div>
						<div class="col-md-6" style="padding: 0px; padding-right: 15px;">
							<h4>Contexte de lignes</h4>
	
							<div class="context-height well" style="margin-bottom: 0px;">
								<div id="divRowContext" class="dimensionContainer" role="group" style="width: 100%; height: 100%;">
		
								</div>
							</div>
						</div>
	
						<div class="col-md-6" style="padding: 0px;">
							<h4>Contexte de colonnes</h4>
	
							<div class="context-height well" style="margin-bottom: 0px;">
								<div id="divColumnContext" class="dimensionContainer" role="group" style="width: 100%; height: 100%;">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- CONTEXT DEFINITION -->
			<hr>
	
	
			<div class="panel panel-primary">
				<div class="panel-heading" style="font-size: 25px; text-align: center; padding: 5px;">
					Définition des membres Essbase
				</div>
				<div class="panel-body">
					<h3>En-tête</h3>
					<div id="divHeader" class="col-md-12 autocompleteContainerParent" style="position: static; padding: 0;">
                        <div class="container-fluid" style="padding: 0;">
                            <ul id="tabHeader" class="nav nav-tabs">
                                <li class="nav active"><a href="#tabRetrieveHeader" data-toggle="tab">Restitution</a></li>
                                <li class="nav"><a href="#tabCaptureHeader" data-toggle="tab">Saisie</a></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane fade in active" id="tabRetrieveHeader">
                                        <div class="well wells-content">
                                            <div class="row">
                                                <div id="pairR" class="col-md-6">
                                                </div>
                                                <div id="impairR" class="col-md-6">
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div class="tab-pane fade in" id="tabCaptureHeader" >
                                    <div class="well wells-content">
                                        <div class="row">
                                            <div id="pairC" class="col-md-6">
                                            </div>
                                            <div id="impairC" class="col-md-6">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
	                </div>
					
					<hr style="clear: both;">
					
					<h3>Colonnes</h3>

					<!-- COLUMN SPREADSHEET -->
	                <div id="spreadsheetColumns" class="context" style="clear: both;"></div>
					<hr>
					<h3>Lignes</h3>
	                <div id="spreadsheetLines" class="context" style="clear: both;"></div>

				</div>
			</div>
			<div class="col-lg-offset-3 col-lg-3">
				<button id="saveCreate" type="button" class="btn btn-lg btn-primary saveMask">Save Mask</button>

				<button id="saveModify" type="button" class="btn btn-lg btn-primary hide" data-toggle="modal" data-target="#myModal">Save Mask</button>
			</div>
			<div class="col-lg-3">
				<button id="previewGrid" type="button" class="btn btn-lg btn-success">Preview Mask</button>
			</div>

			<!-- Modal -->
			<div id="myModal" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Checking grid dependencies</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							
							<div class="col-lg-12 gridSelectionContainer">
								<span>Select the grids you want to be impacted by the mask's modification: </span>
							
								<div class="gridElementContainer">
								</div>
							</div>
							
							<div style="clear: both;"></div>
							<br>
							
							<div class="col-lg-12 overwrite">
								<input type="checkbox" class="overwriteMask" /> Overwrite
							</div>
							<div class="col-lg-12 modifiedMaskNameContainer" style="margin: 0px 0px 0px 15px;">
								<label for="modifiedMaskName">New mask name: </label>
								<input type="text" class="form-control" name="modifiedMaskName" id="modifiedMaskName" />
							</div>
							
							<div style="clear: both;"></div>
							<br>
							<div class="col-lg-12">
								<input type="checkbox" class="dropMask" /> Drop mask
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-info saveMask">Save</button>
						
							<button id="closeMyModal" type="button" class="btn btn-default"
								data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>

		</div>
		<div id="previewContainer" class="hide">
			<div class="container-fluid toolbar sideContainer">
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
			</div>
			<%@ include file="../grid/grid.jsp" %>
			<div class="col-lg-offset-5 col-lg-3">
				<button id="viewMask" class="btn btn-primary">Return to mask</button>
			</div>
		</div>
		
		<%@ include file="../../template/footer.jsp" %>
	</div>
	<script type="text/javascript" >
			console.time("test");
		</script>
		<script src="../../js/bootstrap-switch.js"></script>
		<script type="text/javascript" src="../../js/checkUnloading.js"></script>
		<script type="text/javascript" src="../../js/spreadsheet/spreadsheet.js"></script>
		<script type="text/javascript" src="../../js/spreadsheet/create/initSpreadsheet.js"></script>
		<script type="text/javascript" src="../../js/grid/toolbar.js"></script>
		<script type="text/javascript" src="../../js/grid/scenarioParameters.js"></script>
		<script type="text/javascript" src="../../js/mask/maskHandler.js"></script>
		<script type="text/javascript" src="../../js/jquery-migrate-1.1.0.js"></script>
		<script type="text/javascript">
			console.timeEnd("test");
		</script>
</body>

</html>

	

