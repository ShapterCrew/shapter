angular.module( 'resources.user', [
  'restangular',
  'resources.item',
  'resources.comment'
])

.factory( 'User', ['Restangular', 'Item', '$location', 'security', 'Comment', function( Restangular, Item, $location, security, Comment ){

  var User = {

    get: function( id ){

      var params = {
        entities: {
          user: {
            "admin": false,
            "comments": false,
            "comments_count": true,
            "comments_dislikes_count": true,
            "comments_likes_count": true,
            "confirmed": false,
            "confirmed_student": false,
            "diagrams_count": true,
            "firstname": true,
            "image": true,
            "is_fb_friend": true,
            "items_count": true,
            "lastname": true,
            "provider": true,
            "schools": true,
            "sign_in_count": true,
            "user_diagram": true
          },
          tag: {
            name: true
          },
          diagram: {
            front_values: true
          }
        }
      };

      return Restangular.one( 'users', id ).customPOST( params ).then( function( user ){
        var newComments = [];
        user.hasDiagram = false;
        angular.forEach( user.user_diagram.front_values, function(cat, key){
          if( cat.value !== null){
            user.hasDiagram = true;
          }
        });
        return( user );
      });
    },

    addSignupPermission: function( email, tags ){
      var ids = [];
      angular.forEach( tags, function( tag ){
        ids.push( tag.id );
      });
      return Restangular.all( 'signup-permissions' ).customPUT({ signup_permission: { email: email, school_tag_ids: ids }});
    },

    confirm_student_email: function( email, password ){
      return Restangular.one( 'users', 'me' ).customPOST({email: email, password: password}, 'confirm_student_email' );
    },

    signupFunnel: function( step, school_id ){
      var entities = {
        item: {
          name: true,
          current_user_subscribed: true
        }
      };
      return Restangular.one( 'users', 'me' ).one( 'signup-funnel', step ).customPOST({entities: entities, school_id: school_id}).then( function( response ){
        response.items = Restangular.restangularizeCollection( {}, response.items, 'items', {});
        return response;
      });
    },

    constructorFunnel: function( step ){
      var entities = {
        course_builder: {
          "cart_items": true,
          "constructor_items": true,
          "subscribed_items": true
        },
        item: {
          name: true,
          tags: true
        },
        tag: {
          name: true,
          type: true
        }
      };
      var school_id = security.currentUser.schools[ 0 ].id;
      return Restangular.one( 'users', 'me' ).one( 'constructor-funnel', step ).customPOST({ entities: entities, school_id: school_id }).then( function( response ){
        response.items = Restangular.restangularizeCollection( {}, response.items, 'items', {});
        return response;
      });
    },

    commentPipe: function( n_start, n, id ){
      var entities = {
        item: {
          name: true,
          averaged_diagram: false,
          comments_count: true,
          current_user_comments_count: true,
          current_user_diagram: true,
          requires_comment_score: true,
          current_user_has_diagram: true
        },
        diagram: {
          front_values: true
        }
      };
      return Restangular.one( 'users', 'me' ).customPOST({entities: entities, n_start : n_start, n: n, school_id: id}, 'comment-pipe').then( function( response ){
        response.commentable_items = Restangular.restangularizeCollection( {}, response.commentable_items, 'items', {});

        angular.forEach( response.commentable_items, function( item ){

          item.newComment = {
            content: ''
          };

          item.comments = [];

        });
        return response;
      });
    },

    courses: function( userId, schoolId, displayCart, displayConstructor ){
      var entities = {
        item: {
          name: true,
          this_user_has_comment: true,
          this_user_has_diagram: true,
          current_user_has_diagram: true,
          current_user_subscribed: true
        },
        tag: {
          name: true
        },
        course_builder: {
          subscribed_items: true
        }
      };
      var display_cart = displayCart || false;
      var display_constructor = displayConstructor || false;
      return Restangular.one( 'users', userId ).customPOST({entities: entities, displayConstructor: display_constructor, displayCart: display_cart, schoolTagId: schoolId}, 'courses' ).then( function( response ){
        angular.forEach( response, function( respStep ){
          if( respStep.cart_items ){
            respStep.cart_items = Restangular.restangularizeCollection( null, respStep.cart_items, 'items', {});
          }
          if( respStep.constructor_items){
            respStep.constructor_items = Restangular.restangularizeCollection( null, respStep.cart_constructor_items, 'items', {});
          }
          if( respStep.subscribed_items ){
            respStep.subscribed_items = Restangular.restangularizeCollection( null, respStep.subscribed_items, 'items', {});
          }
        });
        return response;
      });
    },

    usersParams: {
      entities: {
        user: {
          firstname: true,
          lastname: true,
          image: true,
          confirmed_student: true
        }
      }
    },

    getFacebookFriends : function(){
      return Restangular.one( 'users', 'me' ).customPOST( User.usersParams, 'friends');
    },

    getAlikeById: function( userId ){
      return Restangular.one( 'users', userId ).customPOST( User.usersParams, 'alike');
    },

    getAlike: function(){
      return Restangular.one( 'users', 'me' ).customPOST( User.usersParams, 'alike');
    },

    getSocial: function(){
      return Restangular.one( 'users', 'me' ).customPOST( User.usersParams, 'social');
    },

    getFriends: function(){
      return Restangular.one( 'users', 'me' ).customPOST( User.usersParams, 'friends');
    },

    loadComments: function( user ){
      var params = {
        entities: {
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
          user: {
            firstname: true,
            lastname: true
          },
          item: {
            name: true
          }
        }
      };
      return Restangular.one( 'users', user.id ).customPOST( params, 'comments').then( function( response ){
        angular.forEach( response.comments, function( comment ){
          var route = 'items/' + comment.item_id;
          comment = Restangular.restangularizeElement( {route: route}, comment, 'comments', {}); 

        });
        return response.comments;
      });
    },

    leaderBoard: function(){
      var params = {
        entities: {
          comment: {
            "author": true,
            "content": true,
            "created_at": true,
            "current_user_likes": true,
            "dislikers_count": true,
            "item": true,
            "likers_count": true,
            "updated_at": true
          }
        }
      };
      return Restangular.one( 'users', 'me' ).customPOST( params, 'leaderboard');
    },

    schools_for: function( email ){
      var entities = {
        tag : {
          name: true
        }
      };
      return Restangular.all('users').customPOST( {email: email, entities: entities}, 'schools_for' );
    },

    newConfirmationEmail: function( email ){
      var params = {
        user: {
          email: email
        }
      };
      return Restangular.all('users').customPOST( params, 'confirmation' );
    }
  };

  return User;
}]);
