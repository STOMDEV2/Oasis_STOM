<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
	<link rel="stylesheet" type="text/css" href="../../css/maskHandler.css" />
	<link rel="stylesheet" type="text/css" href="../../css/spreadsheet/spreadsheet.css" />
	<link href="../../css/bootstrap-switch.css" rel="stylesheet">
</head>


<body>
	<%@ include file="../../template/navbar.jsp" %>


	<div class="wrapper">
		<div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
	
			<div class="row">
  				<h2 id="nameTitle" class="text-primary">Nom du masque</h2>
				<div class="col-md-12">
					<span class="nameMask"></span>
					<br>
  				</div>
			</div>
			<hr>
			<div class="row">
				<h2 class="text-primary">Définition du contexte</h2>
			</div>
	
			<div id="dragArea">
	
				<div class="row">
					<h3>Contexte d'en-tête</h3>
					<div id="divDimensions" class="dimensionContainer well" role="group"
						area-label="pow"></div>
				</div>
	
				<div class="row">
					<div class="row">
						<div class="col-md-6">
							<h3>Contexte de lignes</h3>
	
	
							<div id="divRowContext"
								class="dimensionContainer context-height well" role="group">
	
							</div>
						</div>
	
						<div class="col-md-6">
							<h3>Contexte de colonnes</h3>
	
	
							<div id="divColumnContext"
								class="dimensionContainer context-height well" role="group">
							</div>
	
						</div>
					</div>
				</div>
	
	
				<div class="row">
					<div class="col-md-12">
						<hr>
						<span style=""></span>
					</div>
				</div>
			</div>
	
	
	
			<div class="row">
				<div class="row">
					<div class="col-md-12">
						<h2 class="text-primary">Définition des membres Essbase</h2>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="row">
					<div class="col-md-12">
						<h3>En-tête</h3>
					</div>
				</div>
					
				<div id="divHeader" class="col-md-12">
                    <div class="row">
                        <div class="container-fluid">
                            <ul id="tabHeader" class="nav nav-tabs">
                                <li class="nav active"><a href="#tabRetrieveHeader" data-toggle="tab">Restitution</a></li>
                                <li class="nav"><a href="#tabCaptureHeader" data-toggle="tab">Saisie</a></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane fade in active" id="tabRetrieveHeader" >
                                    <div class="panel panel-primary">
                                        <div class="panel-heading">
                                            <h3 class="panel-title"></h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="well wells-content">
                                                <div class="row">
                                                    <div id="pairR" class="col-md-6">
                                                    </div>
                                                    <div id="impairR" class="col-md-6">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade in" id="tabCaptureHeader" >
                                    <div class="panel panel-primary">
                                        <div class="panel-heading">
                                            <h3 class="panel-title"></h3>
                                        </div>
                                        <div class="panel-body">
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
                        </div>
                    </div>
                </div>
                				
				<div class="row">
					<div class="col-md-12">
						<h3>Colonnes</h3>
					</div>
				</div>
				<!-- COLUMN SPREADSHEET -->
				
				<div class="panel panel-primary">
                	<div class="panel-heading">
                    	<h3 class="panel-title"></h3>
                    </div>
                    <div class="panel-body">
                    	<div id="spreadsheetColumns" class="context"></div>
                    </div>
				</div>
		
				<div class="row">
					<div class="col-md-12">
						<h3>Lignes</h3>
					</div>
				</div>
		
				<!-- ROW SPREADSHEET -->
				<div class="panel panel-primary">
                	<div class="panel-heading">
                    	<h3 class="panel-title"></h3>
                    </div>
                    <div class="panel-body">
                    	<div id="spreadsheetLines" class="context"></div>
                    </div>
				</div>

			</div>
		</div>
	
		<%@ include file="../../template/footer.jsp" %>
	</div>



	<script type="text/javascript">
		var readOnly = true;
	</script>
	<script src="../../js/bootstrap-switch.js"></script>
	<script type="text/javascript">
		var mask = <%=request.getAttribute("mask")%>;

		$(".nameMask").text(mask.NameMask);
		
		console.log(mask);
	</script>
	<script type="text/javascript" src="../../js/spreadsheet/spreadsheet.js"></script>
	<script type="text/javascript" src="../../js/spreadsheet/access/initSpreadsheet.js"></script>
	<script type="text/javascript" src="../../js/mask/maskHandler.js"></script>
	<script type="text/javascript" src="../../js/jquery-migrate-1.1.0.js"></script>
	
	
</body>
</html>