angular.module('resources.internship', [
  'restangular',
  'security.service'

])

.factory('Internship', ['Restangular', '$q', '$timeout', function( Restangular, $q, $timeout ) {

  //********* Adding instance methods *************//

  var params = {
    entities: {
      internship: {
        "name": true,
        "description": true,
        "company_name": true,
        "company_size": true,
        "begin_date": true,
        "end_date": true,
        "domain": true,
        "position": true,
        "skills": true,
        "school": true
      },
      user: {
        "firstname": true,
        "lastname": true,
        "image": true
      }
    }
  };

  // adding custom behavior
  var extendInternship = function(internship) {
    return angular.extend(internship, {
    });
  };

  Restangular.extendModel('internships', function (internship) {
    return extendInternship(internship);
  });

  //********* Adding functions to Item *************//
  var Internship = Restangular.all('internships');

  Internship.get = function( id ){
    return Restangular.one( 'internships', id ).post( params );
  };

  Internship.getListFromTags = function(tags, current_only) {
    var entities = {
      internship: {
        "name": true,
        "description": true,
        "company_name": true,
        "company_size": true,
        "begin_date": true,
        "end_date": true,
        "domain": true,
        "position": true,
        "skills": true,
        "school": true,
        "user": true
      },
      user: {
        "firstname": true,
        "lastname": true,
        "image": true
      }
    };

    var params = {
      entities: entities,
      filter: tags,
      current_only: current_only
    };

    return Restangular.all('internships').customPOST( params, 'filter' );
  };

  Internship.create = function( internship ) {
    return Restangular.all('internships').customPOST(internship, 'create');
  };

  return Internship;
}]);

