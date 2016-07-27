<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
	
	<link rel="stylesheet" type="text/css" href="../../css/calculations/calculations.css" />
</head>

<body>
	<%@ include file="../../template/navbar.jsp" %>
	
	<%@ include file="../../template/busyIndicator.jsp" %>

	<div class="wrapper">
		<div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10" style="padding-bottom: 0px;">
			
			<div class="panel panel-primary">
				<div class="panel-heading" style="font-size: 25px; text-align: center; padding: 5px;">
					Launch a calcul
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
												<span class="treeViewElement" name="calcul_${ calcul.id }"><c:out value="${ calcul.name }"></c:out></span>
											</div>
										</div>
									</c:forEach>
								</div>
							</div>
						</c:forEach>
					</div>
					
					<div class="well" style="width: calc(100% - 15px - 25%); margin-left: 15px; float: left; text-align: center;">
						<div class="nothingSelected" style="display: inline-block; position: relative; top: 50%; transform: translateY(-50%); -webkit-transform: translateY(-50%);">
							<span style="font-size: 30px;">Select a script or a calcul to begin editing it!</span>
						</div>
					
						<div class="launchCalculPanel" style="display: none; height: 100%; max-height: 100%;">
							<div style="height: 25%; max-height: 25%;">
								<span id="calculName" style="font-size: 30px; font-weight: bold;"></span>
								
								<div class="selectDimensionLabel" style="display: none;">
									In order to execute this calculation, you need to select parameters for the following dimensions:
								</div>
								
								<div class="col-lg-1">
									<span>Pre-selection: </span>
								</div>
								<div class="col-lg-11">
									<select class="form-control treeSelectionSelect">
										<option value="default"></option>
									</select>
								</div>
							</div>
							
							<div class="calculElementContainer" style="height: 60%; max-height: 60%; overflow-y: auto;">
								<table class="table table-bordered">
									<thead>
										<tr>
											<th class="col-lg-2">Dimension</th>
											<th class="col-lg-2">Variable</th>
											<th class="col-lg-8">Tree</th>
										</tr>
									</thead>
									
									<tbody class="parametersContainer">
										
									</tbody>
								</table>
							</div>
							
							<div style="height: 10%; max-height: 10%; clear: both;">
								<br>
								<button type="button" id="launchCalcul" class="btn btn-lg btn-success">Execute</button>
								<button type="button" class="btn btn-lg btn-info" data-toggle="modal" data-target="#myModal">Save selection</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Modal -->
		<div id="myModal" class="modal fade" role="dialog">
			<div class="modal-dialog">
				<!-- Modal content-->
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">New selection</h4>
					</div>
					
					<div class="modal-body" style="display: inline-block; width: 100%;">
						<div class="col-lg-12" style="margin: 0px 0px 0px 15px;">
							<label for="selectionNameInput">Selection name: </label>
							<input type="text" class="form-control" name="selectionNameInput" id="selectionNameInput" />
						</div>
					</div>
					
					<div class="modal-footer">
						<button type="button" class="btn btn-info" id="saveSelection">Save</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
		
		
		<%@ include file="../../template/footer.jsp" %>
	</div>

	<script type="text/javascript" src="../../js/calculations/treeBuilder.js"></script>
	<script type="text/javascript" src="../../js/checkUnloading.js"></script>
	<script type="text/javascript" src="../../js/calculations/launchCalculation/launchCalculation.js"></script>
</body>
</html>