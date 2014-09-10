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

// replaces the marker popup content and add its own scope with marker stuff 
.directive('shMapMessage', [function(){
  return {
    restrict: 'A',
    templateUrl: 'map/message.tpl.html',
    scope: {
      marker: '='
    }, 
    controller: 'MapMessageCtrl'
  };
}])

.controller('MapMessageCtrl', ['$scope', '$stateParams', function( $scope, $stateParams ){
  $scope.$stateParams = $stateParams;
}])

// formats the internships into markers
.filter('formatMarkers', [function(){
  return function( markers ){
    angular.forEach( markers, function( element, index ){
      // adds templating whit shMapMessage directive to marker popups templates
      element.message = '<div sh-map-message marker=\"markers[\'' + index + '\']\"></div>';
      element.group = 'internships';
    });
    return markers;
  };
}])

.controller('MapsCtrl', ['$scope', '$compile', '$filter', 'leafletData', 'leafletMarkersHelpers', function( $scope, $compile, $filter, leafletData, leafletMarkersHelpers ){

  console.log( leafletMarkersHelpers );

  $scope.$on('$destroy', function () {
    leafletMarkersHelpers.resetCurrentGroups();
  });

  $scope.$on('$stateChangeStart', function(){
    leafletData.getMap().then(function(map) {
      console.log( map );
    });
  });

  // formats the internships into markers
  $scope.markers = $filter( 'formatMarkers' )( $scope.internships );

  // compiles the template messages so that the shMapMessage is recognized by angularjs and scope accessible etc
  $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
    var elem = document.getElementsByClassName('leaflet-popup-content');
    $compile( elem )($scope);
  });

  /*
     $scope.layers =  {
baselayers: {
osm: {
name: 'OpenStreetMap',
url: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png',
type: 'xyz'
}
}
};
*/

}]);

