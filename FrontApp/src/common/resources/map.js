angular.module('resources.map', [])
.factory('Map', ['$http', function( $http ){

  //Google geocoding api, more precise than mapbox
  var geocoding = "http://maps.googleapis.com/maps/api/geocode/json?address=";

  var Map = {
    getFormatedAdresses: function( address ){
      var url = geocoding + encodeURIComponent(address);
      return $http.get(url);
    }
  };

  return Map;
}]);
