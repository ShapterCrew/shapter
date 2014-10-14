angular.module( 'directives.addComment', [])
.directive( 'shAddComment', [function(){
  return {
    restrict: 'A',
    scope: {
      item: '=',
      cb: '&'
    },
    templateUrl: 'directives/comment/addComment.tpl.html',
    controller: 'AddCommentCtrl'
  };
}])

.controller( 'AddCommentCtrl', ['$scope', 'Comment', 'AppText', '$filter', 'security', '$rootScope', function($scope, Comment, AppText, $filter, security, $rootScope ){

  $scope.security = security;
  $scope.AppText = AppText;
  $scope.alerts = [
  ];

  $scope.removeAlert = function( index ){
    $scope.alerts.splice( index, 1 );
  };

  $scope.addNewComment = function() {
    Comment.newComment($scope.item.id, $scope.item.newComment).then(function(response){
      $rootScope.$broadcast('Comment Added');
      $scope.item.comments.push(response);
      console.log( response );
      $scope.item.current_user_comment = response;
      $scope.item.current_user_has_comment = true;
      $scope.item.this_user_has_comment = true;
      $scope.item.current_user_comments_count = $scope.item.current_user_comments_count ? $scope.item.current_user_comments_count + 1 : 1;
      $scope.item.newComment.content = '';
      $scope.item.current_user_subscribed = true;
      $scope.item.subscribe();
      $scope.cb();
    }, function(x){
      console.log( x );
      if( x.data.error.context[0] == "a context is required for alien comments" ){
        $scope.displayContextField = true;
        $scope.alerts.push({
          msg: $filter( 'language' )(AppText.comment.context_required )
        });
      } 
      else{
        $scope.alerts.push({
          msg: $filter( 'language' )(AppText.comment.problem )
        });
      }
    });
  };


}]);

