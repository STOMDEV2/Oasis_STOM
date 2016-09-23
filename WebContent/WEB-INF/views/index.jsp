<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	isELIgnored="false" pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<html manifest="/alappro.manifest">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title>AlapPRO</title>

<!-- Bootstrap Core CSS -->
<link href="${pageContext.request.contextPath}/dist/css/bootstrap.css"
	rel="stylesheet">

<!-- MetisMenu CSS -->
<link href="/AlapPRO/dist/css/metisMenu.css" rel="stylesheet">

<!-- Timeline CSS -->
<link href="/AlapPRO/dist/css/timeline.css" rel="stylesheet">

<!-- Custom CSS -->
<link href="/AlapPRO/dist/css/sb-admin-2.css" rel="stylesheet">

<!-- Morris Charts CSS -->
<link href="/AlapPRO/dist/css/morris.css" rel="stylesheet">

<!-- Custom Fonts -->
<link href="/AlapPRO/dist/css/font-awesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
</head>
<!-- Modification for push -->
<body>
	<c:if test="${!empty sessionScope.username}">
		<c:redirect url="/pro/getConnection" />
	</c:if>

	<div class="container">
		<div class="wrapper">
			<form action="/AlapPRO/pro/getConnection" method="POST"
				id="Login_Form" name="Login_Form" class="form-signin">
				<h3 class="form-signin-heading">
					<img src="${pageContext.request.contextPath}/dist/img/logo.png"></img>
				</h3>
				<hr class="colorgraph">
				<br> <input type="text" class="form-control" id="username"
					name="username" placeholder="Username" autofocus="" /> <input
					type="password" class="form-control" id="password" name="password"
					placeholder="Password" />

				<button class="btn btn-lg btn-primary btn-block" name="Submit"
					value="Login" type="Submit">Login</button>
			</form>
		</div>
	</div>
</body>
</html>
