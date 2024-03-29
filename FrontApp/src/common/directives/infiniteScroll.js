/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
// refacto !
var mod;

mod = angular.module('sh-infinite-scroll', []);

mod.directive('infiniteScroll', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;

          //          windowBottom = $window.height() + $window.scrollTop();
          //         elementBottom = elem.offset().top + elem.height();
          // remaining = elementBottom - windowBottom;

          remaining = elem[0].scrollHeight - elem[0].clientWidth - elem[0].scrollTop;
          shouldScroll = remaining <= elem[0].clientWidth * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };

        elem.bind('scroll', handler);

        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout(function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }, 0);
      }
    };
}]);
