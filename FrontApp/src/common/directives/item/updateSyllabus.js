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
  var textInit = $scope.item.syllabus;
  $scope.$watch('item.updatingSyllabus', function(newValue, oldValue) {
    if (newValue) {
      textInit = $scope.item.syllabus;
    }
  });

  $scope.AppText = AppText;
  $scope.alerts = [
  ];

  $scope.removeAlert = function( index ){
    $scope.alerts.splice( index, 1 );
  };

  $scope.cancelUpdateSyllabus = function() {
    $scope.item.syllabus = textInit;
    $scope.item.updatingSyllabus = false;
  };

  $scope.updateItemSyllabus = function() {
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

