$(document).ready(function(){

      //$( ":contains('Administration')" ).addClass('active'); // pour colorer l'entrée menu

      $('.nav.navbar-nav > li').on('click', function (e) {
          e.preventDefault();
          $('.nav.navbar-nav > li').removeClass('active');
          $(this).addClass('active');
      });

      var u = utility(),
          selectors = {
      
              formulaire  : {
                          addUserForm    : {
                              name : '#addUserForm',
                              inputs : {
                                  login     : '#inputLoginAdd',
                                  profile   : '#selectProfileAdd',
                                  name      : '#inputNameAdd',
                                  firstname : '#inputFirstNameAdd',
                                  mail      : '#inputEmailAdd',
                                  phone     : '#inputPhoneAdd',
                              },
                              button : '#addButton'

                          },
                          lookForUserForm : {
                              name : '#lookForUserForm',
                              inputs : {
                                  loginToModify : '#inputLoginLook'
                              },
                              loader : '#loader'                         
                          },
                          modifyUserForm  : {
                             name : '#modifyUserForm',
                              inputs : {
                                  login         : '#inputLoginModify',
                                  profile       : '#selectProfileModify',
                                  name          : '#inputNameModify',
                                  firstname     : '#inputFirstNameModify',
                                  mail          : '#inputEmailModify',
                                  phone         : '#inputPhoneModify'
                              },
                              button : '#modifyButton'
                          },
                          deleteUserForm : {
                             name : '#deleteUserForm',
                              inputs : {
                                  login     : '#inputLoginDelete'
                              },
                              button : '#deleteButton'
                          }
              },
              tabs  : {
                  addUser     : '#addUser',
                  modifyUser  : '#modifyUser',
                  deleteUser  : '#deleteUser'
              }
    
      },
      addUserForm = function (sel) {

        		return {
        			selectors : sel.formulaire.addUserForm,
        			getUser   : function (){
        							
        							return {
        								login     : $.trim($(this.selectors.inputs.login).val()),
                        profile   : $.trim($(this.selectors.inputs.profile).val()),
        								name      : $.trim($(this.selectors.inputs.name).val()),
        								firstname : $.trim($(this.selectors.inputs.firstname).val()),
        								mail      : $.trim($(this.selectors.inputs.mail).val()),
        								phone     : $.trim($(this.selectors.inputs.phone).val())
        							};
        			}
        		};

		  },
      lookForUserForm = function ( sel ) {

          return {
              selectors : sel.formulaire.lookForUserForm,
              userToModify : '',
              getUser : function () {

                  return {
                      loginToModify : $.trim($(this.selectors.inputs.loginToModify).val())
                  };
              }
          };

      },
      modifyUserForm = function (sel) {
          return {
              selectors : sel.formulaire.modifyUserForm,
              show : function () {
                  $(this.selectors.name).removeClass('hide').addClass('show');
              },
              hide : function () {
                  $(this.selectors.name).removeClass('show').addClass('hide');
              },
              getUserModified : function (userToModify) {
                  return {
                        loginToModify : userToModify,
                        login     : $.trim($(this.selectors.inputs.login).val()),
                        profile   : $.trim($(this.selectors.inputs.profile).val()),
                        name      : $.trim($(this.selectors.inputs.name).val()),
                        firstname : $.trim($(this.selectors.inputs.firstname).val()),
                        mail      : $.trim($(this.selectors.inputs.mail).val()),
                        phone     : $.trim($(this.selectors.inputs.phone).val())
                  };
              }
          };
      },
      deleteUserForm = function (sel) {

            return {
              selectors : sel.formulaire.deleteUserForm,
              getLogin   : function (){
                      
                      return {
                        login     : $.trim($(this.selectors.inputs.login).val()),
                      };
              }
            };

      }, 
      usersLogins = [],
		  addUser = addUserForm(selectors),
      lookForUser = lookForUserForm(selectors),
      modifyUser = modifyUserForm(selectors),
      deleteUser = deleteUserForm(selectors);

      function notify(message,type)
      {
          var n = noty({
              text        : message,
              type        : type,
              dismissQueue: true,
              timeout     : 5000,
              layout      : 'bottomCenter',
              theme       : 'bootstrapTheme',
              closeWith   : ['button', 'click'],
              maxVisible  : 20,
              modal       : false
          });
      }

  


   $.ajax({
        url: 'gestionUtilisateur?action=getUsersLogins',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
        beforeSend: function()
        {
        	if(typeof(busyIndicatorBeforeSend) == "function")
        		busyIndicatorBeforeSend();
        },
        complete: function()
        {
        	if(typeof(busyIndicatorOnComplete) == "function")
        		busyIndicatorOnComplete();
        },
        success: function (data) {

            if(data.usersLogins) {
                usersLogins = data.usersLogins;
                $(deleteUser.selectors.inputs.login).autocomplete({source : data.usersLogins, messages: { noResults: '', results: function() {} }  });
                $(lookForUser.selectors.inputs.loginToModify).autocomplete({source : data.usersLogins , messages: { noResults: '', results: function() {} }});
            }
            

        },
        error:function(data,status,er) {

            u.notify({
              message : data.message,
              type    : 'success'
            });
        }
    });

	$("#myTab a").click(function(e){
    	e.preventDefault();
    	var tab = $(this).attr('href');

      switch(tab)
      {
        case '#addUser'    : $('#addUser').addClass('active');
                             $('#modifyUser').removeClass('active');
                             $('#deleteUser').removeClass('active');
                             break;

        case '#modifyUser' : $('#modifyUser').addClass('active');
                             $('#addUser').removeClass('active');
                             $('#deleteUser').removeClass('active');
                             break;

        case '#deleteUser' : $('#deleteUser').addClass('active');
                             $('#addUser').removeClass('active');
                             $('#modifyUser').removeClass('active');
                             break;
      }

      $( ":contains('Administration')" ).addClass('active');

    });

	$(addUser.selectors.button).click(function( event ){

    var login = $(addUser.selectors.inputs.login).val();

		$.ajax({
			  url: 'gestionUtilisateur?action=add',
              type: 'POST',
              dataType: 'json',
              data: JSON.stringify(addUser.getUser()), // voir si on ne devrait pas crypter les mdp dès là
              contentType: 'application/json; charset=UTF-8',
              mimeType: 'application/json',
              beforeSend: function()
              {
              	if(typeof(busyIndicatorBeforeSend) == "function")
              		busyIndicatorBeforeSend();
              },
              complete: function()
              {
              	if(typeof(busyIndicatorOnComplete) == "function")
              		busyIndicatorOnComplete();
              },
              success: function (data) {
            	               if(data.message) {
            	  		             
                                 notify(data.message,'success');

                                 usersLogins.push(login);

                                 $(lookForUser.selectors.inputs.loginToModify).autocomplete("destroy");
                                 $(deleteUser.selectors.inputs.login).autocomplete("destroy");

                                 $(lookForUser.selectors.inputs.loginToModify).autocomplete({source : usersLogins , messages: { noResults: '', results: function() {} } });
                                 $(deleteUser.selectors.inputs.login).autocomplete({source : usersLogins , messages: { noResults: '', results: function() {} } });

            	  				
            	  			        } else {
            	  				           
                                  // astuce parce que bizarrement impossible de lire le JSONUserForm dans l'objet métier du formulaire(côté java , oui oddly )
                                  notify(data.erreur.replace('_',$(addUser.selectors.inputs.login).val()),'error');
                     
            	  			        }
              },
              error:function(data,status,er) {
                

              }
		});


	});

  $(deleteUser.selectors.button).click(function( event ){

    var login = $(deleteUser.selectors.inputs.login).val();

        $.ajax({
          url: 'gestionUtilisateur?action=delete',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(deleteUser.getLogin()), // voir si on ne devrait pas crypter les mdp dès là
                contentType: 'application/json; charset=UTF-8',
                mimeType: 'application/json',
                beforeSend: function()
                {
                	if(typeof(busyIndicatorBeforeSend) == "function")
                		busyIndicatorBeforeSend();
                },
                complete: function()
                {
                	if(typeof(busyIndicatorOnComplete) == "function")
                		busyIndicatorOnComplete();
                },
                success: function (data) {
                    if(data.message) {
                        
                        usersLogins.splice(usersLogins.indexOf(login),1);

                        $(lookForUser.selectors.inputs.loginToModify).autocomplete("destroy");
                        $(deleteUser.selectors.inputs.login).autocomplete("destroy");

                        $(lookForUser.selectors.inputs.loginToModify).autocomplete({source : usersLogins , messages: { noResults: '', results: function() {} } });
                        $(deleteUser.selectors.inputs.login).autocomplete({source : usersLogins , messages: { noResults: '', results: function() {} } });

                        notify(data.message,'success');
                        

                      } else {

                        notify(data.erreur,'error');

                     }
                },
                error:function(data,status,er) {
                  

                }
        });
  });

  $(lookForUser.selectors.name).keypress(function( event ){
    return(event.which !== 13);
  });

  $(lookForUser.selectors.inputs.loginToModify).keyup(function(event) {
    if(event.which === 13 && !$( modifyUser.selectors.name ).is( ":visible" ) ) {

        lookForUser.userToModify = $.trim($(lookForUser.selectors.inputs.loginToModify).val());

        $.ajax({
          url: 'gestionUtilisateur?action=isUser',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(lookForUser.getUser()), // voir si on ne devrait pas crypter les mdp dès là
                contentType: 'application/json; charset=UTF-8',
                mimeType: 'application/json',
                beforeSend: function()
                {
                	if(typeof(busyIndicatorBeforeSend) == "function")
                		busyIndicatorBeforeSend();
                },
                complete: function()
                {
                	if(typeof(busyIndicatorOnComplete) == "function")
                		busyIndicatorOnComplete();
                },
                success: function (data) {

                    $(lookForUser.selectors.loader).html('');

                    $(modifyUser.selectors.inputs.login).val('');
                    $(modifyUser.selectors.inputs.profile + ' option[value*="none"]').prop('selected', true);
                    $(modifyUser.selectors.inputs.name).val('');
                    $(modifyUser.selectors.inputs.firstname).val('');
                    $(modifyUser.selectors.inputs.mail).val('');
                    $(modifyUser.selectors.inputs.phone).val('');

                    if(data.message === 'OK')
                    {
                      console.log("phone" + data.phone);

                      $(modifyUser.selectors.inputs.login).val(data.login);
                      $(modifyUser.selectors.inputs.profile + ' option[value*="'+data.profile+'"').prop('selected', true);
                      $(modifyUser.selectors.inputs.name).val(data.name);
                      $(modifyUser.selectors.inputs.firstname).val(data.firstname);
                      $(modifyUser.selectors.inputs.mail).val(data.mail);
                      $(modifyUser.selectors.inputs.phone).val(data.phone);
                      modifyUser.show();

                    } else {

                        lookForUser.userToModify = '';

                        notify(data.erreur,'error');

                    }
                },
                error:function(data,status,er) {
                  

                }
        });

        
        $(lookForUser.selectors.loader).html('<img src="../img/ajax-loader.gif" />');
      }
  });
  
  $(modifyUser.selectors.button).click(function( event ){
       $.ajax({
          url: 'gestionUtilisateur?action=modify',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(modifyUser.getUserModified(lookForUser.userToModify)), // voir si on ne devrait pas crypter les mdp dès là
                contentType: 'application/json; charset=UTF-8',
                mimeType: 'application/json',
                beforeSend: function()
                {
                	if(typeof(busyIndicatorBeforeSend) == "function")
                		busyIndicatorBeforeSend();
                },
                complete: function()
                {
                	if(typeof(busyIndicatorOnComplete) == "function")
                		busyIndicatorOnComplete();
                },
                success: function (data) {

                    modifyUser.hide();

                    if(data.message) {

                        if(data.loginModified) {

                            usersLogins.splice(usersLogins.indexOf(data.loginOriginal),1);
                            usersLogins.push(data.loginModified);

                            $(lookForUser.selectors.inputs.loginToModify).autocomplete("destroy");
                            $(deleteUser.selectors.inputs.login).autocomplete("destroy");

                            $(lookForUser.selectors.inputs.loginToModify).autocomplete({source : usersLogins , messages: { noResults: '', results: function() {} }});
                            $(deleteUser.selectors.inputs.login).autocomplete({source : usersLogins , messages: { noResults: '', results: function() {} } });
                        }

                        notify(data.message,'success');


                        
                      } else {

                        notify(data.erreur,'error');
                        
                      }
                },
                error:function(data,status,er) {
                  

                }
        });
  });

});