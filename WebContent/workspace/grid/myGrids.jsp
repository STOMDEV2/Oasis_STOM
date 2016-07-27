<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
</head>


<body>
	<%@ include file="../../template/navbar.jsp" %>

	<div class="wrapper">
		<div class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
		
			<br>
			<div class="row">
				<div class="col-sm-offset-5 col-sm-2">
					<button type="button" id="btnSaveMask" data-toggle="modal" data-target="#myModal"
						class="btn btn-lg btn-success">Create a grid</button>
				</div>
			</div>
			<br>
				
			<!-- Modal -->
			<div id="myModal" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Create a grid</h4>
						</div>

						<form class="form-horizontal" method="post"
								action="<%=request.getContextPath()%>/workspace/grid/createGrid"
								role="form">
							<div class="modal-body" style="display: inline-block; width: 100%;">
								<div class="form-group">
									<label for="Name" class="col-lg-3 control-label">Name</label>
									<div class="col-sm-9">
										<input class="form-control" autofocus="autofocus" type="text"
											id="Name" placeholder="Name" name="name" required>
									</div>
								</div>
								<div class="form-group">
									<label for="Description" class="col-sm-3 control-label">Masque</label>
									<div class="col-sm-9">
										<select class="form-control" name="mask" id="maskSelect">
											<option></option>
											<c:forEach items="${ requestScope.masks }" var="currentMask">
												<option value="${ currentMask.id }">${ currentMask.nameMask }</option>
											</c:forEach>
										</select>
									</div>
								</div>
							</div>

							<div class="modal-footer">
								<button type="submit" class="btn btn-primary">Create</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		
		
		
		
			<div class="row">
				<div class="table-responsive col-lg-12">
					<table  id="usersMaskTable" class="table table-bordered">
						<thead>
							<tr>
								<th>Nom</th>
								<th>Masque</th>
								<th>Application</th>
								<th>Auteur</th>
								<th>Date création</th>
								<th>Date dernière modification</th>
								<th>Accès</th>
								<th>Access</th>
								<th>Remove</th>
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${ requestScope.grids }" var="currentGrid">
								<tr>
									<td><c:out value="${ currentGrid.name }"></c:out></td>
									<td><c:out value="${ currentGrid.mask.nameMask }"></c:out></td>
									<td><c:out value="${ currentGrid.mask.cube.application }"></c:out></td>
									<td><c:out value="${ currentGrid.creator.login }"></c:out></td>
									
									<fmt:formatDate value="${ currentGrid.creationDate }" type="both" dateStyle="short" 
													timeStyle="short" var="creationDate" />
									<td><c:out value="${ creationDate }"></c:out></td>
									
									<fmt:formatDate value="${ currentGrid.lastModificationDate }" type="both" dateStyle="short" 
													timeStyle="short" var="lastModificationDate" />
									<td><c:out value="${ lastModificationDate }"></c:out></td>
									
									
									<td><c:out value="O.o"></c:out></td>
									<td>
										<a href="<%= request.getContextPath() %>/workspace/grid/displayGrid?id=${ currentGrid.id }" 
												class="btn btn-info">Access</a>
									</td>
									<td>
										<a href="<%= request.getContextPath() %>/workspace/grid/removeGrid?id=${ currentGrid.id }" 
												class="btn btn-danger" 
												onclick="return confirm('Do you really want to remove this grid ?')">Remove</a>
									</td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		
		<%@ include file="../../template/footer.jsp" %>
	</div>
	
	
</body>
</html>
