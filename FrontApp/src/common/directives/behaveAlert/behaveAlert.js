angular.module('directives.behaveAlert', [])
.factory('BehaveAlertFactory', function($rootScope, $timeout) {
  var behaveAlert = {};
  
  behaveAlert.showMsg = function(msg) {
    $rootScope.behaveAlert = msg;
    $timeout(function() {
      $rootScope.behaveAlert = null;
    }, 5000);
    return true;
  };

  behaveAlert.newBadge = function(badge) {
    $rootScope.newBadge = badge;
    $timeout(function() {
      $rootScope.newBadge = null;
    }, 3000);
  };

  behaveAlert.newLevel = function(level) {
    $rootScope.newLevel = level;
    $timeout(function() {
      $rootScope.newLevel = null;
    }, 3000);
  };

  return behaveAlert;
})

.directive('shBehaveAlert', function(){
  return {
    restrict: 'E',
    scope: {
    },
    controller: 'BehaveAlertCtrl',
    templateUrl: 'directives/behaveAlert/behaveAlert.tpl.html'
  };
})

.controller('BehaveAlertCtrl', function($scope, $rootScope, $timeout, BehaveAlertFactory, security) {
  /* Snippet to test new badge */
  /*
  var user = security.currentUser;
  behave.identify(user.id, {name: user.firstname + " " + user.lastname});
  behave.events.subscribe("player:identified", function(response) {
    behave.player.fetchBadges(function(err, results) {
      $timeout(function() {
        BehaveAlertFactory.newBadge(results[0].badge);
      }, 500);
    });
  });
  */
  behave.events.subscribe('reward:points', function(points) {
    BehaveAlertFactory.showMsg("+" + points.earned + " points !");
  });
  behave.events.subscribe('reward:badge', function(badge) {
    BehaveAlertFactory.newBadge(badge);
  });
  behave.events.subscribe('reward:level', function(level) {
    BehaveAlertFactory.newLevel(level);
  });
  $rootScope.$watch('behaveAlert', function(newValue, oldValue) {
    $scope.behaveAlert = newValue;
  });
  $rootScope.$watch('newBadge', function(newValue, oldValue) {
    $scope.newBadge = newValue;
  });
  $rootScope.$watch('newLevel', function(newValue, oldValue) {
    $scope.newLevel = newValue;
  });
});
