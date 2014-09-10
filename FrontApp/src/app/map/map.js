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
    controller: 'MapsCtrl',
    scope: {
      internships: '='
    }
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

  $scope.markers = $filter( 'formatMarkers' )( $scope.internships );

  $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
    // Args will contain the marker name and other relevant information
    var elem = document.getElementsByClassName('leaflet-popup-content');
    $compile( elem )($scope);
  });

}]);

