angular.module( 'directives.updateItemSyllabus', [])
.directive( 'shUpdateItemSyllabus', [function(){
  return {
    restrict: 'A',
    scope: {
      item: '=',
      cb: '&'
    },
    templateUrl: 'directives/item/updateSyllabus.tpl.html',
    controller: 'UpdateItemSyllabusCtrl'
  };
}])

.controller( 'UpdateItemSyllabusCtrl', ['$scope', 'Item', 'AppText', '$filter', function($scope, Comment, AppText, $filter ){

  $scope.AppText = AppText;
  $scope.alerts = [
  ];

  $scope.removeAlert = function( index ){
    $scope.alerts.splice( index, 1 );
  };

  $scope.updateSyllabus = function() {
    $scope.item.updateSyllabus($scope.item.syllabus).then(function(response){
      $scope.cb();
    }, function(x){
      console.log( x );
      $scope.alerts.push({
        msg: $filter( 'language' )(AppText.item.problem )
      });
    });
  };


}]);

