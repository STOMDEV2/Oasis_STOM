<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>

<head>
	<%@ include file="../../template/header.jsp" %>
</head>


<body>
	<%@ include file="../../template/navbar.jsp" %>
	
	<%@ include file="../../template/busyIndicator.jsp" %>

	<div class="wrapper">
		<div class="container-fluid mainContainer col-lg-offset-1 col-lg-10">
			<br>
			<div class="row">
				<div class="col-lg-12" style="text-align: center;">
					<button type="button" id="exportTable" class="btn btn-lg btn-success" data-toggle='modal' data-target='#exportExcelModal'>Export to Excel</button>
					<button type="button" id="exportClipboardTable" class="btn btn-lg btn-success" data-toggle='modal' data-target='#exportClipboardModal'>Export to clipboard</button>
				</div>
			</div>
			<br>
			
			
			
			<div class="panel panel-primary">
				<div class="panel-heading" style="font-size: 25px; text-align: center; padding: 5px;">
					Calcul historic
				</div>
				
				<div class="panel-body">
					<div class="row">
						<div class="table-responsive col-lg-12">
							<div class="tool sort ascSort"></div>
						
							<div class="col-lg-4" style="float: right;">
								<select class="form-control sortSelect" style="float: right;">
									<option value="Calcul.Cube.Application">Application</option>
									<option value="Launcher.Login">User</option>
									<option value="Calcul.Name">Calculation</option>
									<option value="Parameters">Parameters</option>
									<option value="DateBegin">Date begin</option>
									<option value="TimeBegin">Time begin</option>
									<option value="DateEnd">Date end</option>
									<option value="TimeEnd">Time end</option>
									<option value="Duration">Duration</option>
									<option value="State">Status</option>
								</select>
							</div>
							
							<div style="clear: both; margin-bottom: 10px;"></div>
							
							<table id="usersMaskTable" class="table table-bordered">
								<thead>
									<tr>
										<th><span class="Calcul.Cube.Application">Application</span><div class="tool filter"></div></th>
										<th><span class="Launcher.Login">User</span><div class="tool filter"></div></th>
										<th><span class="Calcul.Name">Calculation</span><div class="tool filter"></div></th>
										<th><span class="Parameters">Parameters</span><div class="tool filter"></div></th>
										<th><span class="DateBegin">Date begin</span><div class="tool filter"></div></th>
										<th><span class="TimeBegin">Time begin</span><div class="tool filter"></div></th>
										<th><span class="DateEnd">Date end</span><div class="tool filter"></div></th>
										<th><span class="TimeEnd">Time end</span><div class="tool filter"></div></th>
										<th><span class="Duration">Duration</span><div class="tool filter"></div></th>
										<th><span class="State">Status</span><div class="tool filter"></div></th>
									</tr>
								</thead>
								<tbody>
									
								</tbody>
							</table>
						</div>
					</div>
>>>>>>> origin/master
				</div>
			</div>
		</div>
		
		<%@ include file="../../template/footer.jsp" %>
	</div>
	
</body>
</html>