<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<footer>
	<div class="container footer">
		<div class="row">
			<div class="col-md-2 center-y">
				<img src="${pageContext.request.contextPath}/img/logo.png" class="img-rounded logo">
			</div>
			<div class="col-md-3 pull-right center-y projectNameFooterContainer">
				<p class="text-primary projectNameFooter">OASIS v0.1<br><span style="text-transform:capitalize">${sessionScope.userProfile.name}</span> ${sessionScope.user.firstname} ${sessionScope.user.name}<br>${sessionScope.applicationCube}</p>
			</div>
		</div>
	</div>
</footer>