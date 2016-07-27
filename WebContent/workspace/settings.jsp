<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <!-- voir si pas repenser variables en faisant un tableau : base générique, base mensuelle, base annuelle-->
    <head>
        <%@ include file="../../template/header.jsp" %>
        
        <link rel="stylesheet" type="text/css" href="../css/settings.css" />
        <link href="../css/highlight.css" rel="stylesheet">
        <link href="../css/bootstrap-switch.css" rel="stylesheet">
        
<!--         <link href="../css/main.css" rel="stylesheet"> -->
    </head>
    

    <body>
        <%@ include file="../../template/navbar.jsp" %>
        
        <%@ include file="../../template/busyIndicator.jsp" %>
        
        <div class="wrapper">

	        <div id="container" class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
	           <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

                  <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOne">
                      <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Définition des variables dynamiques
                        </a>
                      </h4>
                    </div>
                    <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                        <div id="formDimensions" class="panel-body">
                            <div class="container col-lg-12">
                                <ul id="variableNav" class="nav nav-tabs">
                                    
                                </ul>

                                <!-- Tab panes -->
                                <div id="variablePanes" class="tab-content">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingTwo">
                      <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          Parameter 2
                        </a>
                      </h4>
                    </div>
                    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                      <div class="panel-body">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                      </div>
                    </div>
                  </div>
                  <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingThree">
                      <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                          Parameter 3
                        </a>
                      </h4>
                    </div>
                    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                      <div class="panel-body">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                      </div>
                    </div>
                  </div>
                </div>

	        </div>
	        
	        <%@ include file="../template/footer.jsp" %>
		</div>


       
        <script src="../js/highlight.js"></script>
        <script src="../js/bootstrap-switch.js"></script>
        <script src="../js/main.js"></script>
        <script type="text/javascript" charset="UTF-8" src="../js/settings.js"></script>
    </body>
</html>