<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
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
						<a href="mask" class="btn btn-lg btn-success">Create a mask</a>
					</div>
				</div>
				<br>
			
				<div class ="row">
					<div class="table-responsive">
						<table  id="usersMaskTable" class="table table-bordered">
							<thead>
								<tr>
									<th>Nom</th>
									<th>Application</th>
									<th>Auteur</th>
									<th>Date création</th>
									<th>Date dernière modification</th>
									<th>Dernier éditeur</th>
									<th>Accès</th>
									<th>Access</th>
									<th>Modify</th>
									<th>Remove</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach items="${ requestScope.masks }" var="currentMask">
									<tr>
										<td><c:out value="${ currentMask.nameMask }"></c:out></td>
										<td><c:out value="${ currentMask.cube.application }"></c:out></td>
										<td><c:out value="${ currentMask.author.login }"></c:out></td>
										
										<fmt:formatDate value="${ currentMask.creationDate }" type="both" dateStyle="short" 
														timeStyle="short" var="creationDate" />
										<td><c:out value="${ creationDate }"></c:out></td>
										
										<fmt:formatDate value="${ currentMask.lastModificationDate }" type="both" dateStyle="short" 
														timeStyle="short" var="lastModificationDate" />
										<td><c:out value="${ lastModificationDate }"></c:out></td>
										
										<td><c:out value="${ currentMask.lastEditor.login }"></c:out></td>
										<td><c:out value="O.o"></c:out></td>
										<td>
											<a href="<%= request.getContextPath() %>/workspace/mask/displayMask?id=${ currentMask.id }" 
													class="btn btn-success">Access</a>
										</td>
										<td>
											<!-- <a href="<%= request.getContextPath() %>/workspace/mask/modifyMask?id=${ currentMask.id }" 
													class="btn btn-info">Modify</a> -->
												<a href="<%= request.getContextPath() %>/workspace/mask/mask#modify?id=${ currentMask.id }" 
													class="btn btn-info">Modify</a>
										</td>
										<td>
											<a href="<%= request.getContextPath() %>/workspace/mask/removeMask?id=${ currentMask.id }" 
													class="btn btn-danger" 
													onclick="if(${ fn:length(currentMask.grids) > 0 })
																	{
																		alert('Some grids are bind to this mask. Please remove them first.');
																		return false;
																	}
																else 
																	return confirm('Do you really want to remove this mask ?');">Remove</a>
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