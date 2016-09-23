<!--A Design by W3layouts
Author: W3layout
Author URL: http://w3layouts.com
License: Creative Commons Attribution 3.0 Unported
License URL: http://creativecommons.org/licenses/by/3.0/
Modified by Loic RIOU
-->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	isELIgnored="false" pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE HTML>
<html>
<head>
<title><spring:message code="title.error403" /></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link href='//fonts.googleapis.com/css?family=Courgette' rel='stylesheet' type='text/css'>
<style type="text/css">
body{
	font-family: 'Courgette', cursive;
}
body{
	background:#f3f3e1;
}	
.wrap{
	margin:0 auto;
	width:1000px;
}
.logo{
	margin-top:50px;
}	
.logo h1{
	font-size:200px;
	color:#8F8E8C;
	text-align:center;
	margin-bottom:1px;
	text-shadow:1px 1px 6px #fff;
}	
.logo p{
	color:rgb(228, 146, 162);
	font-size:20px;
	margin-top:1px;
	text-align:center;
}	
.logo p span{
	color:lightgreen;
}	
.sub a{
	color:white;
	background:#8F8E8C;
	text-decoration:none;
	padding:7px 120px;
	font-size:13px;
	font-family: arial, serif;
	font-weight:bold;
	-webkit-border-radius:3em;
	-moz-border-radius:.1em;
	-border-radius:.1em;
}	
.footer{
	color:#8F8E8C;
	position:absolute;
	right:10px;
	bottom:10px;
}	
.footer a{
	color:rgb(228, 146, 162);
}	
</style>
</head>


<body>
	<div class="wrap">
	   <div class="logo">
	   <h1><spring:message code="code.error403" /></h1>
	    <p><spring:message code="description.error403" /></p>
  	      <div class="sub">
	        <p><a href="${pageContext.request.contextPath}/"><spring:message code="message.back" /></a></p>
	      </div>
        </div>
	</div>
	
	<div class="footer">
	 <spring:message code="footer.error403" />
	</div>
	
</body>