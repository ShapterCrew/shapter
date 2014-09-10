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

// create a directive that replaces the popup content and add its own scope with marker stuff 
.directive('shMapMessage', [function(){
  return {
    restrict: 'A',
    templateUrl: 'map/message.tpl.html',
    scope: {
      marker: '=',
      markers: '='
    }
  };
}])

.filter('formatMarkers', [function(){
  return function( markers ){
    angular.forEach( markers, function( element, index ){
      element.message = '<div sh-map-message marker=\"\'' + index + '\'\" markers=\"markers\"></div>';
      console.log( element );
    });
    return markers;
  };
}])

.controller('MapsCtrl', ['$scope', '$compile', '$filter', function( $scope, $compile, $filter ){

  $scope.markers = $filter( 'formatMarkers' )({
    olsoMarker: {
      lat: 39.91,
      lng: 15.75,
      message: '',
      focus: false,
      draggable: false
    },
    osloMarker: {
      lat: 59.91,
      lng: 10.75,
      message: '',
      focus: false,
      draggable: false
    }
  });

  $scope.$on('leafletDirectiveMarker.click', function(e, args) {
    // Args will contain the marker name and other relevant information
    console.log("Leaflet Click");

    // hack : I add a template whit the shMapMessage directive in the marker message. Compilation is therefore needed to 'explain angular' that it should consider this as a directive and not simply text
    var elem = document.getElementsByClassName('leaflet-popup-content');
    $compile( elem )($scope);
  });

  $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
    // Args will contain the marker name and other relevant information
    console.log("Leaflet Popup Open");
  });

  $scope.$on('leafletDirectiveMarker.popupclose', function(e, args) {
    // Args will contain the marker name and other relevant information
    console.log("Leaflet Popup Close");
  });


}]);

