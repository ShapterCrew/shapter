angular.module('resources.school', [
  'restangular',
  'security.service'
])

.factory('School', ['Restangular', 'security', '$rootScope', '$location', function(Restangular, security, $rootScope, $location) {

  var School = {

    index: function(){
      var params = {
        entities: {
          tag: {
            name: true,
            type: true,
            short_name: true,
            "comments_count": true,
            "diagrams_count": true,
            "fill_rate": true,
            "students_count": true
          },
          school: {
            "name": true,
            "comments_count": true,
            "diagrams_count": true,
            "fill_rate": true,
            "students_count": true
          }
        }
      };
      return Restangular.all( 'schools' ).customPOST( params );
    }
  };

  return School;
}]);

