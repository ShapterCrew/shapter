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

.controller('ConfirmationSentCtrl', ['$scope', 'AppText', 'security', function( $scope, AppText, security ){
  console.log( "confirmation sent" );
  security.requestCurrentUser().then( function( response ){
    if( security.isConfirmedUser()){
      security.redirect();
    }
  });
  $scope.AppText = AppText;
}]);

