<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<%@ include file="template/header.jsp" %>
	</head>
	
	
	<body>
		<%@ include file="template/navbar.jsp" %>
		
		<%@ include file="template/busyIndicator.jsp" %>
	
		<div class="wrapper">
			<div class="container mainContainer col-lg-offset-1 col-lg-10">
				<form style="margin-top: 100px;" id="actualForm" class="form-horizontal" method="post" ><!-- action="<%= request.getContextPath() %>/login?action=connexion" -->
		  			<div class="form-group">
		    			<label for="inputLogin" class="col-md-2 control-label">Login</label>
		    				<div class="col-md-10">
		      					<input type="text" class="form-control" id="inputLogin" name="login" placeholder="Login">
		    				</div>
		  			</div>
		  			<div class="form-group">
		    			<label for="inputPassword" class="col-sm-2 control-label">Mot de passe</label>
		    			<div class="col-md-10">
		      				<input type="password" class="form-control" id="inputPassword" name="password" placeholder="Mot de passe">
		    			</div>
		  			</div>
		  			<div class="form-group">
		    			<label for="inputServer" class="col-md-2 control-label">Serveur</label>
		    			<div class="col-md-10">
		      				<input type="text" class="form-control" id="inputServer" name="server" placeholder="Serveur">
		    			</div>
		  			</div>
		  			<div id="divAppliCube" class="form-group">
		  				<label for="selectAppliCube" class="col-md-2 control-label"></label>
		  				<div class="col-md-10">
		      				<select id="selectAppliCube" name="selectAppliCube" class="form-control hide">
		      					<option value="none">Choisissez une application</option>
		      				</select>
		    			</div>
		  			</div>
		  			<div class="form-group">
		    			<div class="col-md-offset-2 col-md-10">
		    				<div class="checkbox">
		      					<input type="checkbox" name="inputSaveCredentials" id="inputSaveCredentials" class="my-checkboxs med">
		        				<label for="inputSaveCredentials" class="my-labels elegant med">
		          					Se souvenir de moi
		        				</label>
		        			</div>
		    			</div>
		  			</div>
		  			<div class="form-group">
		    			<div class="col-md-offset-2 col-md-10">
		      				<button id="connectButton" class="btn btn-default">Se connecter</button>
		    			</div>
		  			</div>
				</form>
				<div class="row">
					<div class="col-md-offset-5 col-md-2"><span id="loader"></span></div>
				</div>
			</div>
			
			<%@ include file="template/footer.jsp" %>
		</div>
		
		
		
		<script type="text/javascript" charset="UTF-8" src="js/connexion.js"></script>
	</body>
</html>