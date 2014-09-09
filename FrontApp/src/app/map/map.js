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

  var redMarker = L.AwesomeMarkers.icon({
    icon: 'coffee',
    markerColor: 'red'
  });

  L.marker([51.941196,4.512291], {icon: redMarker}).addTo(map);

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

