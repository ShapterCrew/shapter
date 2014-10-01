angular.module('shapter.confirmationSent', [
  'security',
  'ui.router'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'confirmation sent', {
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

.controller('ConfirmationSentCtrl', ['$scope', 'AppText', 'security', function( $scope, AppText, security ){
  console.log( "confirmation sent" );
  security.requestCurrentUser();
  $scope.AppText = AppText;
}]);

