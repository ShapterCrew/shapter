angular.module('directives.autoFocus', [])
.directive('shAutoFocus', ['$timeout', '$parse', function($timeout, $parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.shAutoFocus);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
}]);
