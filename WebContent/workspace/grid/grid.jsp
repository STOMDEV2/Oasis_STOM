<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>



	
	<div id="modalWrapper" class="modal-container">
		<div id="modalContainer" class="container-fluid col-lg-offset-1 col-lg-10">
			<div class="row">
				<div class="col-lg-offset-1 col-lg-10">
					<div id="panelInfos" class="panel panel-default hide">
							<div class="panel-body">
    						<div class="col-lg-12">
    							<div class="row">
    								<div class="col-lg-offset-1 col-lg-10">
    									<p>
    										<strong>Name mask : </strong><span class="nameMask"></span>
    									</p>
    								</div>
    							</div>
    							<div class="row">
    								<div class="col-lg-offset-1 col-lg-10">
    									<p>
    										<strong>Name grid : </strong><span class="nameGrid"></span>
    									</p>
    								</div>
    							</div>
    						</div>
							</div>
							<div class="panel-footer">Grid's infos</div>
					</div>
					<div id="panelComment" class="panel panel-default hide">
  						<div class="panel-body">
    						<div class="col-lg-12">
	    						<div class="row">
	    							<div class="row">
										<div class="col-lg-offset-1 col-lg-10">
											<h4>Comment : </h4>
										</div>
									</div>
									<div class="row">
										<div class="col-lg-offset-1 col-lg-10">
											<textarea id="gridComment" name class="form-control grid-comments"></textarea>	
										</div>
									</div>
									<div class="row" style="margin-top:10px;">
										<div class="col-lg-offset-1 col-lg-4">
											<button id="saveComment" class="btn btn-primary">Comment</button>	
										</div>
									</div>
	    						</div>
	    					</div>
  						</div>
  						<div class="panel-footer">Comments</div>
					</div>
					<div id="panelScenarioParameter" class="panel panel-default hide">
  						<div class="panel-body">
  							<div class="parametersScenarioContainer col-lg-12 autocompleteContainerParent" style="margin-bottom: 25px; position: static;">
  								<div class="retrieve col-lg-6">
  									<h1>
  										Retrieve
  									</h1>

  									<div class="SCContainer">
  									</div>
  								</div>
  								<div class="capture col-lg-6">
  									<h1>
  										Capture
  									</h1>

  									<div class="SCContainer">
  									</div>
  								</div>

  								<div class="col-lg-12" style="margin-top: 15px; text-align: center;">
  									<button type="button" class="btn btn-primary btn-lg saveScenarioParameters">Save</button>
  									<!-- <button type="button" class="btn btn-primary btn-lg retrieveData">Retrieve</button>
  									<button type="button" class="btn btn-primary btn-lg saveData">Send</button> -->
  								</div>
  							</div>
  						</div>
  						<div class="panel-footer">Scenario parameters</div>
  					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
		<!-- SPREADSHEET -->
		<div id="spreadsheet" class="context"></div>
	</div>

	