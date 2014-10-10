// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
  'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
  'security.login',         // Contains the login form template and controller
  'security.signup',
  'security.forgotPassword',
  'services.localizedMessages'
])

.factory('security', ['Analytics', '$http', '$q', '$location', 'securityRetryQueue', '$modal', 'Restangular', 'alerts', '$rootScope', 'localizedMessages', 'Behave', function( Analytics, $http, $q, $location, queue, $modal, Restangular, alerts, $rootScope, localizedMessages, Behave ) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    var string = "";

    console.log('current user:');
    console.log( service.currentUser );
    if( !!service.isConfirmedStudent() ){

      var schoolId = service.currentUser.schools[0].id;
      // if first connexion
      if( ( service.currentUser.provider == 'facebook' && service.currentUser.sign_in_count < 2 ) || ( service.currentUser.provider != 'facebook' && service.currentUser.sign_in_count < 3) ){
        string = "/schools/" + schoolId + '/signupFunnel';
      }
      // else
      else{
        string = "/schools/" + schoolId ;
      }
    }

    // has no school but has a confirmed email
    else if ( service.isConfirmedUser() ) {
      // if first connexion
      if( ( service.currentUser.provider == 'facebook' && service.currentUser.sign_in_count < 2 ) || ( service.currentUser.provider != 'facebook' && service.currentUser.sign_in_count < 3) ){
        string = "/campusAuthentication";
      }
      // else
      else {
        string = "/schools";
      }
    }

    else if ( !!service.isAuthenticated() && !service.isConfirmedUser() ){
      string = "/confirmationSent";
    }

    url = url || string;
    $location.path(url);
  }

  // Login form dialog stuff
  var loginModal = null;
  function openLoginModal( reason, access ) {
    if ( loginModal ) {
      throw new Error('Trying to open a modal that is already open!');
    }
    loginModal = $modal.open({
      templateUrl: 'security/emailLogin/emailLogin.tpl.html',
      controller : 'EmailLoginCtrl',
      windowClass : 'show',
      resolve: {
        reason: function(){
          return reason;
        }
      }
    });

    loginModal.result.then(function(success){
      console.log( 'close success' );
      onLoginModalClose(success, access);
    }, function(error){
      console.log( 'close error' );
      loginModal = null;
      queue.cancelAll();
      //redirect();
    });
  }

  function closeEmailLoginModal(success) {
    if (loginModal) {
      loginModal.close(success);
    }
  }

  function onLoginModalClose(success, access) {
    console.log( 'on login modal close' );
    loginModal = null;
    if ( success ) {
      console.log( "retrying queue" );
      $rootScope.$broadcast('login success');
      //queue.retryAll();
      if( !!access ){
        console.log( access );
        redirect( access );
      }
    } else {
      console.log( "canceling queue" );
      queue.cancelAll();
      //redirect();
    }
  }

  // forgot password dialog stuff
  var forgotPasswordModal = null;
  function openForgotPasswordModal () {
    if ( forgotPasswordModal ) {
      throw new Error('Trying to open a modal that is already open!');
    }
    forgotPasswordModal = $modal.open({
      templateUrl: 'security/forgotPassword/forgotPassword.tpl.html',
      controller : 'ForgotPasswordFormController',
      windowClass : 'show'
    });

    forgotPasswordModal.result.then(function(success){
      onForgotPasswordModalClose(success);
    }, function(error){
      forgotPasswordModal = null;
      queue.cancelAll();
      //redirect();
    });
  }

  function closeForgotPasswordModal(success) {
    if (forgotPasswordModal) {
      forgotPasswordModal.close(success);
    }
  }

  function onForgotPasswordModalClose(success) {
    forgotPasswordModal = null;
    if ( success ) {
      //queue.retryAll();
    } else {
      queue.cancelAll();
    }
  }


  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {

    redirect: redirect,

    isLoginModalOpen: function(){
      return !!loginModal;
    },

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function( reason, access ) {
      console.log( 'show login' );
      console.log( access );
      openLoginModal( reason, access );
      Analytics.showLogin();
    },

    // Attempt to authenticate a user by the given email and password
    login: function(email, password) {
      var user = {email: email, password: password};
      return Restangular.all('users').all('sign_in').post({user: user}).then(function(response) {
        return Restangular.one('users', 'me').customPOST({
          entities: {
            user: {
              admin: true,
              email: true,
              comments: false,
              comments_count: true,
              comments_dislikes_count: true,
              comments_likes_count: true,
              confirmed: true,
              confirmed_student: true,
              diagrams_count: true,
              firstname: true,
              image: false,
              is_fb_friend: true,
              items_count: true,
              lastname: true,
              provider: true,
              schools: true,
              sign_in_count: true,
              user_diagram: false
            },
            tag: {
              name: true
            }
          }
        }).then( function( response ){
          behave.identify(response.id, {name: response.firstname + " " + response.lastname});
          //Behave.identify(response);
          alerts.clear();

          service.currentUser = response;

          // has at least one school
          if( service.isConfirmedStudent() ){
            closeEmailLoginModal(true);
            if( !queue.hasMore()){
              //redirect();
            }
            Analytics.identify( response );
            Analytics.loginSuccess( response );
            return {success: true};
          }

          // has no school but has a confirmed email
          else if ( service.isConfirmedUser() ) {
            closeEmailLoginModal(true);
            if( !queue.hasMore()){
              //redirect();
            }
            Analytics.identify( response );
            Analytics.loginSuccess( response );
            return {success: true};
          }

          // has an account but email not confirmed
          else if ( service.isAuthenticated() && !service.isConfirmedUser() ) {
            closeEmailLoginModal(true);
            /*
            alerts.add("danger", {
              fr: "Tu dois confirmer ton adresse : un mail t'a été envoyé, clique sur le lien d'activation qu'il contient !",
              en: "Sorry, you need to activate your account first. An activation email has been sent to you : click on the activation link it contains."
            });
            */
            return {success: true};
          }

          // has no account
          else {
            return {success: false};
          }
        }, function(x) {
          alerts.clear();
          if (angular.isDefined(x.data.error)) {
            alerts.add("danger", {
              fr: "Quelque chose ne s'est pas bien passé :-/",
              en: "Sorry, something went wrong"
            });
          }
        });
      }, function(x) {
        alerts.clear();
        if (angular.isDefined(x.data.error)) {
          alerts.add("danger", {
            fr: "Mauvaise combinaison email/mot de passe. Pour créer un nouveau compte, clique en bas sur \"créér un compte\" !",
            en: "Wrong password / login combination. To create a new account, click on \"create account\" below!"
          });
        }
      });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      closeEmailLoginModal(false);
      Analytics.cancelLogin();
      //redirect();
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      return Restangular.all('users').customGET('sign_out').then(function() {
        $rootScope.$broadcast('logout');
        alerts.clear();
        alerts.add("success", {
          fr: "Tu as bien été déconnecté !",
          en: "You have been correctly disconnected !"
        });
        service.currentUser = null;
        Analytics.logout();
        //redirect(redirectTo);
      });
    },

    //Attempts to signup user
    signup: function(email, password, firstname, lastname){
      var user = {
        email: email,
        password: password,
        password_confirmation: password,
        firstname: firstname,
        lastname: lastname
      };
      return Restangular.all('users').post({user: user}).then(function(response) {
        service.currentUser = response;
        alerts.clear();

        try {
          Analytics.identify( response );
        }
        catch( err ){
          console.log( err );
        }

        Analytics.signupSuccess();
        Analytics.confirmationMailSent( 'email' );


        closeEmailLoginModal(true);
        redirect('/confirmationSent');

        return {success: true};
      }, function(x) {
        angular.forEach(x["data"]["errors"], function(value, key) {
          alerts.clear();
          var error = "";
          if (key == "email") {
            error = {
              fr: "L'email est invalide.",
              en: "Invalid email"
            };
          }
          else if (key == "base") {
            error = {
              fr: "Ton email doit être celui donné par ton BDE ou par ton établissement ! Contacte nous à teamshapter@gmail.com si tu ne sais pas lequel c'est.",
              en: "The email should be the one provided by your campus"
            };
          }
          else if (key == "password") {
            error = {
              fr: "Le mot de passe est trop court : 4 caractères minimum !",
              en: "Password is too short. 4 characters min."
            };
          }
          else {
            error = key + ": " + value;
          }
          alerts.add("danger", { 
            en: 'error'
          });
        });
      });
    },

    //Activate the user
    activateUser: function(activationToken) {
      return Restangular.all('users')
      .customGET('confirmation', {"confirmation_token": activationToken})
      .then(function(response) {
        console.log( 'confirmation success' );
        console.log( response );
        redirect("/start");
        alerts.clear();
        alerts.add("success", {
          fr: "Ton adresse mail est bien confirmée ! Enjoy :)",
          en: "Your email has been confirmed. Enjoy Shapter !"
        });
      }, function(error) {
        console.log( 'confirmation error' );
        alerts.clear();
        alerts.add("danger", {
          fr:  "La confirmation de ton adresse mail a échoué. Si l'erreur persiste, contacte-nous par mail à teamshapter@gmail.com.",
          en: "Confirmation of your email has failed. If the problem persists, please contact us at teamshapter@shapter.com"
        });
        redirect("/start");
      });
    },

    // open forgot password modal
    showForgotPassword: function(){
      Analytics.forgotPassword();
      alerts.clear();
      openForgotPasswordModal();
      //  closeEmailLoginModal();
    },

    cancelForgotPassword: function(){
      Analytics.cancelForgotPassword();
      closeForgotPasswordModal(false);
    },

    closeForgotPasswordModalService: function(){
      closeForgotPasswordModal(true);
    },

    // Attempt to change password
    forgotPassword: function(email){
      return Restangular.all('users').all("password").post({user: {email:email}}).then(function(response) {
        alerts.clear();
        alerts.add("success", localizedMessages.post('forgotPassword.sent.success'));
        Analytics.successChangePassword();
        service.closeForgotPasswordModalService();
        return response;
      }, function(x) {
        alerts.clear();
        var error = "";
        angular.forEach(x["data"]["errors"], function(value, key) {
          error = "";
          if (key == "email") {
            error = localizedMessages.get('forgotPassword.sent.error');
          }
          else {
            error = localizedMessages.get('forgotPassword.error');
          }
          alerts.add("error", {
            en: error
          });
          return {success: false};
        });
      });
    },

    changePassword: function(password, token){
      return Restangular.all('users').customPUT({user: {password:password, password_confirmation:password, reset_password_token:token}}, "password", {}, {}).then(function(response) {
        alerts.clear();
        alerts.add("success", localizedMessages.get('forgotPassword.success'));
        //redirect();
        return response;
      }, function(x) {
        alerts.clear();
        var error = "";
        angular.forEach(x["data"]["errors"], function(value, key) {
          error = "";
          if (key == "reset_password_token") {
            error = localizedMessages.get('forgotPassword.wrongToken');
          }
          else {
            error = localizedMessages.get('forgotPassword.error');
          }
          alerts.add("error", {
            en: error
          });
          return {success: false};
        });
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser).then(function( response ){
          try {
          behave.identify(service.currentUser.id, {name: service.currentUser.firstname + " " + service.currentUser.lastname});
          }
          catch( err ){
            console.log( 'behave error' );
            console.log( err );
          }
          //Behave.identify(service.currentUser);
          Analytics.identify( service.currentUser );
        });
      } 
      else {
        var params = {
          entities: {
            user: {
              "admin": true,
              "email": true,
              "comments": false,
              "comments_count": true,
              "comments_dislikes_count": true,
              "comments_likes_count": true,
              "confirmed": true,
              "confirmed_student": true,
              "diagrams_count": true,
              "firstname": true,
              "image": false,
              "is_fb_friend": true,
              "items_count": true,
              "lastname": true,
              "provider": true,
              "schools": true,
              "sign_in_count": true,
              "user_diagram": false
            },
            tag: {
              name: true
            }
          }
        };

        return Restangular.all('users').customPOST(params, 'me' ).then(function(response) {
          try {
            behave.identify(response.id, {name: response.firstname + " " + response.lastname});
          }
          catch( err ){
            console.log( 'behave error' );
            console.log( err );
          }

          service.currentUser = response;

          Analytics.identify(response);
          return service.currentUser;
        },
        function(error) {
          //redirect();
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Message for scope
    message: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },

    hasTestSchool: function(){
      var nameInSchools = function( name ){
        return service.currentUser.schools.map( function( school ){
          return school.name == name;
        }).reduce( function( oldVal, newVal ){
          return oldVal || newVal;
        }, false);
      };
      var list = [ 'ENSMA', 'Dauphine' ];
      return list.map( function( school ){
        return nameInSchools( school );
      }).reduce( function( oldVal, newVal ){
        return oldVal || newVal;
      }, false);
    },

    isConfirmedUser: function(){
      return !!(service.currentUser && service.currentUser.confirmed);
    },

    // Is the current user an administrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    },

    // Is the current user a confirmed student ?
    isConfirmedStudent: function(){
      return !!(service.currentUser && service.currentUser.confirmed_student && service.currentUser.schools.length);
    }
  };

  return service;
}]);
