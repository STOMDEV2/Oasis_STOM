<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
    	<%@ include file="../../template/header.jsp" %>
    	
        <link rel="stylesheet" type="text/css" href="../css/gestionUtilisateur.css" />
    </head>
    
    <!-- Voir comment gérer les formulaires avec entrée et clic + problème placement formulaires même endroit -->
    <body>
        <%@ include file="../../template/navbar.jsp" %>
        
        <%@ include file="../../template/busyIndicator.jsp" %>

       <div class="wrapper">
	        <div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10">

		        <div class="tab">
		            <ul id="myTab" class="nav nav-tabs" role="tablist">
		                <li class="active"><a data-toggle="tab" href="#addUser" >Ajouter utilisateur</a></li>
		                <li><a data-toggle="tab" href="#modifyUser">Modifier utilisateur</a></li>
		                <li><a data-toggle="tab" href="#deleteUser" >Supprimer utilisateur</a></li>
		            </ul>
		            <div class="tab-content">
		                <div id="addUser" class="tab-pane fade in active">
		                    <div class="content-center">
		                        <form id="addUserForm" class="form-horizontal">
		                            <div class="form-group">
		                                <label for="inputLoginAdd" class="col-sm-2 control-label">Login</label>
		                                    <div class="col-sm-10">
		                                        <input type="text" class="form-control" name="inputLoginAdd" id="inputLoginAdd" placeholder="Login de l'utilisateur" required/>
		                                    </div>
		                            </div>
		                            <div class="form-group">
		                                <label for="selectProfileAdd" class="col-sm-2 control-label">Profil</label>
		                                    <div class="col-sm-10">
		                                        <select id="selectProfileAdd" name="selectProfileAdd" class="form-control">
		                                            <option value="0">Choisissez un profil</option>
		                                            <c:forEach items="${requestScope.profiles}" var="profile">
		                                            	<option value="${profile.idProfile}"> ${ profile.name }</option>
		                                            </c:forEach>
		                                        </select>
		                                    </div>
		                            </div>
		                            <div class="form-group">
		                                <label for="inputNameAdd" class="col-sm-2 control-label">Nom</label>
		                                <div class="col-sm-10">
		                                    <input type="text" class="form-control" name="inputNameAdd" id="inputNameAdd" placeholder="Nom de l'utilisateur" required/>
		                                </div>
		                            </div>
		                            <div class="form-group">
		                                <label for="inputFirstNameAdd" class="col-sm-2 control-label">Prénom</label>
		                                <div class="col-sm-10">
		                                    <input type="text" class="form-control" name="inputFirstNameAdd" 
		                                           id="inputFirstNameAdd" placeholder="Prénom de l'utilisateur" required/>
		                                </div>
		                            </div>
		                            <div class="form-group">
		                                <label for="inputEmailAdd" class="col-sm-2 control-label">Email</label>
		                                <div class="col-sm-10">
		                                    <input type="email" class="form-control" name="inputEmailAdd" 
		                                           id="inputEmailAdd" placeholder="Mail de l'utilisateur" required />
		                                </div>
		                            </div>
		                            <div class="form-group">
		                                <label for="inputPhoneAdd" class="col-sm-2 control-label">Téléphone</label>
		                                <div class="col-sm-10">
		                                    <input type="text" class="form-control" name="inputPhoneAdd" 
		                                           id="inputPhoneAdd" placeholder="Téléphone de l'utilisateur" required/>
		                                </div>
		                            </div>
		                            <div class="form-group">
		                                <div class="col-sm-offset-2 col-sm-10">
		                                    <input id="addButton" class="btn btn-default" value="Ajouter"/>
		                                </div>
		                            </div>
		                        </form>
		                    </div>
		                </div>
		                <div id="modifyUser" class="tab-pane fade in">
		                    <div class="row">
		                        <div class="content-center">
		                            <form id="lookForUserForm" class="form-horizontal">
		                                <div class="form-group">
		                                    <label for="inputLoginLook" class="col-sm-2 control-label">Utilisateur ?</label>
		                                        <div class="col-sm-10">
		                                            <input type="text" class="form-control" name="inputLoginLook" id="inputLoginLook" placeholder="Login de l'utilisateur" required> 
		                                        </div>
		                                </div>
		                            </form>
		                        </div>
		                        <div class="row">
		                            <div class="col-sm-offset-1 col-sm-2"><span id="loader"></span></div>
		                        </div>
		                        <div class="row">
		                            <form id="modifyUserForm" method="post" action="<c:url value="gestionUtilisateur?action=modify" />" class="form-horizontal hide">
		                                <div class="form-group">    
		                                    <label for="inputLoginModify" class="col-sm-2 control-label">Login</label>
		                                        <div class="col-sm-10">
		                                            <input type="text" class="form-control" name="inputLoginModify" id="inputLoginModify" placeholder="Login de l'utilisateur" required/>
		                                        </div>
		                                </div>
		                                <div class="form-group" >
		                                    <label for="selectProfileModify" class="col-sm-2 control-label">Profil</label>
		                                        <div class="col-sm-10">
		                                            <select id="selectProfileModify" name="selectProfileModify" class="form-control">
		                                                <option value="0">Choisissez un profil</option>
		                                                <c:forEach items="${requestScope.profiles}" var="profile">
		                                            		<option value="${profile.idProfile}"> ${ profile.name }</option>
		                                            	</c:forEach>
		                                            </select>
		                                        </div>
		                                </div>
		                                <div class="form-group">
		                                    <label for="inputNameModify" class="col-sm-2 control-label">Nom</label>
		                                    <div class="col-sm-10">
		                                        <input type="text" class="form-control" name="inputNameModify" id="inputNameModify" placeholder="Nom de l'utilisateur" required/>
		                                    </div>
		                                </div>
		                                <div class="form-group">
		                                    <label for="inputFirstNameModify" class="col-sm-2 control-label">Prénom</label>
		                                    <div class="col-sm-10">
		                                        <input type="text" class="form-control" name="inputFirstNameModify" 
		                                               id="inputFirstNameModify" placeholder="Prénom de l'utilisateur" required/>
		                                    </div>
		                                </div>
		                                <div class="form-group">
		                                    <label for="inputEmailModify" class="col-sm-2 control-label">Email</label>
		                                    <div class="col-sm-10">
		                                        <input type="email" class="form-control" name="inputEmailModify" 
		                                               id="inputEmailModify" placeholder="Mail de l'utilisateur" required />
		                                    </div>
		                                </div>
		                                <div class="form-group">
		                                    <label for="inputPhoneModify" class="col-sm-2 control-label">Téléphone</label>
		                                    <div class="col-sm-10">
		                                        <input type="text" class="form-control" name="inputPhoneModify" 
		                                               id="inputPhoneModify" placeholder="Téléphone de l'utilisateur" required/>
		                                    </div>
		                                </div>
		                                <div class="form-group">
		                                    <div class="col-sm-offset-2 col-sm-10">
		                                        <input id="modifyButton" class="btn btn-default" value="Modifier"/> <!-- voir après comment gérer les appuis sur entrée parce que bon, pas pratique, pour l'heure on met tout en click -->
		                                    </div>
		                                </div> 
		                            </form>
		                        </div>
		                    </div>
		                </div>
		                <div id="deleteUser" class="tab-pane fade in">
		                    <div class="content-center">
		                        <form id="deleteUserForm" class="form-horizontal">
		                            <div class="form-group">
		                                <label for="inputLoginDelete" class="col-sm-2 control-label">Login</label>
		                                    <div class="col-sm-10">
		                                        <input type="text" class="form-control" name="inputLoginDelete" 
		                                               id="inputLoginDelete" placeholder="Login de l'utilisateur" />
		                                    </div>
		                            </div>
		                            <div class="form-group">
		                                <div class="col-sm-offset-2 col-sm-10">
		                                    <input id="deleteButton" class="btn btn-default" value="Supprimer"/>
		                                </div>
		                            </div>
		                        </form>
		                    </div>
		                </div>
		            </div>
		        </div>
			</div>
			
			<%@ include file="../template/footer.jsp" %>
		</div>

        <script type="text/javascript" src="../js/gestionUtilisateur.js"></script>
    </body>
</html>