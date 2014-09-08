angular.module('shapter.sideItem', [])

.directive('shSideItem', ['$document', function( $document ){
  return {
    restrict: 'A',
    controller: 'SideItemCtrl',
    templateUrl: 'sideItem/sideItem.tpl.html',
    link: function( scope, elem, attr ){
    }
  };
}])

.controller('SideItemCtrl', ['$scope', '$location', '$document', function( $scope, $location, $document ){

  $document.bind('keydown', function( evt ){
    if( evt.which == 27 ){
      $scope.$apply( function(){
        $scope.closeItem(); 
      });
    }

    // up or left
    if( evt.which == 38 || evt.which == 37 ){
      evt.preventDefault();
      $scope.previous();
    }

    // down of right
    if( evt.which == 40 || evt.which == 39 ){
      evt.preventDefault();
      $scope.next();
    }

  });

  $scope.navToItem = function( id ){
    $location.path('item/' + id );
  };
  $scope.closeItem = function(){
    $scope.active.item = null;
  };

  $scope.trackDownload = function( item, doc ){
    Item.countDl( item.id, doc.id );
    Analytics.downloadFile( item, doc );
  };

}])

.filter('commentCut', [function(){
  return function( input, limit, all ){
    return all ? input : input.slice(0, limit);
  };
}]);
