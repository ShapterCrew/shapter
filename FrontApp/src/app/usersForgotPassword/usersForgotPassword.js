angular.module('shapter.usersForgotPassword', [])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'usersForgotPassword', {
    url: '/users/password/edit',
    views: {
      "main": {
        controller: 'UsersForgotPasswordCtrl',
        templateUrl: 'usersForgotPassword/usersForgotPassword.tpl.html',
        title: "Changement de mot de passe"
      }
    },
    data:{ pageTitle: "UsersForgotPassword" }
  });
})

.controller('UsersForgotPasswordCtrl', ['$scope', '$location', 'security', 'alerts', 'AppText', function($scope, $location, security, alerts, AppText){
  $scope.AppText = AppText;
  var resetPasswordToken = $location.search().reset_password_token;
  if (!resetPasswordToken) {
    alerts.clear();
    alerts.add("error", "Le changement de mot de passe a échoué. N'hésite pas à nous contacter à teamshapter@gmail.com si le problème persiste.");
    $location.url("/start");
  }

  $scope.changePassword = function() {
    security.changePassword($scope.password, resetPasswordToken);
  };

  $scope.cancelChangePassword = function() {
    $location.url("/start");
  };

}]);

