<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
	
	<link rel="stylesheet" type="text/css" href="../../css/calculations/calculations.css" />
	<link rel="stylesheet" type="text/css" href="../../css/multiselect/multiselect.css" />
</head>

<body>
	<%@ include file="../../template/navbar.jsp" %>
	
	<%@ include file="../../template/busyIndicator.jsp" %>

	<div class="wrapper">
		<div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10" style="padding-bottom: 0px;">
			
			<div class="panel panel-primary">
				<div class="panel-heading" style="font-size: 25px; text-align: center; padding: 5px;">
					Calcul / Script parameter
				</div>
				
				<div class="panel-body">
					<div class="well calculContainer" style="position: relative; overflow: scroll; width: 25%; float: left;">
						<c:forEach items="${ requestScope.data }" var="cube">
							<div class="listContainer topNode">
								<div><button type="button" class="collapseButton btn btn-default btn-xs"></button><span class="treeViewElement noContext" name="${ cube.id }"><c:out value="${ cube.application }.${ cube.name }"></c:out></span></div>
								
								<div class="listContainer collapsed">
									<div><button type="button" class="collapseButton btn btn-default btn-xs"></button><span class="calculHeader treeViewElement headerElement">Calculations</span></div>
										
									<c:forEach items="${ cube.calculs }" var="calcul">
										<div class="listContainer collapsed">
											<div>
												<button type="button" class="collapseButton btn btn-default btn-xs"></button>
												<span class="treeViewElement" name="calcul_${ calcul.id }" draggable="true"><c:out value="${ calcul.name }"></c:out></span>
											</div>
											
											<div class="listContainer collapsed">
												<c:forEach items="${ calcul.orderedScripts }" var="script">
													<div>
														<span class="treeViewElement" data-orderedScript="${ script.id }" name="script_${ script.script.id }" style="margin-left: 10px;" draggable="true">
															<c:out value="${ script.script.name }"></c:out>
														</span>
													</div>
												</c:forEach>
											</div>
										</div>
									</c:forEach>
								</div>
								
								<div class="listContainer collapsed">
									<div><button type="button" class="collapseButton btn btn-default btn-xs"></button><span class="scriptHeader treeViewElement headerElement">Scripts</span></div>
									
									<div class="listContainer collapsed">
										<c:forEach items="${ cube.scripts }" var="script">
											<div><span class="treeViewElement" name="script_${ script.id }" style="margin-left: 10px;" draggable="true"><c:out value="${ script.name }"></c:out></span></div>
										</c:forEach>
									</div>
								</div>
							</div>
						</c:forEach>
					</div>
			
			
					<div class="well autocompleteContainerParent" style="width: calc(100% - 15px - 25%); margin-left: 15px; float: left; text-align: center;">
						<div class="nothingSelected" style="display: inline-block; position: relative; top: 50%; transform: translateY(-50%); -webkit-transform: translateY(-50%);">
							<span style="font-size: 30px;">Select a script or a calcul to begin editing it!</span>
						</div>
						
						<div class="calculEditionContainer" style=" display: none; height: 100%;">
							<div style="height: 7%; max-height: 7%;">
								<span id="calculName"></span>
								<hr style="border-color: #23527C; margin: 0;">
							</div>
						
						  	<!-- Nav tabs -->
						  	<ul class="nav nav-tabs dimensionTab" role="tablist">
						  	
						  	</ul>
						
							<div class="tab-content dimensionTabContent">
							
							</div>
							
							<div style="height: 10%; max-height: 10%; clear: both;">
								<br>
								<button type="button" id="saveCalculParameter" class="btn btn-lg btn-success">Save / Update</button>
							</div>
							
							<div class="popUpTreeContainer">
								<div style="width: 100%; height: 25px;">
									<div style="position: absolute; right: 5px; top: 5px;">
										<i class="fa fa-times fa-2x closePopupTreeContainer"></i>
									</div>
								</div>
								
								<div class="treeContainer">
									
								</div>
							</div>
						</div>
					
					
						<div class="scriptEditionContainer" style=" display: none; height: 100%;">
							<div style="height: 10%; max-height: 10%;">
								<span id="scriptName"></span>
							</div>
						
							<textarea id="textAreaScript" class="form-control" style="width: 100%; resize: none; height: 75%; max-height: 75%;"></textarea>
							
							<div style="height: 10%; max-height: 10%; clear: both;">
								<br>
								<button type="button" id="saveScript" class="btn btn-lg btn-info">Save / Update</button>
								<button type="button" id="testScript" class="btn btn-lg btn-success">Validate</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			
			
			
			
			
			
			
			<div class='dropdown clearfix contextMenu' style="display: none; position: absolute;">
				<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu' style='margin-bottom: 5px; display: block;'>
					<li><a tabindex='-1' class='contextItem calculItem addCalcul' data-toggle="modal" data-target="#addCalcul">New calcul</a></li>
					<li><a tabindex='-1' class='contextItem calculItem renameCalcul' data-toggle="modal" data-target="#renameCalcul">Rename calcul</a></li>
					<li><a tabindex='-1' class='contextItem calculItem removeCalculItem' data-toggle="modal" data-target="#removeCalcul">Remove calcul</a></li>
					<li class='divider'></li>
					<li><a tabindex='-1' class='contextItem scriptItem addScript' data-toggle="modal" data-target="#addScript">New script</a></li>
					<li><a tabindex='-1' class='contextItem scriptItem removeScriptFromCalcul' data-toggle="modal" data-target="#removeScriptFromCalcul">Remove script from calcul</a></li>
					<li><a tabindex='-1' class='contextItem scriptItem renameScript' data-toggle="modal" data-target="#renameScript">Rename script</a></li>
					<li><a tabindex='-1' class='contextItem scriptItem removeScriptItem' data-toggle="modal" data-target="#removeScript">Remove script</a></li>
				</ul>
			</div>
			
			<div class='dropdown clearfix contextMenuOnDrop' style="display: none; position: absolute;">
				<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu' style='margin-bottom: 5px; display: block;'>
					<li><a tabindex='-1' class='contextItem duplicateItem'>Duplicate</a></li>
					<li><a tabindex='-1' class='contextItem moveItem'>Move</a></li>
				</ul>
			</div>
			
			
			
			
			
			
			
			<!-- MODALS -->
			<div id="addCalcul" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">New calcul</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
								<label for="calculName">Calcul name: </label>
								<input type="text" class="form-control" name="calculName" id="calculName" />
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-info saveCalcul">Save</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div id="removeCalcul" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Remove calcul</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
								<span style="font-weight: bold; color: red;">Are you sure you want to remove this calculation ?</span>
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-danger removeCalcul">Remove</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div id="renameCalcul" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Rename calcul</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
								<label for="newCalculName">New calcul name: </label>
								<input type="text" class="form-control" name="newCalculName" id="newCalculName" />
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-info updateCalculName">Update</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			
			<div id="addScript" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">New script</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
								<label for="scriptNameInput">Script name: </label>
								<input type="text" class="form-control" name="scriptNameInput" id="scriptNameInput" />
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-info saveScript">Save</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div id="removeScript" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Remove script</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
								<span style="font-weight: bold; color: red;">Are you sure you want to remove this script ?</span>
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-danger removeScript">Remove</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div id="renameScript" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Rename script</h4>
						</div>
						
						<div class="modal-body" style="display: inline-block; width: 100%;">
							<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
								<label for="newScriptName">New script name: </label>
								<input type="text" class="form-control" name="newScriptName" id="newScriptName" />
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-info updateScriptName">Update</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<%@ include file="../../template/footer.jsp" %>
	</div>
	
	
	<script type="text/javascript" src="../../js/checkUnloading.js"></script>
	<script type="text/javascript" src="../../js/calculations/treeBuilder.js"></script>
	
	<script type="text/javascript" src="../../js/calculations/myCalculations/template.js"></script>
	<script type="text/javascript" src="../../js/calculations/myCalculations/drag'n'drop.js"></script>
	<script type="text/javascript" src="../../js/calculations/myCalculations/modalEventListeners.js"></script>
	<script type="text/javascript" src="../../js/calculations/myCalculations/calculParameterHandler.js"></script>
	<script type="text/javascript" src="../../js/calculations/myCalculations/scriptHandler.js"></script>
	<script type="text/javascript" src="../../js/calculations/myCalculations/calculations.js"></script>
	
	<script type="text/javascript" src="../../js/multiselect/jquery.multiselect.js"></script>
</body>
</html>