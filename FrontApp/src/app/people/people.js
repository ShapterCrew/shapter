angular.module( 'shapter.people', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'resources.user'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'people', {
    url: '/people',
    views: {
      "main": {
        controller: 'PeopleCtrl',
        templateUrl: 'people/people.tpl.html'
      }
    },
    data:{ pageTitle: 'People' }
  });
}])

.controller('PeopleCtrl', ['$scope', 'User', '$location', 'Tag', 'Analytics', '$timeout', 'security', '$window', 'AppText', function( $scope, User, $location, Tag, Analytics, $timeout, security, $window, AppText ){


  $scope.AppText = AppText;
  /*
  var user = security.currentUser;
  behave.identify(user.id, {name: user.firstname + " " + user.lastname});
  behave.events.subscribe("player:identified", function(response) {
    behave.fetchLeaderboardResults('points', { max: 20 }, function(err, results) {
      $scope.$apply(function() {
        $scope.leaderboard = results;
      });
    });
  });
  */
  User.leaderBoard().then( function( response ){
    $scope.leaderboard = response.leaderboard;
  });

  $scope.facebookConnect = function(){
    Analytics.facebookAssociate();
//    security.logout();
    $window.location.href = "/api/v1/users/auth/facebook";
  };

  $scope.Tag = Tag;
  Tag.loadAllStudents();

  $scope.navToStudent = function( id ){
    $location.path( "/student/" + id );
  };

  $scope.loadingAlike = true;
  User.getAlike().then( function( response ){
    $scope.loadingAlike = false;
    $scope.alike = response.alike_users;
  });

  $scope.loadingFriends = true;
  User.getFriends().then( function( response ){
    $scope.loadingFriends = false;
    $scope.friends = response.friends;
  });

  Analytics.people();

}])

.filter( 'removeZeros', [function(){
  return function( string ){
    if ( string[0] == '0' ){
      return string.slice( 1, string.length + 1 );
    }
    else {
      return string;
    }

  };
}]);


