<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
	
	<link rel="stylesheet" type="text/css" href="../../css/spreadsheet/spreadsheet.css" />
</head>


<body>
	<%@ include file="../../template/navbar.jsp" %>
	
	<%@ include file="../../template/busyIndicator.jsp" %>

	<div class="spreadSheet" style="display: none; position: absolute; width: 50%; z-index: 9999; box-shadow: 1px 1px 8px #555; background-color: white;">
	</div>

	<div class="wrapper">
		<div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
			<div class="row">
				<h1>Create a Grid</h1>
			</div>
	
	    	<form class="form-horizontal" method="post" action="<%= request.getContextPath() %>/workspace/grid/createGrid" role="form">
	    		<div class="form-group">
		    		<label for="Name" class="col-sm-2 control-label">Name</label>
		    		<div class="col-sm-3">
		    			<input class="form-control" autofocus="autofocus" type="text" id="Name" placeholder="Name" name="name" required>
		    		</div>
		    	</div>
		    	<div class="form-group">
		    		<label for="Description" class="col-sm-2 control-label">Masque</label>
		    		<div class="col-sm-3">
		    			<select class="form-control" name="mask" id="maskSelect">
		    				<option></option>
		    				<c:forEach items="${ requestScope.masks }" var="currentMask">
		    					<option value="${ currentMask.id }">${ currentMask.nameMask }</option>
		    				</c:forEach>
		    			</select>
		    		</div>
		    	</div>
	
		    	
	    		<div class="form-group">
				   	<div class="col-sm-offset-2 col-sm-10">
				     	<button type="submit" class="btn btn-primary">Create</button>
				    </div>
				</div>
	    	</form>
		</div>
		
		
		<%@ include file="../../template/footer.jsp" %>
	</div>
	
	
	<script type="text/javascript" src="../../js/spreadsheet/spreadsheet.js"></script>
	<script type="text/javascript" src="../../js/jquery-migrate-1.1.0.js"></script>
</body>
</html>