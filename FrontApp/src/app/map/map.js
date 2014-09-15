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
      internshipsList: '=',
      onNew: '&',
      onInternshipCreated: '&'
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
.controller('MapMessageCtrl', ['$scope', '$stateParams', 'AppText', function( $scope, $stateParams, AppText ){
  $scope.AppText = AppText;
  $scope.$stateParams = $stateParams;
}])

// formats the internships into markers
.filter('formatMarkers', [function(){
  return function( internships ){
    angular.forEach( internships, function( internship, index ){
      // adds templating whit shMapMessage directive to marker popups templates
      internship.message = '<div sh-map-message marker=\"markers[\'' + index + '\']\"></div>';
      internship.icon = {
        type: 'awesomeMarker',
        icon: 'graduation-cap',
        prefix: 'fa'
        //markerColor: 'green'
      };

      //defines group if not defined
      internship.group = internship.group ? internship.group : 'default';
    });
    return internships;
  };
}])

//controller for the map
.controller('MapsCtrl', ['$scope', '$compile', '$filter', 'leafletMarkersHelpers', function( $scope, $compile, $filter, leafletMarkersHelpers ){

  // custom method added to reset groups. Otherwise the markers are not displayed.
  $scope.$on('$destroy', function () {
    leafletMarkersHelpers.resetCurrentGroups();
  });

  $scope.$on('InternshipCreated', function(){
    $scope.onInternshipCreated();
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
