<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	isELIgnored="false" pageEncoding="ISO-8859-1"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html manifest="alappro.manifest">
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

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>
<!-- Modification for push -->
<body>

	<div id="wrapper">

		<!-- Navigation -->
		<nav class="navbar navbar-default navbar-static-top" role="navigation"
			style="margin-bottom: 0">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse"
				data-target=".navbar-collapse">
				<span class="sr-only">Toggle navigation</span> <span
					class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="/AlapPRO">AlapPRO v1.0</a>
		</div>
		<!-- /.navbar-header -->

		<ul class="nav navbar-top-links navbar-right">
			<li class="dropdown"><a class="dropdown-toggle"
				data-toggle="dropdown" href="#"> <i class="fa fa-envelope fa-fw"></i>
					<i class="fa fa-caret-down"></i>
			</a>
				<ul class="dropdown-menu dropdown-messages">
					<li><a href="#">
							<div>
								<strong>John Smith</strong> <span class="pull-right text-muted">
									<em>Yesterday</em>
								</span>
							</div>
							<div>Lorem ipsum dolor sit amet, consectetur adipiscing
								elit. Pellentesque eleifend...</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<strong>John Smith</strong> <span class="pull-right text-muted">
									<em>Yesterday</em>
								</span>
							</div>
							<div>Lorem ipsum dolor sit amet, consectetur adipiscing
								elit. Pellentesque eleifend...</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<strong>John Smith</strong> <span class="pull-right text-muted">
									<em>Yesterday</em>
								</span>
							</div>
							<div>Lorem ipsum dolor sit amet, consectetur adipiscing
								elit. Pellentesque eleifend...</div>
					</a></li>
					<li class="divider"></li>
					<li><a class="text-center" href="#"> <strong>Read
								All Messages</strong> <i class="fa fa-angle-right"></i>
					</a></li>
				</ul> <!-- /.dropdown-messages --></li>
			<!-- /.dropdown -->
			<li class="dropdown"><a class="dropdown-toggle"
				data-toggle="dropdown" href="#"> <i class="fa fa-tasks fa-fw"></i>
					<i class="fa fa-caret-down"></i>
			</a>
				<ul class="dropdown-menu dropdown-tasks">
					<li><a href="#">
							<div>
								<p>
									<strong>Task 1</strong> <span class="pull-right text-muted">40%
										Complete</span>
								</p>
								<div class="progress progress-striped active">
									<div class="progress-bar progress-bar-success"
										role="progressbar" aria-valuenow="40" aria-valuemin="0"
										aria-valuemax="100" style="width: 40%">
										<span class="sr-only">40% Complete (success)</span>
									</div>
								</div>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<p>
									<strong>Task 2</strong> <span class="pull-right text-muted">20%
										Complete</span>
								</p>
								<div class="progress progress-striped active">
									<div class="progress-bar progress-bar-info" role="progressbar"
										aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"
										style="width: 20%">
										<span class="sr-only">20% Complete</span>
									</div>
								</div>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<p>
									<strong>Task 3</strong> <span class="pull-right text-muted">60%
										Complete</span>
								</p>
								<div class="progress progress-striped active">
									<div class="progress-bar progress-bar-warning"
										role="progressbar" aria-valuenow="60" aria-valuemin="0"
										aria-valuemax="100" style="width: 60%">
										<span class="sr-only">60% Complete (warning)</span>
									</div>
								</div>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<p>
									<strong>Task 4</strong> <span class="pull-right text-muted">80%
										Complete</span>
								</p>
								<div class="progress progress-striped active">
									<div class="progress-bar progress-bar-danger"
										role="progressbar" aria-valuenow="80" aria-valuemin="0"
										aria-valuemax="100" style="width: 80%">
										<span class="sr-only">80% Complete (danger)</span>
									</div>
								</div>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a class="text-center" href="#"> <strong>See
								All Tasks</strong> <i class="fa fa-angle-right"></i>
					</a></li>
				</ul> <!-- /.dropdown-tasks --></li>
			<!-- /.dropdown -->
			<li class="dropdown"><a class="dropdown-toggle"
				data-toggle="dropdown" href="#"> <i class="fa fa-bell fa-fw"></i>
					<i class="fa fa-caret-down"></i>
			</a>
				<ul class="dropdown-menu dropdown-alerts">
					<li><a href="#">
							<div>
								<i class="fa fa-comment fa-fw"></i> New Comment <span
									class="pull-right text-muted small">4 minutes ago</span>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<i class="fa fa-twitter fa-fw"></i> 3 New Followers <span
									class="pull-right text-muted small">12 minutes ago</span>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<i class="fa fa-envelope fa-fw"></i> Message Sent <span
									class="pull-right text-muted small">4 minutes ago</span>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<i class="fa fa-tasks fa-fw"></i> New Task <span
									class="pull-right text-muted small">4 minutes ago</span>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a href="#">
							<div>
								<i class="fa fa-upload fa-fw"></i> Server Rebooted <span
									class="pull-right text-muted small">4 minutes ago</span>
							</div>
					</a></li>
					<li class="divider"></li>
					<li><a class="text-center" href="#"> <strong>See
								All Alerts</strong> <i class="fa fa-angle-right"></i>
					</a></li>
				</ul> <!-- /.dropdown-alerts --></li>
			<!-- /.dropdown -->
			<li class="dropdown"><a class="dropdown-toggle"
				data-toggle="dropdown" href="#"> <i class="fa fa-user fa-fw"></i>
					<i class="fa fa-caret-down"></i>
			</a>
				<ul class="dropdown-menu dropdown-user">
					<li><a href="#"><i class="fa fa-user fa-fw"></i>
							${collaboratorLastName } ${collaboratorFirstName } (${username })</a></li>
					<li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
					</li>
					<li class="divider"></li>
					<li><a href="index.jsp"><i class="fa fa-sign-out fa-fw"></i>
							Logout</a></li>
				</ul> <!-- /.dropdown-user --></li>
			<!-- /.dropdown -->
		</ul>
		<!-- /.navbar-top-links -->

		<div class="navbar-default sidebar" role="navigation">
			<div class="sidebar-nav navbar-collapse">
				<ul class="nav" id="side-menu">
					<li class="sidebar-search">
						<div class="btn-group btn-toggle">
							<c:choose>
								<c:when test="${empty connexion || connexion== true}">
									<button class="btn btn-sm btn-primary" id="online">Online</button>
									<button class="btn btn-sm btn-default active" id="offline">Offline</button>
								</c:when>
								<c:otherwise>
									<button class="btn btn-sm btn-default" id="online">Online</button>
									<button class="btn btn-sm btn-primary active" id="offline">Offline</button>
								</c:otherwise>
							</c:choose>
						</div>
					</li>
					<li class="sidebar-search">
						<div class="form-group has-feedback">
							<input type="text" class="form-control" placeholder="Search...">
							<i class="glyphicon glyphicon-search form-control-feedback"></i>
						</div>
					</li>


					<li><a href="#"><i class="fa fa-user fa-fw"></i> Suivi
							client</a>
						<ul class="nav nav-second-level">
							<li><a href="contacts">Liste des contacts</a></li>
							<li id="desactivate"><a href="workgroups/ui-create">Workgroups</a></li>
						</ul></li>

					<li id="desactivate2"><a href="/AlapPRO/contacts/ui-create"><i
							class="fa fa-users fa-fw"></i> Creer un contact</a></li>
					<li id="desactivate3"><a href="#"><i
							class="fa fa-phone fa-fw"></i> Passer un appel<span
							class="fa arrow"></span></a>
						<ul class="nav nav-second-level">
							<li><a href="call/callUser">Contact a appeler</a></li>
							<li><a href="phoningCampaign/configuration">Campagne de
									phoning</a></li>
							<li><a href="morris.html">Appel manqué</a></li>
						</ul> <!-- /.nav-second-level --></li>
					<li><a href="#"><i class="fa fa-table fa-fw"></i>
							Référentiel<span class="fa arrow"></span></a>
						<ul class="nav nav-second-leve">
							<li id="desactivate4"><a href="/AlapPRO/customers/create">Créer
									client</a></li>
						</ul>
						<ul class="nav nav-second-leve">
							<li><a href="customers/search">Recherche client</a></li>
						</ul></li>
					<li id="desactivate5"><a href="#"><i
							class="fa fa-table fa-fw"></i> Appel d'offres<span
							class="fa arrow"></span></a>
						<ul class="nav nav-second-leve">
							<li><a href="/AlapPRO/tenders/create">Créer un appel
									d'offres</a></li>
							<li><a href="/AlapPRO/tenders/renew">Renouveler un appel
									d'offres</a></li>
							<li><a href="/AlapPRO/tenders/response">Saisir la
									réponse des concurrents</a></li>
							<li><a href="tenders/followedTenders">Suivi des appels
									d'offres</a></li>
						</ul></li>
					<li id="desactivate6"><a href="#"><i
							class="fa fa-table fa-fw"></i> 
							 Simulation des ventes<span
							class="fa arrow"></span></a>
						<ul class="nav nav-second-leve">
							<li><a href="competitorSales/simulation">Simuler les
									ventes</a></li>
						</ul></li>
						
						
					<li id="desactivate7"><a href="#"> <i
							class="fa fa-shopping-cart fa-fw"></i>Produit
					</a>
						<ul class="nav nav-second-level">
							<li><a href="/AlapPRO/product/load_display_mock">Charger
									les produits</a></li> =======
							<li><a href="/AlapPRO/product/load_display_mock">Charger
									les produits</a></li> >>>>>>> 9361d4f877c5c2b7f86b376801840eb16c82173d
							<li><a href="product/display_mock">Afficher les produits</a></li>
						</ul> <!-- /.nav-second-level --></li>



					<li><a href="agenda/home"><i class="fa fa-calendar fa-fw"></i>
							Agenda</a></li>
							
							
					<li id="desactivate8"><a href="#"><i
							class="fa fa-plane fa-fw"></i>Visites<span class="fa arrow"></span></a>
						<ul class="nav nav-second-level">
							<li><a href="/AlapPRO/pro/notifications/home">Notifications</a></li>
							
							
						</ul> <!-- /.nav-second-level --></li> 
					<li id="desactivate"><a href="#"><i
							class="fa fa-pencil fa-fw"></i> Suggestion <span class="fa arrow"></span></a>
						<ul class="nav nav-second-level">
							<li><a href="suggestion/partnership">Suggestions
									partenariales</a></li> =======
							<li id="desactivate9"><a href="#"><i
									class="fa fa-pencil fa-fw"></i> Suggestion <span
									class="fa arrow"></span></a>
								<ul class="nav nav-second-level">
									<li><a href="suggestion/partnership">Suggestions
											partenariales</a></li> partenariales
									</a></li>
						<li><a href="">Suggestions commerciales</a></li>
						</ul></li>
				</ul>
				<!-- /.nav-second-level -->
				</li>
				<li><a href="#"><i class="fa fa-gears fa-fw"></i> Réglages<span
						class="fa arrow"></span></a>
					<ul class="nav nav-second-level">
					</ul> <!-- /.nav-second-level --></li>
				<li id="desactivate"><a href="#"><i
						class="fa fa-files-o fa-fw"></i> Plus
						
									</div>
			<!-- /.sidebar-collapse -->
		</div>
		<!-- /.navbar-static-side --> </nav>

		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">Tableau de bord (commercial)</h1>
				</div>
				<!-- /.col-lg-12 -->
			</div>
			<!-- /.row -->



			<!-- /.row -->
			<div class="row">
				<div class="col-lg-6">
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-bar-chart-o fa-fw"></i> Area Chart Example
							<div class="pull-right">
								<div class="btn-group">
									<button type="button"
										class="btn btn-default btn-xs dropdown-toggle"
										data-toggle="dropdown">
										Actions <span class="caret"></span>
									</button>
									<ul class="dropdown-menu pull-right" role="menu">
										<li><a href="#">Action</a></li>
										<li><a href="#">Another action</a></li>
										<li><a href="#">Something else here</a></li>
										<li class="divider"></li>
										<li><a href="#">Separated link</a></li>
									</ul>
								</div>
							</div>
						</div>
						<!-- /.panel-heading -->
						<div class="panel-body">
							<div id="morris-area-chart"></div>
						</div>
						<!-- /.panel-body -->
					</div>
					<!-- /.panel -->
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-bar-chart-o fa-fw"></i> Bar Chart Example
							<div class="pull-right">
								<div class="btn-group">
									<button type="button"
										class="btn btn-default btn-xs dropdown-toggle"
										data-toggle="dropdown">
										Actions <span class="caret"></span>
									</button>
									<ul class="dropdown-menu pull-right" role="menu">
										<li><a href="#">Action</a></li>
										<li><a href="#">Another action</a></li>
										<li><a href="#">Something else here</a></li>
										<li class="divider"></li>
										<li><a href="#">Separated link</a></li>
									</ul>
								</div>
							</div>
						</div>
						<!-- /.panel-heading -->
						<div class="panel-body">
							<div class="row">
								<div class="col-lg-4">
									<div class="table-responsive">
										<table class="table table-bordered table-hover table-striped">
											<thead>
												<tr>
													<th>#</th>
													<th>Date</th>
													<th>Time</th>
													<th>Amount</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>3326</td>
													<td>10/21/2013</td>
													<td>3:29 PM</td>
													<td>$321.33</td>
												</tr>
												<tr>
													<td>3325</td>
													<td>10/21/2013</td>
													<td>3:20 PM</td>
													<td>$234.34</td>
												</tr>
												<tr>
													<td>3324</td>
													<td>10/21/2013</td>
													<td>3:03 PM</td>
													<td>$724.17</td>
												</tr>
												<tr>
													<td>3323</td>
													<td>10/21/2013</td>
													<td>3:00 PM</td>
													<td>$23.71</td>
												</tr>
												<tr>
													<td>3322</td>
													<td>10/21/2013</td>
													<td>2:49 PM</td>
													<td>$8345.23</td>
												</tr>
												<tr>
													<td>3321</td>
													<td>10/21/2013</td>
													<td>2:23 PM</td>
													<td>$245.12</td>
												</tr>
												<tr>
													<td>3320</td>
													<td>10/21/2013</td>
													<td>2:15 PM</td>
													<td>$5663.54</td>
												</tr>
												<tr>
													<td>3319</td>
													<td>10/21/2013</td>
													<td>2:13 PM</td>
													<td>$943.45</td>
												</tr>
											</tbody>
										</table>
									</div>
									<!-- /.table-responsive -->
								</div>
								<!-- /.col-lg-4 (nested) -->
								<div class="col-lg-8">
									<div id="morris-bar-chart"></div>
								</div>
								<!-- /.col-lg-8 (nested) -->
							</div>
							<!-- /.row -->
						</div>
						<!-- /.panel-body -->
					</div>
					<!-- /.panel -->
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-clock-o fa-fw"></i> Responsive Timeline
						</div>
						<!-- /.panel-heading -->
						<div class="panel-body">
							<ul class="timeline">
								<li>
									<div class="timeline-badge">
										<i class="fa fa-check"></i>
									</div>
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
											<p>
												<small class="text-muted"><i class="fa fa-clock-o"></i>
													11 hours ago via Twitter</small>
											</p>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Libero laboriosam dolor perspiciatis omnis
												exercitationem. Beatae, officia pariatur? Est cum veniam
												excepturi. Maiores praesentium, porro voluptas suscipit
												facere rem dicta, debitis.</p>
										</div>
									</div>
								</li>
								<li class="timeline-inverted">
									<div class="timeline-badge warning">
										<i class="fa fa-credit-card"></i>
									</div>
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Autem dolorem quibusdam, tenetur commodi provident
												cumque magni voluptatem libero, quis rerum. Fugiat esse
												debitis optio, tempore. Animi officiis alias, officia
												repellendus.</p>
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Laudantium maiores odit qui est tempora eos, nostrum
												provident explicabo dignissimos debitis vel! Adipisci eius
												voluptates, ad aut recusandae minus eaque facere.</p>
										</div>
									</div>
								</li>
								<li>
									<div class="timeline-badge danger">
										<i class="fa fa-bomb"></i>
									</div>
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Repellendus numquam facilis enim eaque, tenetur nam id
												qui vel velit similique nihil iure molestias aliquam,
												voluptatem totam quaerat, magni commodi quisquam.</p>
										</div>
									</div>
								</li>
								<li class="timeline-inverted">
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Voluptates est quaerat asperiores sapiente, eligendi,
												nihil. Itaque quos, alias sapiente rerum quas odit! Aperiam
												officiis quidem delectus libero, omnis ut debitis!</p>
										</div>
									</div>
								</li>
								<li>
									<div class="timeline-badge info">
										<i class="fa fa-save"></i>
									</div>
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Nobis minus modi quam ipsum alias at est molestiae
												excepturi delectus nesciunt, quibusdam debitis amet, beatae
												consequuntur impedit nulla qui! Laborum, atque.</p>
											<hr>
											<div class="btn-group">
												<button type="button"
													class="btn btn-primary btn-sm dropdown-toggle"
													data-toggle="dropdown">
													<i class="fa fa-gear"></i> <span class="caret"></span>
												</button>
												<ul class="dropdown-menu" role="menu">
													<li><a href="#">Action</a></li>
													<li><a href="#">Another action</a></li>
													<li><a href="#">Something else here</a></li>
													<li class="divider"></li>
													<li><a href="#">Separated link</a></li>
												</ul>
											</div>
										</div>
									</div>
								</li>
								<li>
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Sequi fuga odio quibusdam. Iure expedita, incidunt
												unde quis nam! Quod, quisquam. Officia quam qui adipisci
												quas consequuntur nostrum sequi. Consequuntur, commodi.</p>
										</div>
									</div>
								</li>
								<li class="timeline-inverted">
									<div class="timeline-badge success">
										<i class="fa fa-graduation-cap"></i>
									</div>
									<div class="timeline-panel">
										<div class="timeline-heading">
											<h4 class="timeline-title">Lorem ipsum dolor</h4>
										</div>
										<div class="timeline-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipisicing
												elit. Deserunt obcaecati, quaerat tempore officia voluptas
												debitis consectetur culpa amet, accusamus dolorum fugiat,
												animi dicta aperiam, enim incidunt quisquam maxime neque
												eaque.</p>
										</div>
									</div>
								</li>
							</ul>
						</div>
						<!-- /.panel-body -->
					</div>
					<!-- /.panel -->
				</div>
				<!-- /.col-lg-8 -->
				<div class="col-lg-6">
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-bell fa-fw"></i> Activités
						</div>
						<!-- /.panel-heading -->
						<div class="panel-body">
							<div class="list-group">
								<c:forEach var="item" items="${collaboratorWk}">

									<a href="#" class="list-group-item"><i
										class="fa fa-user fa-fw"></i>${item.getCollaborator().firstName}
										${item.getCollaborator().lastName} <span
										class="pull-right text-muted small"><em>RDV</em> </span>
								</c:forEach>


							</div>
							<!-- /.list-group -->
							<a href="#" class="btn btn-default btn-block">View All Alerts</a>
						</div>
						<!-- /.panel-body -->
					</div>
					<!-- /.panel -->
					<div class="panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-bar-chart-o fa-fw"></i> Donut Chart Example
						</div>
						<div class="panel-body">
							<div id="morris-donut-chart"></div>
							<a href="#" class="btn btn-default btn-block">View Details</a>
						</div>
						<!-- /.panel-body -->
					</div>
					<!-- /.panel -->
					<div class="chat-panel panel panel-default">
						<div class="panel-heading">
							<i class="fa fa-comments fa-fw"></i> Chat
							<div class="btn-group pull-right">
								<button type="button"
									class="btn btn-default btn-xs dropdown-toggle"
									data-toggle="dropdown">
									<i class="fa fa-chevron-down"></i>
								</button>
								<ul class="dropdown-menu slidedown">
									<li><a href="#"> <i class="fa fa-refresh fa-fw"></i>
											Refresh
									</a></li>
									<li><a href="#"> <i class="fa fa-check-circle fa-fw"></i>
											Available
									</a></li>
									<li><a href="#"> <i class="fa fa-times fa-fw"></i>
											Busy
									</a></li>
									<li><a href="#"> <i class="fa fa-clock-o fa-fw"></i>
											Away
									</a></li>
									<li class="divider"></li>
									<li><a href="#"> <i class="fa fa-sign-out fa-fw"></i>
											Sign Out
									</a></li>
								</ul>
							</div>
						</div>
						<!-- /.panel-heading -->
						<div class="panel-body">
							<ul class="chat">
								<li class="left clearfix"><span class="chat-img pull-left">
										<img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar"
										class="img-circle" />
								</span>
									<div class="chat-body clearfix">
										<div class="header">
											<strong class="primary-font">Jack Sparrow</strong> <small
												class="pull-right text-muted"> <i
												class="fa fa-clock-o fa-fw"></i> 12 mins ago
											</small>
										</div>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing
											elit. Curabitur bibendum ornare dolor, quis ullamcorper
											ligula sodales.</p>
									</div></li>
								<li class="right clearfix"><span
									class="chat-img pull-right"> <img
										src="http://placehold.it/50/FA6F57/fff" alt="User Avatar"
										class="img-circle" />
								</span>
									<div class="chat-body clearfix">
										<div class="header">
											<small class=" text-muted"> <i
												class="fa fa-clock-o fa-fw"></i> 13 mins ago
											</small> <strong class="pull-right primary-font">Bhaumik
												Patel</strong>
										</div>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing
											elit. Curabitur bibendum ornare dolor, quis ullamcorper
											ligula sodales.</p>
									</div></li>
								<li class="left clearfix"><span class="chat-img pull-left">
										<img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar"
										class="img-circle" />
								</span>
									<div class="chat-body clearfix">
										<div class="header">
											<strong class="primary-font">Jack Sparrow</strong> <small
												class="pull-right text-muted"> <i
												class="fa fa-clock-o fa-fw"></i> 14 mins ago
											</small>
										</div>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing
											elit. Curabitur bibendum ornare dolor, quis ullamcorper
											ligula sodales.</p>
									</div></li>
								<li class="right clearfix"><span
									class="chat-img pull-right"> <img
										src="http://placehold.it/50/FA6F57/fff" alt="User Avatar"
										class="img-circle" />
								</span>
									<div class="chat-body clearfix">
										<div class="header">
											<small class=" text-muted"> <i
												class="fa fa-clock-o fa-fw"></i> 15 mins ago
											</small> <strong class="pull-right primary-font">Bhaumik
												Patel</strong>
										</div>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing
											elit. Curabitur bibendum ornare dolor, quis ullamcorper
											ligula sodales.</p>
									</div></li>
							</ul>
						</div>
						<!-- /.panel-body -->
						<div class="panel-footer">
							<div class="input-group">
								<input id="btn-input" type="text" class="form-control input-sm"
									placeholder="Type your message here..." /> <span
									class="input-group-btn">
									<button class="btn btn-warning btn-sm" id="btn-chat">
										Send</button>
								</span>
							</div>
						</div>
						<!-- /.panel-footer -->
					</div>
					<!-- /.panel .chat-panel -->
				</div>
				<!-- /.col-lg-4 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /#page-wrapper -->

	</div>
	<!-- /#wrapper -->

	<!-- jQuery -->
	<script src="/AlapPRO/dist/js/jquery.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script src="/AlapPRO/dist/js/bootstrap.js"></script>

	<!-- Metis Menu Plugin JavaScript -->
	<script src="/AlapPRO/dist/js/metisMenu.js"></script>

	<!-- Morris Charts JavaScript -->
	<script src="/AlapPRO/dist/js/raphael.js"></script>
	<script src="/AlapPRO/dist/js/morris.js"></script>
	<script src="/AlapPRO/dist/js/morris-data.js"></script>

	<!-- Custom Theme JavaScript -->
	<script src="/AlapPRO/dist/js/sb-admin-2.js"></script>

