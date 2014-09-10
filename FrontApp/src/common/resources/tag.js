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

    get: function( id ){
      var params = {
        entities: {
          tag: {
            name: true
          }
        }
      };
      return Restangular.one( 'tags', id ).customPOST( params );
    },

    loadAllTags: function(){
      $rootScope.allTagsLoaded = false;

      var params = {
        entities: {
          tag: {
            name: true,
            short_name: true,
            category: true
          }
        }
      };

      //get all tags existing
      return Restangular.all('tags').post( params ).then(function( tags ){
        allTags = tags;
        tagIndex = {
          "length": 0
        };
        angular.forEach( tags, function( tag ){
          tag.acronym = tag.short_name ? tag.short_name : tag.name;
          tag.full_name = tag.short_name ? tag.short_name + " : " + tag.name : tag.name;
          tagIndex.length += 1;
          tagIndex[ tag.id ] = tag;
        });
        // not totaly sure if it's a good idea to communicate like that. But it works -> triggers BrwoseCtrl updateScope Tags after schoolTagIndex is loaded
        if( tags.length > 0 ){
          $rootScope.$broadcast( 'allTagsLoaded' );
          $rootScope.allTagsLoaded = true;
        }
      });
    },

    getSchools: function(){
      var entities = {
        tag: {
          name: true,
          short_name: true,
          category: true
        }
      };
      return Category.list().then( function(){
        return Restangular.all('tags').customPOST({ entities: entities, category: 'school'});
      });
    },

    getAllTags: function(){
      if( allTags.length ){
        return $q.when(allTags);
      }
      else {
        return this.loadAllTags().then(function(){
          return allTags;
        });
      }
    },

    getTagIndex: function(){
      if ( tagIndex == [] ){
        this.loadAllTags().then(function(){
          return tagIndex;
        });
      }
      else {
        return tagIndex;
      }
    },

    loadSchoolTags: function( schoolId ) {

      var entities = {
        tag: {
          name: true,
          short_name: true,
          category: true
        }
      };

      //get all tags existing
      return Restangular.all('tags').post({ filter: schoolId, entities: entities }).then(function( tags ){
        schoolTags[ schoolId ] = tags;
        schoolTagIndex[ schoolId ] = {
          "length": 0
        };
        angular.forEach( tags, function( tag ){
          tag.acronym = tag.short_name ? tag.short_name : tag.name;
          tag.full_name = tag.short_name ? tag.short_name + " : " + tag.name : tag.name;
          schoolTagIndex[ schoolId ].length += 1;
          schoolTagIndex[ schoolId ][ tag.id ] = tag;
        });

        // not totaly sure if it's a good idea to communicate like that. But it works -> triggers BrwoseCtrl updateScope Tags after schoolTagIndex is loaded
        if( tags.length > 0 ){
          $rootScope.$broadcast( 'schoolTagsLoaded' + schoolId );
        }
        return true;
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

    getSchoolTagIndex: function( schoolId ){
      /*
         if ( schoolTagIndex[ schoolId ] === undefined ){
         this.loadSchoolTags( schoolId ).then(function(){
         return schoolTagIndex[ schoolId ];
         });
         }
         else {
         */
      return schoolTagIndex[ schoolId ];
      /*
         }
         */
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

    getSuggestedTags: function( tags ) {
      var entities = {
        tag: {
          name: true,
          category: true,
          short_name: true
        }
      };
      return Restangular.all('tags/suggested').post({entities: entities, selected_tags: tags, ignore_user: true}).then(function(response){
        // format tags to be used in app
        angular.forEach( response.recommended_tags, function( tag ){
          tag.category = tag.category ? tag.category : "autres";
          tag.acronym = tag.short_name ? tag.short_name : tag.name;
          tag.full_name = tag.short_name ? tag.short_name + " : " + tag.name : tag.name;
        });
        tagsSuggestions = response.recommended_tags;
        return tagsSuggestions;
      });
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
