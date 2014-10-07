angular.module('resources.profileBox', [
  'restangular',
  'security.service'
])

.factory('ProfileBox', ['Restangular', function( Restangular ){
  var ProfileBox = {
    create: function( box ){
      var entities = {
        profile_box: {
          "end_date": true,
          "internship": true,
          "items": true,
          "name": true,
          "start_date": true,
          "tags": true,
          "type": true
        },
        tag: {
          "category": true,
          "name": true
        },
        item: {
          "name": true
        }
      };
      box.entities = entities;
      return Restangular.all('profile_boxes').customPOST( box, 'create' );
    },
    remove: function( id ){
      return Restangular.one('profile_boxes', id).remove();
    },
    edit: function( box ){
      return Restangular.one('profile_boxes', box.id).customPUT( box );
    }
  };
  return ProfileBox;
}]);

