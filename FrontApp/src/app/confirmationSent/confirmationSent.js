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

.controller('ConfirmationSentCtrl', ['$scope', 'AppText', 'security', 'User', function( $scope, AppText, security, User ){
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

.controller('NewConfirmationCtrl', ['$scope', 'User', 'security', function( $scope, User, security){
  $scope.newConfirmationEmail = function(){
    User.newConfirmationEmail( security.currentUser.email ).then( function( response ){
      $scope.successResent = true;
      $scope.failRessent = false;
    }, function( err ){
      $scope.failRessent = true;
      $scope.successResent = false;
    });
  };
}]);

