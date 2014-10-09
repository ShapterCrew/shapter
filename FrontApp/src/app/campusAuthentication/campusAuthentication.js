angular.module( 'shapter.campusAuthentication', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'resources.user'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'campusAuthentication', {
    url: '/campusAuthentication',
    views: {
      "main": {
        controller: 'CampusAuthenticationCtrl',
        templateUrl: 'campusAuthentication/campusAuthentication.tpl.html'
      }
    },
    data:{ pageTitle: 'Identification comme étudiant' }
  }).state( 'schoolCampusAuthentication', {
    url: '/schools/:schoolId/campusAuthentication',
    views: {
      "main": {
        controller: 'CampusAuthenticationCtrl',
        templateUrl: 'campusAuthentication/campusAuthentication.tpl.html'
      }
    },
    data:{ pageTitle: 'Identification comme étudiant' }
  });
}])


.controller("CampusAuthenticationCtrl", ['$scope', 'School', '$location', 'User', 'Analytics', '$stateParams', function( $scope, School, $location, User, Analytics, $stateParams ){

  Analytics.campusAuthorizationModule();
  School.index().then( function( response ){
    $scope.schools = response.schools;
  });

  $scope.newAuthorization = {
    password: ''
  };
  $scope.clearAlerts = function(){
    $scope.alerts = [];
  };
  $scope.clearAlerts();


  $scope.submitAuthorization = function(){
    User.confirm_student_email( $scope.newAuthorization.email, $scope.newAuthorization.password ).then( function( response ){
      $scope.clearAlerts();
      if( response.status == 'changed' ){
        $window.location.href = "/api/v1/users/auth/facebook";
        Analytics.facebookChanged();
      }
      if( response.status == 'sent confirmation email' ){
        $scope.alerts.push({
          msg: {
            fr: "Wouhou, un message de confirmation vient de t'être envoyé :-) Clique dessus et enjoy Shapter !",
            en: "Yeah, a confirmation email has been sent to you. Please click on it to enjoy Shapter !"
          },
          type: "info"
        });
        Analytics.facebookAuthConfirmSent();
        Analytics.confirmationMailSent( 'facebook' );
      }
      Analytics.facebookAddAuth();
      $scope.newAuthorization = {};
    }, function( error ){
      $scope.clearAlerts();
      if( error.data.error == 'unrecognized student email format' ){
        $scope.alerts.push({
          msg: {
            fr: "Désolé, ton email ne nous permet pas de confirmer que tu es étudiant dans une école membre du réseau Shapter. Essaie avec l'email fourni par ton établissement ou avec l'email d'invitation que tu as reçu le cas échéant",
            en: "Sorry, your email doesn't authenticates you as a student in one of our schools. Try with your student email maybe ?"
          },
          type: "danger"
        });
        Analytics.facebookAuthUnrecognized();
      }
      else if ( error.data.error =='existing account,please provide a password'){
        $scope.displayPassword = true;
        $scope.alerts.push({
          msg: { 
            fr: "Super, on a trouvé ton compte ! Renseigne ton mot de passe pour t'identifier :-)",
            en: "We found your account ! Please enter your password for identification"
          },
          type: "info"
        });
        Analytics.facebookAuthPasswordPlease();
      }
      else if ( error.data.error == 'current account is valid and won\'t be deleted'){
        $scope.alerts.push({
          msg: {
            fr: "Une erreur technique est survenue :/ contacte teamshapter@gmail.com !",
            en: "There was a technical problem. Please contact us at teamshapter@shapter.com"
          },
          type: "danger"
        });
        Analytics.facebookAuthAccountExisting();
      }
      else if ( error.data.error == 'wrong email/password combination'){
        $scope.displayMeme = true;
        $scope.alerts.push({
          msg: {
            fr: "Mauvaise combinaison email password !",
            en: "Wrong email / password conbination"
          },
          type: "danger"
        });
        Analytics.facebookAuthWrongCombinaison();
      }
    });
  };

  $scope.thisSchoolNav = function( school ){
    $location.path("/schools/" + school.id);
  };

}])


.controller( 'CampusAuthenticationOld', [ '$scope', 'User', 'security', '$window', 'Analytics', function( $scope, User, security, $window, Analytics ){
  $scope.security = security;
  $scope.newInstitution = {};
  $scope.alerts = [];
  $scope.clearAlerts = function(){
    $scope.alerts = [];
  };

  User.getFacebookFriends().then( function( response ){
    $scope.friends = response.friends;
  });

  $scope.addAutorization = function(){
    $scope.displayMeme = false;
    User.confirm_student_email( $scope.newInstitution.email, $scope.newInstitution.password ).then( function( response ){
      $scope.clearAlerts();
      if( response.status == 'changed' ){
        $window.location.href = "/api/v1/users/auth/facebook";
        Analytics.facebookChanged();
      }
      if( response.status == 'sent confirmation email' ){
        $scope.alerts.push({
          msg: {
            fr: "Wouhou, un message de confirmation vient de t'être envoyé :-) Clique dessus et enjoy Shapter !",
            en: "Yeaaah, a confirmation email has been sent to you. Please click on it to enjoy Shapter !"
          },
          type: "success"
        });
        Analytics.facebookAuthConfirmSent();
        Analytics.confirmationMailSent( 'facebook' );
      }
      Analytics.facebookAddAuth();
    }, function( error ){
      $scope.clearAlerts();
      if( error.data.error == 'unrecognized student email format' ){
        $scope.alerts.push({
          msg: {
            fr: "Désolé, ton email ne nous permet pas de confirmer que tu es étudiant dans une école membre du réseau Shapter. Essaie avec l'email fourni par ton établissement ou avec l'email d'invitation que tu as reçu le cas échéant",
            en: "Sorry, your email doesn't authenticates you as a student in one of our schools. Try with your student email maybe ?"
          },
          type: "warning"
        });
        Analytics.facebookAuthUnrecognized();
      }
      else if ( error.data.error =='existing account,please provide a password'){
        $scope.displayPassword = true;
        $scope.alerts.push({
          msg: { 
            fr: "Super, on a trouvé ton compte ! Renseigne ton mot de passe pour t'identifier :-)",
            en: "We found your account ! Please enter your password for identification"
          },
          type: "info"
        });
        Analytics.facebookAuthPasswordPlease();
      }
      else if ( error.data.error == 'current account is valid and won\'t be deleted'){
        $scope.alerts.push({
          msg: {
            fr: "Une erreur technique est survenue :/ contacte teamshapter@gmail.com !",
            en: "There was a technical problem. Please contact us at teamshapter@shapter.com"
          },
          type: "danger"
        });
        Analytics.facebookAuthAccountExisting();
      }
      else if ( error.data.error == 'wrong email/password combination'){
        $scope.displayMeme = true;
        $scope.alerts.push({
          msg: {
            fr: "Mauvaise combinaison email password !",
            en: "Wrong email / password conbination"
          },
          type: "danger"
        });
        Analytics.facebookAuthWrongCombinaison();
      }
    });
  };

  Analytics.facebookAuthModule();
}])

.filter( 'confirmedFacebookFriends', [function(){
  return function( friends ){
    var out = [];
    angular.forEach( friends, function( friend ){
      if( friend.confirmed_student === true && friend.is_fb_friend === true ){
        out.push( friend );
      }
    });
    return out;
  };
}]);
