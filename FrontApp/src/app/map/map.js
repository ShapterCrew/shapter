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

.controller('MapsCtrl', ['$scope', '$compile', '$document', function( $scope, $compile, $document ){

  $scope.defaults = {
  };

  $scope.test = 'haha';

  $scope.markers = {
    osloMarker: {
      lat: 59.91,
      lng: 10.75,
      message: '<div ng-include=\"\'map/message.tpl.html\'\"></div>',
      focus: false,
      draggable: false
    }
  };

  $scope.$on('leafletDirectiveMarker.click', function(e, args) {
    // Args will contain the marker name and other relevant information
    console.log("Leaflet Click");
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

