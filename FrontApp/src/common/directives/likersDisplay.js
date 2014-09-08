angular.module( 'directives.likersLoader', [])
.directive( 'likersLoader', ['Analytics', function( Analytics ){
  return {
    restrict: 'A',
    link: function( scope, element, attr ){
      element.bind( 'mouseout', function(){
        scope.$apply( function(){
          scope.comment.displayLikers = false;
        });
      });
      element.bind( 'click', function( e ){
        e.stopPropagation();
        scope.comment.displayLikers = true;
        scope.comment.loadingLikers = true;
        scope.comment.loadLikers().then( function(){
          scope.comment.loadingLikers = false;
        }, function(){
          scope.comment.loadingLikers = false;
        });
        Analytics.whoLikesThat();
      });
    }
  };
}])

.directive( 'dislikersLoader', ['Analytics', function( Analytics ){
  return {
    restrict: 'A',
    link: function( scope, element, attr ){
      element.bind( 'mouseout', function(){
        scope.$apply( function(){
          scope.comment.displayDislikers = false;
        });
      });
      element.bind( 'click', function( e ){
        e.stopPropagation();
        scope.comment.displayDislikers = true; 
        scope.comment.loadingDislikers = true;
        scope.comment.loadDislikers().then( function(){
          scope.comment.loadingDislikers = false;
        }, function(){
          scope.comment.loadingDislikers = false;
        });
        Analytics.whoDislikesThat();
      });
    }
  };
}]);
