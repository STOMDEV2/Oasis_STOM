const tableVariableLine = 	'<tr>' +
								'<td><span class="variableName"></span></td>' +
								'<td class="selections"></td>' +
								'<td><input type="text" class="udas form-control" /></td>' +
								'<td><i class="fa fa-search fa-2x preview" style="cursor: pointer;"></i></td>' +
							'</tr>';

const calculTemplate = 	'<div class="listContainer">' +
							'<div><button type="button" class="collapseButton btn btn-default btn-xs"></button><span class="treeViewElement"></span></div>' +
							
							'<div class="listContainer collapsed">' +
							'</div>' +
						'</div>';

const scriptTemplate = 	'<div>' +
							'<span class="treeViewElement"></span>' +
						'</div>';

const liTabTemplate = 	'<li role="presentation">' +
							'<a role="tab" data-toggle="tab"></a>' +	//href="#home" aria-controls="home"
						'</li>';

const divTabTemplate = '<div role="tabpanel" class="tab-pane fade" style="background-color: white; padding: 15px; border-radius: 3px; border-style: solid; border-color: rgb(221, 221, 221); border-width: 0px 1px 1px;"></div>'; //id="home"

const tableVariable = 	'<table class="table table-bordered table-hover tableCalculParameter" style="margin-top: 10px;">' +
							'<thead>' +
						        '<tr>' +
						        	'<th>Variable</th>' +
						          	'<th>Selection</th>' +
						          	'<th>UDAs</th>' +
						          	'<th class="col-lg-1">Preview</th>' +
						        '</tr>' +
					      	'</thead>' +
					      	'<tbody>' +
					      		
					      	'</tbody>' +
						'</table>';