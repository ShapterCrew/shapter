angular.module("directives.likeComment", [])
.directive('shLikeComment', ['Item', '$timeout', function(Item, $timeout){
  return {
    restrict: 'E',
    templateUrl: 'directives/comment/likeComment.tpl.html', 
    link: function(scope, element, attrs){

      scope.questionPending = false;

      scope.onAnswer = function(followed){
        scope.questionPending = false;
        $timeout(scope.applyLike, 10);
        if (followed === true){
          Item.suscribe( scope.item, true);
        }
      };

      scope.onLike = function(like){
        scope.likeStatus = like;
        if (scope.item.followed === false){
          scope.questionPending = true;
        }
        else {
          $timeout(scope.applyLike, 10);
        }
      };

      scope.applyLike = function(){
        if (scope.likeStatus == 'like'){
          scope.comment.like();
        }
        else if (scope.likeStatus == 'dislike'){
          scope.comment.dislike();
        }
      };
    }
  };
}]);
