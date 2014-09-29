angular.module( 'directives.comment', [
  'shapter.item'
])
.directive( 'shComment', ['Comment', 'security', function( Comment, security){
  return {
    restrict: 'A',
    scope: {
      comment: '=',
      displaySatisfaction: '=',
      displayCourseName: '=',
      displayStudentName: '=',
      currentUser: '=',
      comments: '=',
      close: '&',
      hideLikes: '='
    },
    controller: 'CommentCtrl',
    templateUrl: 'directives/comment/comment.tpl.html'
  };
}])

.controller( 'CommentCtrl', ['$scope', 'security', 'Comment', '$location', 'itemFactory', 'Item', 'AppText', '$stateParams', function($scope, security, Comment, $location, itemFactory, Item, AppText, $stateParams ){
  /***** diagrams *****/
  $scope.showDiagrams = true;
  $scope.diagramWithText = true;
  /*** End diagrams ***/

  $scope.security = security;
  $scope.AppText = AppText;
  $scope.comment.displayEditComment = false;

  $scope.navToStudent = function( id ){
    if( $stateParams.schoolId ){
      $location.path("/schools/" + $stateParams.schoolId + "/student/" + id ).search('filter', null);
    }
    else {
      $location.path("/student/" + id ).search('filter', null);
    }
    if( $scope.close ){
      $scope.close();
    }
  };

  $scope.openItem = function( id ){
    $location.path("/item/" + id);
    /*
       Item.get( id ).then( function( item ){
       itemFactory.openModal( item, []);
       });
       */
  };

  $scope.comment.old_likers_count = $scope.comment.likers_count;
  $scope.comment.old_dislikers_count = $scope.comment.dislikers_count;

  $scope.dangerBar = {width: 100 * $scope.comment.dislikers_count / ($scope.comment.dislikers_count + $scope.comment.likers_count) + "%"};
  $scope.successBar = {width: 100 * $scope.comment.likers_count / ($scope.comment.dislikers_count + $scope.comment.likers_count) + "%"};

  $scope.$watch(function(){
    return $scope.comment.likers_count;
  }, function(){
    $scope.dangerBar.width = 100 * $scope.comment.dislikers_count / ($scope.comment.dislikers_count + $scope.comment.likers_count) + "%";
    $scope.successBar.width = 100 * $scope.comment.likers_count / ($scope.comment.dislikers_count + $scope.comment.likers_count) + "%";
  });

  $scope.$watch(function(){
    return $scope.comment.dislikers_count;
  }, function(){
    $scope.dangerBar.width = 100 * $scope.comment.dislikers_count / ($scope.comment.dislikers_count + $scope.comment.likers_count) + "%";
    $scope.successBar.width = 100 * $scope.comment.likers_count / ($scope.comment.dislikers_count + $scope.comment.likers_count) + "%";
  });
  $scope.normalizeValue = function( val ){
    return Math.floor( (val - 1) / 20 ) + 1;
  };

  $scope.ownComment = function() {
    return security.currentUser ? $scope.comment.author.id == security.currentUser.id : false;
  };

  //Remove the comment
  $scope.removeComment = function() {
    var idx = $scope.comments.indexOf($scope.comment);
    $scope.comment.remove().then(function(response) {
      $scope.comments.splice(idx, 1);
      Analytics.removeComment();
    });
  };

  var cb_like = function(response) {
    $scope.comment = response;
  };

  $scope.like = function() {
    // was liked
    if ($scope.comment.current_user_likes == 1) {
      $scope.comment.current_user_likes = 0;
      $scope.comment.likers_count -= 1;
      $scope.comment.unlike().then(cb_like);
      Analytics.unlike( $scope.comment );
    }
    // was disliked
    else if( $scope.comment.current_user_likes == -1) {
      $scope.comment.current_user_likes = 1;
      $scope.comment.dislikers_count -= 1;
      $scope.comment.likers_count += 1;
      $scope.comment.like().then(cb_like);
      Analytics.like( $scope.comment );
    }
    // was neither
    else {
      $scope.comment.current_user_likes = 1;
      $scope.comment.likers_count += 1;
      $scope.comment.like().then(cb_like);
      Analytics.like( $scope.comment );
    }
  };

  $scope.dislike = function() {
    if ($scope.comment.current_user_likes == -1) {
      $scope.comment.current_user_likes = 0;
      $scope.comment.dislikers_count -= 1;
      $scope.comment.unlike().then(cb_like);
      Analytics.unlike( $scope.comment );
    }
    else if( $scope.comment.current_user_likes == 1){
      $scope.comment.current_user_likes = -1;
      $scope.comment.likers_count -= 1;
      $scope.comment.dislikers_count += 1;
      $scope.comment.dislike().then(cb_like);
      Analytics.dislike( $scope.comment );
    }
    else {
      $scope.comment.current_user_likes = -1;
      $scope.comment.dislikers_count += 1;
      $scope.comment.dislike().then(cb_like);
      Analytics.dislike( $scope.comment );
    }
  };
}])

.filter('commentCut', [function(){
  return function( input, limit, all){
    return all ? input : input.slice(0, limit); 
  };
}])

.filter('hiddenComments', [function(){
  return function( input ){
    return input.map( function( comment ){
      return ( comment.content == 'hidden' ) * 1;
    }).reduce( function( last, now ){
      return last += now;
    }, 0);
  };
}])

.filter('floor', [function(){
  return function( numb ){
    return Math.floor( numb );
  };
}]);
