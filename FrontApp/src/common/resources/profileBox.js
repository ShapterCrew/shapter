angular.module('resources.profileBox', [
  'restangular',
  'security.service'
])

.factory('ProfileBox', ['Restangular', '$filter', function( Restangular, $filter ){

  var removeItem = function( item_ids ){
    var box = this;
    var params = {
      item_ids: item_ids
    };
    return Restangular.one('profile_boxes', box.id).customPOST( params, 'remove_items' );
  };

  var addItems = function( item_ids ){
    var box = this;
    var params = {
      item_ids: item_ids
    };
    return Restangular.one('profile_boxes', box.id).customPOST( params, 'add_items' );
  };

  var extendProfileBox = function(profile_box) {
    return angular.extend(profile_box, {
      removeItem: removeItem,
      addItems: addItems
    });
  };

  Restangular.extendModel('profile_boxes', function (profile_box) {
    return extendProfileBox(profile_box);
  });

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
    },

    getRecommendations: function(){
      var params = {
        entities: {
          profile_box: {
            "end_date": true,
            "internship": false,
            "items": false,
            "name": true,
            "start_date": true,
            "tags": true,
            "type": false
          },
          tag: {
            "category": true,
            "name": true
          }
        }
      };
      return Restangular.all( 'profile_boxes' ).customPOST( params, 'recommand' ).then( function( response ){
        return $filter( 'formatBoxesRecommendations' )( response.reco );
      });
    }
  };
  return ProfileBox;
}])

.filter('formatBoxesRecommendations', [function(){
  return function( recos ){
    var mapped = recos.reduce( function( oldVal, newVal ){
      oldVal[ newVal.name ] = oldVal[ newVal.name ] || [];
      oldVal[ newVal.name ].push( newVal );
      return oldVal;
    }, {});
    return Object.keys( mapped ).map( function( key, index ){
      out = {
        name: key,
        boxes: mapped[ key ]
      };
      return out;
    });
  };
}]);

