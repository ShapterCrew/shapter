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

.directive('leafletPopupContent', [function(){
  return {
    restrict: 'C',
    link: function( scope, elem, attr ){
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
    }
  };
}])

  // formats the internships into markers
.filter('formatMarkers', [function(){
  return function( markers ){
    angular.forEach( markers, function( element, index ){
      // adds templating whit shMapMessage directive to marker popups templates
      element.message = '<div sh-map-message marker=\"markers[\'' + index + '\']\"></div>';
    });
    return markers;
  };
}])

.controller('MapsCtrl', ['$scope', '$compile', '$filter', function( $scope, $compile, $filter ){

  // formats the internships into markers
  $scope.markers = $filter( 'formatMarkers' )( $scope.internships );

  $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
    // compiles the template messages so that the shMapMessage is recognized by angularjs and scope accessible etc
    var elem = document.getElementsByClassName('leaflet-popup-content');
    $compile( elem )($scope);
  });

}]);

