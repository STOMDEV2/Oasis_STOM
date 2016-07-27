<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<fmt:setBundle basename="fr.stcg.oasis.i18n.menu.menu" />


<!-- Fixed navbar -->
<nav class="navbar navbar-default navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed"
				data-toggle="collapse" data-target="#navbar" aria-expanded="false"
				aria-controls="navbar">
				<span class="sr-only">Toggle navigation</span> <span
					class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">OASIS</a>
		</div>




		<div id="navbar" class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				
				<li class="active"><a href="#"><span
						class="glyphicon glyphicon-home"></span>
							<fmt:message key="home" />
						</a></li>



				<c:choose>
					<c:when test="${ sessionScope.user != null }">
						<li role="presentation" class="dropdown"><a
							class="dropdown-toggle" data-toggle="dropdown" role="button"
							aria-expanded="false">
								<fmt:message key="mask" />
							<span class="caret"></span>
						</a>
							<ul class="dropdown-menu" role="menu">
								<li role="presentation">
									<c:choose>
										<c:when test="${sessionScope.userProfile.name == 'administrateur'}">
											<a role="menu-item" href="<%=request.getContextPath()%>/workspace/mask/mask">
												<fmt:message key="newMask" />		
											</a>
										</c:when>
										<c:otherwise>
											<a role="menu-item" class="greyed" disabled>
												<fmt:message key="newMask" />		
											</a>
										</c:otherwise>
									</c:choose>
								</li>
								<li role="presentation"><a role="menu-item"
									href="<%=request.getContextPath()%>/workspace/mask/myMasks">
									<fmt:message key="myMasks" />
								</a></li>
							</ul></li>


<!-- 						<li role="presentation"><a -->
<%-- 							href="<%=request.getContextPath()%>/workspace/myGrids"> <fmt:message --%>
<%-- 									key="grid" /> --%>
<!-- 						</a></li> -->


						<li role="presentation" class="dropdown"><a
							class="dropdown-toggle" data-toggle="dropdown" role="button"
							aria-expanded="false">
							<fmt:message key="grid" />
						<span class="caret"></span>
						</a>
							<ul class="dropdown-menu" role="menu">
								<li role="presentation"><a role="menu-item"
									href="<%= request.getContextPath() %>/workspace/grid/createGrid">
										<fmt:message key="newGrid" />
								</a></li>
								<li role="presentation"><a role="menu-item"
									href="<%= request.getContextPath() %>/workspace/myGrids">
									<fmt:message key="myGrids" />
								</a></li>
							</ul></li>
		
		
		
<!-- 						<li role="presentation" class="dropdown"><a -->
<!-- 							class="dropdown-toggle" data-toggle="dropdown" role="button" -->
<!-- 							aria-expanded="false"> -->
<%-- 							<fmt:message key="report" /> --%>
<!-- 						<span class="caret"></span> -->
<!-- 						</a> -->
<!-- 							<ul class="dropdown-menu" role="menu"> -->
		
<!-- 								<li role="presentation"><a role="menu-item" -->
<%-- 									href="<%= request.getContextPath() %>/workspace/creationGrille"> --%>
<%-- 									<fmt:message key="newReport" /> --%>
<!-- 								</a></li> -->
<!-- 								<li role="presentation"><a role="menu-item"> -->
<%-- 									<fmt:message key="newReport" /> --%>
<!-- 								</a></li> -->
<!-- 							</ul></li> -->
							
							
							
