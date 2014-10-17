angular.module('resources.internship', [
  'restangular',
  'security.service'

])

.factory('Internship', ['Restangular', '$q', '$timeout', function( Restangular, $q, $timeout ) {

  //********* Adding instance methods *************//

  var params = {
    entities: {
      internship: {
        "title": true,
        "start_date": true,
        "end_date": true,
        "duration": true,
        "trainee": true,
        "tags": true
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

  Internship.getListFromTags = function(tags, active_only) {
    var entities = {
      internship: {
        "title": true,
        "start_date": true,
        "end_date": true,
        "duration": true,
        "trainee": true,
        "tags": true,
        "lat": true,
        "lng": true,
        "description": true,
        "in_progress": true

      },
      user: {
        "firstname": true,
        "lastname": true,
        "image": true
      },
      tag: {
        name: true,
        category: true
      }
    };

    var params = {
      entities: entities,
      filter: tags,
      active_only: active_only,
      n_stop: -1
    };

    return Restangular.all('internships').customPOST( params, 'filter' );
  };

  Internship.create = function( internship ) {
    return Restangular.all('internships').customPOST(internship, 'create');
  };

  Internship.update = function( internship ){
    return Restangular.one( 'internships', internship.id ).customPUT( internship );
  };

  Internship.addTags = function( id, tag_ids, tags_by_name_cat ){
    return Restangular.one( 'internships', id ).customPUT({ tag_by_ids: tag_ids, tags_by_name_cat: tags_by_name_cat }, 'add_tags');
  };

  return Internship;
}]);

