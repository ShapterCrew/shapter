angular.module('resources.tag', [
  'restangular',
  'security.service'
])

.factory('Tag', ['Restangular', 'security', '$rootScope', '$location', '$q', 'Category', function(Restangular, security, $rootScope, $location, $q, Category) {

  var schoolTags = {};
  var allTags = [];
  var allStudents = [];
  var schoolTagIndex = {};
  var tagIndex = {};
  var toType = function( obj ) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  var Tag = {

    typeahead: function( string, tag_ids, context, limit, category_filter ){
      var params = {
        search_string: string,
        selected_tags: tag_ids,
        context: context,
        limit: limit,
        entities: {
          tag: {
            name: true,
            category: true
          }
        }
      };

      if ( !!category_filter ){
        params.category_filter = category_filter;
      }

      return Restangular.all( 'tags' ).customPOST( params, 'typeahead' );
    },

    getSuggestedTags: function( tag_ids, context, limit, category_filter ){
      var params = {
        selected_tags: tag_ids,
        context: context,
        limit: limit,
        entities: {
          tag: {
            name: true,
            category: true
          }
        }
      };

      if ( !!category_filter ){
        params.category_filter = category_filter;
      }

      return Restangular.all( 'tags' ).customPOST( params, 'suggested' );
    },

    get: function( id ){
      console.log( 'getting tag' );
      var params = {
        entities: {
          tag: {
            name: true
          }
        }
      };
      return Restangular.one( 'tags', id ).customPOST( params ).then( function( response ){
        console.log( 'success' );
        console.log( response );
        return response;
      }, function( error ){
        console.log( 'error' );
        console.log( error );
        return error;
      });
    },

    deleteTag: function( tag ){
      return Restangular.one( 'tags', tag.id ).remove();
    },

    getSchoolTags: function( schoolId ){
      if ( !schoolTags[ schoolId ] ){
        return this.loadSchoolTags( schoolId ).then(function( success ){
          return { 
            tags: schoolTags[ schoolId ],
            index: schoolTagIndex[ schoolId ]
          };
        });
      }
      else {
        return $q.when({ 
          tags: schoolTags[ schoolId ],
          index: schoolTagIndex[ schoolId ]
        });
      }
    },

    setSignupFunnel: function( signupFunnel, tag ){
      return Restangular.one( 'tags', tag.id ).customPUT( {signup_funnel: signupFunnel }, 'signup-funnel');   
    },

    getSignupFunnel: function( tag ){
      return Restangular.one( 'tags', tag.id ).customPOST( null, 'signup-funnel');
    },

    setConstructorFunnel: function( constructorFunnel, tag ){
      return Restangular.one( 'tags', tag.id ).customPUT( {constructor_funnel: constructorFunnel }, 'constructor-funnel');   
    },

    getConstructorFunnel: function( tag ){
      var params = {
        entities: {
          tags: {
            name: true,
            category: true
          }
        }
      };
      return Restangular.one( 'tags', tag.id ).customPOST( params, 'constructor-funnel');
    },

    tagBatch: function( tag, batch ){
      var item_ids_list = [];
      angular.forEach( batch, function( item ){
        item_ids_list.push( item.id );
      });
      var tagName = toType( tag ) == 'object' ? tag.name : tag;
      return Restangular.all( 'tags' ).all( 'batch_tag' ).post({'tag_name': tagName, 'item_ids_list': item_ids_list});
    },

    updateTag: function( tag, newName ){
      return Restangular.one( 'tags', tag.id ).all( 'update' ).post({name: newName});
    },

    loadAllStudents: function(){
      var params = {
        entities: {
          user: {
            "firstname": true,
            "lastname": true
          }
        }
      };
      if( Tag.allStudents.length === 0 ){
        Restangular.one( 'tags', security.currentUser.schools[0].id ).customPOST( params, 'students').then( function( response ){
          angular.forEach( response.students, function( student ){
            student.name = student.firstname + ' ' + student.lastname;
          });
          Tag.allStudents = response.students;
        });
      }
    },

    allStudents : []

  };

  var extendTag = function(tag) {
    return tag;
  };

  // adding custom behavior
  Restangular.extendModel('tag', function (tag) {
    return extendTag(tag);
  });

  return Tag;
}]);