</body>

<script>
	$(document).ready(function() {
		$("#desactivate").click(function(e) {
			alert('click');
		})

	})
	$('.btn-toggle').click(
			function() {

				$(this).find('.btn').toggleClass('active');
				$(this).find('.btn').toggleClass('btn-primary')

				var connection = $(this).find('.btn-primary').attr("id");
				$.ajax({
					url : '/AlapPRO/pro/connexion/getConnexionType',
					data : 'connexion=' + connection,
					dataType : 'html',
					success : function(html) {
						/* 					$("#online").on("change",
						 function(){
						 $("#desactivate").attr('style', 'visibility:hidden;display:none')
						 });
						 $("#offline").on("change",
						 function() {
						 $("#desactivate").removeAttr('style')
						 }); */
						if (html == 'offline') {
							$("#desactivate").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate2").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate3").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate4").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate5").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate6").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate7").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate8").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate9").attr('style',
									'visibility:hidden;display:none')
							$("#desactivate10").attr('style',
									'visibility:hidden;display:none')

						} else {
							$("#desactivate").removeAttr('style')
							$("#desactivate2").removeAttr('style')
							$("#desactivate3").removeAttr('style')
							$("#desactivate4").removeAttr('style')
							$("#desactivate5").removeAttr('style')
							$("#desactivate6").removeAttr('style')
							$("#desactivate7").removeAttr('style')
							$("#desactivate8").removeAttr('style')
							$("#desactivate9").removeAttr('style')
							$("#desactivate10").removeAttr('style')

						}
					}

				});
			})
</script>
</html>
