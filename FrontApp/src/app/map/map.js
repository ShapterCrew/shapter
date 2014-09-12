angular.module( 'shapter.maps', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'leaflet-directive',
  'services.appText'
])

// directive for the map
.directive('shMap', [function(){
  return {
    restrict: 'AE',
    templateUrl: 'map/map.tpl.html',
    controller: 'MapsCtrl',
    scope: {
      internshipsList: '='
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

// the controller for the marker message box
.controller('MapMessageCtrl', ['$scope', '$stateParams', function( $scope, $stateParams ){
  $scope.$stateParams = $stateParams;
}])

// formats the internships into markers
.filter('formatMarkers', [function(){
  return function( internships ){
    angular.forEach( internships, function( marker, index ){
      // adds templating whit shMapMessage directive to marker popups templates
      marker.message = '<div sh-map-message marker=\"markers[\'' + index + '\']\"></div>';
      marker.icon = {
        type: 'awesomeMarker',
        icon: 'graduation-cap',
        prefix: 'fa',
        markerColor: 'green'
      };

      // TODO: remove those
      marker.lat = 39.12;
      marker.lng = 15.75;
      marker.focus = false;
      marker.draggable = false;

      //defines group if not defined
      marker.group = marker.group ? marker.group : 'default';
    });
    return internships;
  };
}])

//controller for the map
.controller('MapsCtrl', ['$scope', '$compile', '$filter', 'leafletMarkersHelpers', function( $scope, $compile, $filter, leafletMarkersHelpers ){
  // custom method added to reset groups. Otherwise the markers are not shown.
  $scope.$on('$destroy', function () {
    leafletMarkersHelpers.resetCurrentGroups();
  });

  // formats the internships into markers
  $scope.$watch( function(){
    return $scope.internshipsList;
  }, function(){
    $scope.markers = $filter( 'formatMarkers' )( $scope.internshipsList );
  }, true);

  // compiles the template messages so that the shMapMessage is recognized by angularjs and scope accessible etc
  $scope.$on('leafletDirectiveMarker.popupopen', function(e, args) {
    var elem = document.getElementsByClassName('leaflet-popup-content');
    $compile( elem )($scope);
  });
}]);
