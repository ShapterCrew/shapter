angular.module( 'shapter.editDiagram', [])
.directive( 'shEditDiagram', [function(){
  return {
    restrict: 'A',
    scope: {
      item: '=',
      cb: '&'
    },
    templateUrl: 'directives/editDiagram.tpl.html',
    controller: 'EditDiagramCtrl'
  };
}])

.directive( 'shEditDiagramLight', [function(){
  return {
    restrict: 'A',
    scope: {
      item: '=',
      cb: '&'
    },
    templateUrl: 'directives/editDiagramLight.tpl.html',
    controller: 'EditDiagramCtrl'
  };
}])

.controller( 'EditDiagramCtrl', ['$scope', 'Analytics', 'Item', 'AppText', function( $scope, Analytics, Item, AppText ){

  $scope.AppText = AppText;

  $scope.item.temporaryDiag = $scope.item.temporaryDiag ? $scope.item.temporaryDiag : angular.copy( $scope.item.current_user_diagram );

  $scope.editDiagram = function(){
    var values = {};
    var newDiagram = false;
    angular.forEach( $scope.item.temporaryDiag.front_values, function( cat, key ){
      values[ key ] = cat.value;
    });
    return $scope.item.editDiagram( values ).then( function(){
      $scope.item.subscribe();
      if( $scope.item.current_user_has_diagram !== true ){
        $scope.item.diagrams_count += 1;
        newDiagram = true;
      }
      $scope.item.current_user_has_diagram = true;
      $scope.item.currentUserDiag();
      $scope.item.avgDiag();
      $scope.cb();
      Analytics.editDiagram( $scope.item, newDiagram );
    });
  };

}]);
