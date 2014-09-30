angular.module( 'shapter.student', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'resources.user',
  'services.appText'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'student in school', {
    url: '/schools/:schoolId/student/:studentId',
    views: {
      "main": {
        controller: 'StudentCtrl',
        templateUrl: 'student/student.tpl.html'
      }
    },
    data:{ pageTitle: 'Profil' }
  }).state( 'student', {
    url: '/student/:studentId',
    views: {
      "main": {
        controller: 'StudentCtrl',
        templateUrl: 'student/student.tpl.html'
      }
    },
    data:{ pageTitle: 'Profil' }
  });
}])

.controller( 'StudentCtrl', ['$scope', 'security', '$stateParams', '$location', 'Analytics', 'User', 'AppText', function( $scope, security, $stateParams, $location, Analytics, User, AppText ){


  $scope.loading = {};
  $scope.loading.comments = false;
  $scope.AppText = AppText;
  $scope.display = {
    nav: null
  };
  $scope.security = security;
  $scope.signupFunnelNav = function( schoolId ){
    var search = {
      'fromApp': true
    };
    $location.path( '/schools/' + schoolId + '/signupFunnel').search( search );
  };

  $scope.progressBarType = "success";
  $scope.progressBarTitle = "Participe sur Shapter et tu gagneras des points pour accéder au prochain niveau.";

  if( $stateParams.studentId ){
    User.get( $stateParams.studentId ).then( function( response ){
      $scope.user = response;
      $scope.display.nav = response.schools[0].id;
      $scope.loadCourses( $scope.user.schools[0], false, false );

      var user = $scope.user;
      if( user.id ){
        behave.identify(user.id, {name: user.firstname + " " + user.lastname});
        $scope.player = null;
        $scope.badges = null;
        behave.events.subscribe("player:identified", function(response) {
          behave.player.level.progress = Math.floor(behave.player.level.progress);
          $scope.player = behave.player;
          var progress = behave.player.level.progress;
          if (progress < 25) {
            $scope.progressBarType = "success";
            $scope.progressBarTitle = "Participe sur Shapter et tu gagneras des points pour accéder au prochain niveau.";
          } else if (progress < 50) {
            $scope.progressBarType = "info";
            $scope.progressBarTitle = "C'est bien, continue sur cette lancée !";
          } else if (progress < 75) {
            $scope.progressBarType = "warning";
            $scope.progressBarTitle = "Oh oh, le prochain niveau se rapproche !";
          } else {
            $scope.progressBarType = "danger";
            $scope.progressBarTitle = "Allez, encore un petit effort, tu es presque au prochain niveau !";
          }
          behave.player.fetchBadges(function(err, results) {
            $scope.$apply(function() {
              $scope.badges = results;
            });
          });
          behave.player.fetchLockedBadges(function(err, results) {
            $scope.$apply(function() {
              $scope.lockedBadges = results;
            });
          });
        });
        /*
           $scope.position = null;
           behave.player.fetchLeaderboardResults({"leaderboards": "points"}, function(err, results) {
           console.log(results);
           });
           */
      }
      if ($scope.user.firstname == null) {
        $scope.user.login = $scope.user.email;
      }
      else {
        $scope.user.login = $scope.user.firstname + ' ' + $scope.user.lastname;
      }
      if( $scope.ownProfile() ){
        Analytics.ownProfile();
      }
      else{
        Analytics.stalkProfile( $scope.user );
      }

    });
  }
  $scope.ownProfile = function(){
    return security.currentUser.id == $stateParams.studentId;
  };

  $scope.loadCourses = function( school, cart, constructor ){
    if( $scope.user ){
      try {
        school.loading = true;
        User.courses( $stateParams.studentId, school.id, cart, constructor ).then( function( response ){
          school.loading = false;
          school.cursus = response;
        }, function(){
          school.loading = false;
        });
      }
      catch( err ) {
        console.log( "no school. Zbeulah !" );
      }
    }
  };

  $scope.loadComments = function(){
    if( $scope.comments ){
      $scope.display.nav = 'comments';
    }
    else if( $scope.user ){
      $scope.loading.comments = true;
      User.loadComments( $scope.user ).then( function( comments ){
        $scope.loading.comments = false;
        $scope.display.nav = 'comments';
        $scope.comments = comments;
      }, function(){
        $scope.loading.comments = false;
      });
    }
  };

  $scope.loadAlikeUsers = function(){
    try {
      $scope.loading.alike = true;
      User.getAlikeById( $scope.user.id ).then( function( response ){
        $scope.loading.alike = false;
        $scope.display.nav = 'alikeUsers';
        $scope.alikeUsers = response.alike_users;
      }, function(){
        $scope.loading.alike = false;
      });
    }
    catch ( err ){
      console.log( 'no user' );
    }
  };

  $scope.navToStudent = function( id ){
    $location.path( "/student/" + id );
  };

}])

.filter( 'nbOfCourses', [function(){
  return function( steps ){
    var out = 0;
    angular.forEach( steps, function( step ){
      out += step.subscribed_items.length;
    });
    return out;
  };
}]);

