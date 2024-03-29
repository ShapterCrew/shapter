angular.module('shapter.confirmationSent', [
  'security',
  'ui.router'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'confirmation sent in school', {
    url: '/schools/:schoolId/confirmationSent',
    views: {
      "main": {
        controller: 'ConfirmationSentCtrl',
        templateUrl: 'confirmationSent/confirmationSent.tpl.html',
        title: 'A confirmation email has been sent to you'
      }
    },
    data:{ pageTitle: 'Accueil' }
  }).state( 'confirmation sent', {
    url: '/confirmationSent',
    views: {
      "main": {
        controller: 'ConfirmationSentCtrl',
        templateUrl: 'confirmationSent/confirmationSent.tpl.html',
        title: 'A confirmation email has been sent to you'
      }
    },
    data:{ pageTitle: 'Accueil' }
  });
}])

.controller('ConfirmationSentCtrl', ['$scope', 'AppText', 'security', 'User', '$location', function( $scope, AppText, security, User, $location ){
  if( !security.isAuthenticated()) {
    $location.path( '/start' );
  }
  $scope.$on('logout', function(){
    $location.path("/start");
  });
  security.requestCurrentUser().then( function( response ){
    if( security.isConfirmedUser()){
      security.redirect();
    }
  });
  $scope.AppText = AppText;
}])

.directive('shNewConfirmationEmail', [function(){
  return {
    restrict: 'E',
    controller: 'NewConfirmationCtrl',
    templateUrl: 'confirmationSent/newConfirmationEmail.tpl.html'
  };
}])

.controller('NewConfirmationCtrl', ['$scope', 'User', 'security', 'Analytics', 'AppText', function( $scope, User, security, Analytics, AppText ){
  $scope.newConfirmationEmail = function(){
    User.newConfirmationEmail( security.currentUser.email ).then( function( response ){
      $scope.successResent = true;
      $scope.failRessent = false;
    }, function( err ){
      $scope.failRessent = true;
      $scope.successResent = false;
    });
    Analytics.newConfirmationEmailRequest();
  };
}]);

