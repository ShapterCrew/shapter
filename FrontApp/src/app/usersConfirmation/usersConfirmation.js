angular.module('shapter.usersConfirmation', [])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'usersConfirmation', {
    url: '/users/confirmation',
    views: {
      "main": {
        controller: 'UsersConfirmationCtrl',
        templateUrl: 'usersConfirmation/usersConfirmation.tpl.html',
        title: "Confirmation de l'utilisateur"
      }
    },
    data:{ pageTitle: "UsersConfirmation" }
  });
})

.controller('UsersConfirmationCtrl', ['$scope', '$location', 'security', 'alerts', function($scope, $location, security, alerts){
  activationKey = $location.search().confirmation_token;
  if (!!activationKey) {
    security.activateUser(activationKey);
  }
  else {
    alerts.clear();
    alerts.add("error", "La confirmation de ton adresse mail a échouée. N'hésite pas à nous contacter à teamshapter@gmail.com si le problème persiste.");
    $location.url("/start");
  }

}]);

