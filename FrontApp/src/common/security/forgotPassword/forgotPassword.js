angular.module('security.forgotPassword', ['services.localizedMessages'])

.controller('ForgotPasswordFormController', ['$scope', 'security', 'localizedMessages', 'alerts', function($scope, security, localizedMessages, alerts) {

  $scope.user = {};

  security.message = null;

  $scope.forgotPassword = function(){
    alerts.add("warning", localizedMessages.get('forgotPassword.emailWaiting'));
    security.forgotPassword($scope.user.email);
  };

  $scope.cancelForgotPassword = function(){
    security.cancelForgotPassword();
  };

}]);

