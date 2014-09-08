angular.module('resources.formation', [
  'restangular',
  'security.service',
  'resources.comment'
])

.factory('Formation', ['Restangular', 'security', '$rootScope', '$location', function(Restangular, security, $rootScope, $location) {

  var Formation = {

    subFormations: function( tag_ids ){
      var params = {
        tag_ids: tag_ids,
        entities: {
          formation_page: {
            "sub_formations": true,
            "sub_departments": true,
            "sub_choices": true
          },
          tag: {
            "name": true
          }
        }
      };
      return Restangular.all( 'formations' ).customPOST( params );
    },

    typical_users: function( tag_ids){
      var params = {
        tag_ids: tag_ids,
        randomize: true,
        nb: 6,
        entities: {
          user: {
            firstname: true,
            lastname: true,
            image: true
          }
        }
      };
      return Restangular.all('formations').customPOST( params, 'typical_users');
    },

    formations: function( tag_ids ){
      var params =  {
        tag_ids: tag_ids,
        entities: {
          formation_page: {
            "best_comments": true,
            "best_comments_count": 5,
            "comments_count": true,
            "description": true,
            "diagrams_count": true,
            "fill_rate": true,
            "logo": true,
            "image": true,
            "name": true,
            "short_name": false,
            "students_count": true,
            "website_url": true,
            "sub_formations": false,
            "image_credits": true
          },
          comment: {
            "author": true,
            "content": true,
            "created_at": true,
            "current_user_likes": true,
            "dislikers_count": true,
            "item": true,
            "likers_count": true,
            "updated_at": true
          },
          item: {
            "name": true
          },
          tag: {
            "name": true
          }
        }
      };
      return Restangular.all( 'formations' ).customPOST( params ).then( function( response ){
        response.best_comments = Restangular.restangularizeCollection( null, response.best_comments, 'comments', {});
        response.description = response.description || '';
        return response;
      });
    },

    createOrUpdate: function( form ){
      return Restangular.all( 'formations' ).customPOST( form, "create_or_update" );
    }
  };

  return Formation;

}]);
