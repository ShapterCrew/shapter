angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['security', '$location', function(security, $location) {
  var directive = {
    templateUrl: 'security/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {

      $scope.go = function(){
        $location.url("/browse");
      };

      $scope.isAuthenticated = security.isAuthenticated;

      $scope.login = security.showLogin;
      $scope.logout = security.logout;
      $scope.signup = security.showLogin;

      $scope.$watch(function() {
        return security.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}]);
