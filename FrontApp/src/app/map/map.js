angular.module( 'shapter.maps', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'leaflet-directive',
  'services.appText'
])

.directive('shMap', [function(){
  return {
    restrict: 'AE',
    templateUrl: 'map/map.tpl.html',
    controller: 'MapsCtrl'
  };
}])

.controller('MapsCtrl', ['$scope', function( $scope ){

  $scope.defaults = {
  };

  $scope.markers = {
    osloMarker: {
      lat: 59.91,
      lng: 10.75,
      message: "I want to travel here!",
      focus: true,
      draggable: false
    }
  };

}]);

