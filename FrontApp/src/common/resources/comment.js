angular.module('resources.comment', [])

.factory('Comment', ['Restangular', 'Analytics', 'ConfirmAlertFactory', '$q', function(Restangular, Analytics, ConfirmAlertFactory, $q) {
  Comment = Restangular.all('comments');

  var  entities =  {
    comment: {
      "author": true,
      "content": true,
      "created_at": true,
      "current_user_likes": true,
      "dislikers_count": true,
      "item": true,
      "likers_count": true,
      "updated_at": true,
      "is_alien": true,
      "alien_schools": true
    },
    user: {
      "firstname": true,
      "lastname": true,
      "image": true
    },
    item: {
      "name": true
    }
  };

  var like = function() {
    //like the current comment
    return Restangular.one('items', this.item_id).one('comments', this.id).customPUT({score:1, entities: entities }, 'score').then(function(response) {
      return response;
    });
  };

  var dislike = function() {
    //dislike the current comment
    return Restangular.one('items', this.item_id).one('comments', this.id).customPUT({score:-1, entities: entities}, 'score').then(function(response) {
      return response;
    });
  };

  var unlike = function() {
    //delete the like/dislike on the current comment from current user
    return Restangular.one('items', this.item_id).one('comments', this.id).customPUT({score:0, entities: entities}, 'score').then(function(response) {
      return response;
    });
  };

  var edit = function(){
    var comment = this;
    if( this.newContent ){
      return Restangular.one( 'items', this.item_id ).one( 'comments', this.id ).customPUT({
        comment: {
          content: this.newContent
        },
        entities: entities
      }).then( function( response ){
        comment.displayEditComment = false;
        comment.content = response.content;
        comment.updated_at = response.updated_at;
      });
    }
  };

  var likeruser = {
    entities: {
      user: {
        image: true,
        firstname: true,
        lastname: true
      }
    }
  };

  var getLikers = function(){
    return Restangular.one( 'items', this.item_id ).one( 'comments', this.id ).customPOST( likeruser, 'likers');
  };

  var getDislikers = function(){
    return Restangular.one( 'items', this.item_id ).one( 'comments', this.id ).customPOST( likeruser, 'dislikers');
  };

  var loadLikers = function(){
    var comment = this;
    return this.getLikers().then( function( response ){
      comment.likers = response.likers;
      return response;
    });
  };

  var loadDislikers = function(){
    var comment = this;
    return this.getDislikers().then( function( response ){
      comment.dislikers = response.dislikers;
      return response;
    });
  };

  // adding custom behavior
  var extendComment = function(model) {
    model.like = like;
    model.dislike = dislike;
    model.unlike = unlike;
    model.edit = edit;
    model.getLikers = getLikers;
    model.getDislikers = getDislikers;
    model.loadLikers = loadLikers;
    model.loadDislikers = loadDislikers;
    return model;
  };

  Restangular.extendModel('comments', function (model) {
    return extendComment(model);
  });

  Comment.customRemove = function( comment ){
    return Restangular.one( 'items', comment.item_id ).one( 'comments', comment.id ).remove();
  };

  Comment.newComment = function(item_id, newComment) {
    var entities = {
      comment: {
        "author": true,
        "content": true,
        "created_at": true,
        "current_user_likes": true,
        "dislikers_count": true,
        "item": true,
        "likers_count": true,
        "updated_at": true,
        "context": true,
        "is_alien": true,
        "alien_schools": true
      },
      user: {
        "firstname": true,
        "lastname": true,
        "image": true
      },
      tag: {
        "name": true
      }
    };
    return Restangular.one('items', item_id).all('comments').customPOST({comment: newComment, entities: entities}, "create").then( function( response ){
      Analytics.addComment( newComment, "browse" );
      //behave.track("comment", {"item": item_id});
      ConfirmAlertFactory.showMsg();
      return response;
    });
  };

  return Comment;
}]);