<!-- 						<li role="presentation" class="dropdown"><a -->
<!-- 							class="dropdown-toggle" data-toggle="dropdown" role="button" -->
<!-- 							aria-expanded="false"> -->
<%-- 							<fmt:message key="group" /> --%>
<!-- 						<span class="caret"></span> -->
<!-- 						</a> -->
<!-- 							<ul class="dropdown-menu" role="menu"> -->
<!-- 								<li role="presentation"><a role="menu-item"> -->
<%-- 									<fmt:message key="assignUserToGroup" /> --%>
<!-- 								</a></li> -->
<!-- 							</ul></li> -->
							
							
							
							
						<li role="presentation" class="dropdown">
							<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
								<fmt:message key="calculation" />
								<span class="caret"></span>
							</a>
							<ul class="dropdown-menu" role="menu">
								<li role="presentation">
									<a role="menu-item" href="<%= request.getContextPath() %>/workspace/calcul/launchCalcul">
										<fmt:message key="performCalculation" />
									</a>
								</li>
								<c:choose>
									<c:when test="${sessionScope.userProfile.name == 'administrateur'}">
										<li role="presentation"><a role="menu-item" href="<%= request.getContextPath() %>/workspace/calcul/myCalculs">
											<fmt:message key="calculationsAdministration" />
										</a></li>
										<li role="presentation"><a role="menu-item" href="<%= request.getContextPath() %>/workspace/calcul/getHistoricCalculLaunch">
											<fmt:message key="calculHistoric" />
										</a></li>
									</c:when>
									<c:otherwise>
										<li role="presentation"><a class="greyed" role="menu-item" disabled>
											<fmt:message key="calculationsAdministration" />
										</a></li>
										<li role="presentation"><a class="greyed" role="menu-item" disabled>
											<fmt:message key="calculHistoric" />
										</a></li>
									</c:otherwise>
								</c:choose>
								
							</ul>
						</li>
							
							
							
							
						<li role="presentation" class="dropdown"><a
							class="dropdown-toggle" data-toggle="dropdown" role="button"
							aria-expanded="false">
								<fmt:message key="parameter" />
							<span class="caret"></span>
						</a>
							<ul class="dropdown-menu" role="menu">
								<li role="presentation"><a role="menu-item"
									href="<%= request.getContextPath() %>/workspace/settings">
										<fmt:message key="generalParameter" />
								</a></li>
								<li role="presentation"><a role="menu-item">
									<fmt:message key="userParameter" />
								</a></li>
							</ul></li>
							
							
							
							
							
						<c:choose>
							<c:when test="${sessionScope.userProfile.name == 'administrateur'}">
								<li role="presentation" class="dropdown">
									<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
										<fmt:message key="administration" />
										<span class="caret"></span>
									</a>
									<ul class="dropdown-menu" role="menu">
										<li role="presentation">
											<a role="menu-item">
												<fmt:message key="securityGroupAdministration" />
											</a>
										</li>
										<li role="presentation">
											<a role="menu-item" href="<%= request.getContextPath() %>/workspace/gestionUtilisateur">
												<fmt:message key="userAdministration" />
											</a>
										</li>
									</ul>
								</li>
								</c:when>
							<c:otherwise>
								<li role="presentation" class="dropdown">
									<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" disabled>
										<fmt:message key="administration" />
										<span class="caret"></span>
									</a>
									<ul class="dropdown-menu" role="menu">
										<li role="presentation">
											<a  class="greyed" role="menu-item" disabled>
												<fmt:message key="securityGroupAdministration" />
											</a>
										</li>
										<li role="presentation">
											<a class="greyed" role="menu-item" disabled>
												<fmt:message key="userAdministration" />
											</a>
										</li>
									</ul>
								</li>
							</c:otherwise>
						</c:choose>
						
							
							
							
							
							
						
						
						
						<li role="presentation"><a
							href="<%= request.getContextPath() %>/workspace/logout">
								<fmt:message key="logout" />
						</a></li>
					</c:when>
					<c:otherwise>
						<li role="presentation"><a
							href="<%= request.getContextPath() %>/workspace/login">
								<fmt:message key="login" />
						</a></li>
					</c:otherwise>
				</c:choose>
			</ul>


			<ul class="nav navbar-nav navbar-right">
				<li class="internationalizationFlagElement"><a class="internationalizationFlagLink" href="<%= request.getContextPath() %>/changeLocale?loc=fr">
					<img  src="<%= request.getContextPath() %>/img/internationalization/fr.png"/>
				</a></li>
				<li class="internationalizationFlagElement"><a class="internationalizationFlagLink" href="<%= request.getContextPath() %>/changeLocale?loc=en">
					<img  src="<%= request.getContextPath() %>/img/internationalization/uk.png"/>
				</a></li>
			</ul>
		</div>
	</div>
</nav>