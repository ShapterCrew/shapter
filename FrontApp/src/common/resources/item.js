angular.module('resources.item', [
  'restangular',
  'security.service',
  'resources.comment'

])

.factory('Item', ['Restangular', '$q', 'Comment', 'ConfirmAlertFactory', function( Restangular, $q, Comment, ConfirmAlertFactory ) {

  //********* Adding instance methods *************//


  var getComments = function( cb ){
    return Restangular.one('items', this.id).all('comments').post();
  };

  var loadTags = function(){
    var item = this;
    var params = {
      entities: {
        tag: {
          name: true,
          category: true,
          short_name: true
        },
        category: {
          code: true
        },
        item: {
          tags: true
        }
      }
    };
    return Restangular.one( 'items', item.id ).customPOST( params ).then( function( response ){
      item.tags = response.tags;
      return item;
    });
  };

  var loadFullItem = function() {
    var item = this;
    var params = {
      entities: {
        item: {
          "averaged_diagram": true,
          "comments": true,
          "comments_count": true,
          "constructor_users": false,
          "current_user_comments_count": true,
          "current_user_diagram": true,
          "current_user_has_diagram": true,
          "current_user_can_comment": true,
          "current_user_has_in_cart": true,
          "current_user_has_in_constructor": false,
          "current_user_subscribed": true,
          "diagrams_count": true,
          "documents_count": true,
          "follower_friends": false,
          "interested_users": false,
          "name": true,
          "requires_comment_score": false,
          "shared_docs": true,
          "subscribers": true,
          "syllabus": true,
          "tags": true,
          "this_user_has_comment": true,
          "this_user_has_diagram": true,
          "user_can_view_comments": true
        },
        tag: {
          name: true,
          category: true,
          short_name: true
        },
        comment: {
          "author": true,
          "content": true,
          "created_at": true,
          "current_user_likes": true,
          "dislikers_count": true,
          "item": false,
          "likers_count": true,
          "updated_at": true,
          "is_alien": true,
          "alien_schools": true,
          "context": true
        },
        user: {
          "firstname": true,
          "lastname": true,
          "image": true
        },
        diagram: {
          "author": true,
          "front_values": true,
          "item": false
        },
        shared_doc: {
          "author": true,
          "description": true,
          "dlCount": true,
          "file": true,
          "name": true
        }
      }
    };
    return Restangular.one('items', this.id).customPOST( params ).then( function( response ){
      item.loading = false;

      if( response.comments !== undefined ){
        item.unauthorized = false;
        item.comments = Restangular.restangularizeCollection( item, response.comments, 'comments', {});
      }
      else {
        item.unauthorized = true;
      }

      item.name = response.name;
      item.comments_count = response.comments_count;
      item.diagrams_count = response.diagrams_count;
      item.documents_count = response.documents_count;
      item.syllabus = response.syllabus;
      item.tags = response.tags;
      item.documents_count = response.documents_count;
      item.avg_work_score = response.avg_work_score;
      item.avg_quality_score = response.avg_quality_score;
      item.subscribers = response.subscribers;
      item.current_user_comments_count = response.current_user_comments_count;
      item.current_user_has_in_cart = response.current_user_has_in_cart;
      item.current_user_subscribed = response.current_user_subscribed;
      item.current_user_has_in_constructor = response.current_user_has_in_constructor;
      item.averaged_diagram = response.averaged_diagram;
      item.diagrams_count = response.diagrams_count;
      item.newDocument = {};
      item.is_fb_friend = response.is_fb_friend;
      item.this_user_comment = response.this_user_comment;
      item.documents = response.shared_docs;
      item.this_user_has_diagram = response.this_user_has_diagram;
      item.current_user_has_diagram = response.current_user_has_diagram;

      if( item.newComment === undefined ){
        item.newComment = {
          content: ''
        };
      }

      return item;
    });
  };


  var loadDiagram = function(){
    var item = this;
    var params = {
      entities: {
        diagram: {
          front_values: true
        },
        item: {
          averaged_diagram: true,
          this_user_has_diagram: true,
          current_user_has_diagram: true
        }
      }
    };

    return Restangular.one( 'items', this.id ).customPOST( params ).then( function( response ){
      item.averaged_diagram = response.averaged_diagram;
      item.current_user_has_diagram = response.current_user_has_diagram;
      item.this_user_has_diagram = response.this_user_has_diagram;
    });
  };

  var loadSyllabus = function() {
    var item = this;
    var params = {
      entities: {
        item: {
          syllabus: true
        }
      }
    };
    
    return Restangular.one( 'items', this.id ).customPOST( params ).then( function( response ){
      item.syllabus = response.syllabus;
    });
  };

  var currentUserDiag = function(){
    var item = this;
    var params = {
      entities: {
        item: {
          current_user_diagram: true,
          current_user_has_diagram: true
        },
        diagram: {
          front_values: true,
          author: true
        }
      }
    };
    return Restangular.one( 'items', this.id ).customPOST( params ).then( function( response ){
      console.log( response );
      item.current_user_diagram = response.current_user_diagram;
      item.current_user_has_diagram = response.current_user_has_diagram;
      return item;
    });
  };

  var loadUserDiagram = function(){
    var item = this;
    var params = {
      entities: {
        item: {
          current_user_diagram: true,
          this_user_has_diagram: true,
          current_user_has_diagram: true
        },
        diagram: {
          front_values: true
        }
      }
    };
    return Restangular.one( 'items', this.id ).customPOST( params ).then( function( response ){
      item.current_user_diagram = response.current_user_diagram;
      item.current_user_has_diagram = response.current_user_has_diagram;

      return item;
    });
  };

  var loadComments = function(){
    var params = {
      entities: {
        comment: {
          author: true,
          content: true,
          created_at: true,
          current_user_likes: true,
          dislikers_count: true,
          likers_count: true,
          current_user_dislikes: true,
          is_alien: true,
          alien_schools: true,
          context: true
        },
        user: {
          firstname: true,
          lastname: true,
          image: true
        },
        tag: {
          name: true
        }
      }
    };
    var item = this;
    return Restangular.one( "items", this.id ).customPOST(params, 'comments').then( function( response ){
      item.comments = Restangular.restangularizeCollection( item, response, 'comments', {});
      if( item.newComment === undefined ){
        item.newComment = {
          content: ''
        };
      }
      return item;
    });
  };


  var subscribe = function() {
    if( this.current_user_subscribed === false ){
      mixpanel.people.increment( "items_count", 1 );
    }
    this.current_user_subscribed = true;
    //add the item to the current user's followed courses
    return Restangular.one('items', this.id).customPOST({}, 'subscribe').then(function(response) {
      //behave.track("subscribe item", {"item": response.id});
      return response;
    });
  };

  var updateSyllabus = function(syllabus) {
    return Restangular.one( 'items', this.id ).customPUT( {syllabus: syllabus}, 'update_syllabus' );
  };

  var unsubscribe = function() {
    if( this.current_user_subscribed === true ){
      mixpanel.people.increment( "items_count", -1 );
    }
    this.current_user_subscribed = false;
    //remove the item from the current user's followed courses
    return Restangular.one('items', this.id).customPOST({}, 'unsubscribe').then(function(response) {
      //behave.track("unsubscribe item");
      return response;
    });
  };

  // check type of an object
  toType = function( obj ) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  var addNewTag = function( tag ){
    if( toType( tag ) == 'object' ){
      return Restangular.one( 'items', this.id ).one( 'tags', tag.name ).put();
    }
    else if( toType( tag ) == 'string' ){
      return Restangular.one( 'items', this.id ).one( 'tags', tag ).put();
    }
  };

  var removeTag = function( tag ){
    return Restangular.one( 'items', this.id ).one( 'tags', tag.id ).remove();
  };

  var toggleCart = function(){
    if( this.current_user_has_in_cart ){
      this.uncart();
    }
    else{
      this.cart();
    }
  };
  var cart = function(){
    this.current_user_has_in_cart = true;
    return Restangular.one( 'items', this.id ).customPOST({}, 'cart');
  };

  var uncart = function(){
    this.current_user_has_in_cart = false;
    return Restangular.one( 'items', this.id ).customPOST({}, 'uncart');
  };

  var constructor = function(){
    this.current_user_has_in_constructor = true;
    this.current_user_has_in_cart = false;
    this.current_user_subscribed = false;
    this.uncart();
    this.unsubscribe();
    return Restangular.one( 'items', this.id ).customPOST({}, 'constructor').then( function( response ){
    }, function(x){
    });
  };

  var unconstructor = function(){
    this.current_user_has_in_constructor = false;
    return Restangular.one( 'items', this.id ).customPOST({}, 'unconstructor');
  };

  var editDiagram = function( values ){
    var item = this;
    return Restangular.one( 'items', this.id ).customPUT({ values: values }, 'mydiagram').then(function( response ) {
      //behave.track("edit a diagram", {"item": response.item.id});
      ConfirmAlertFactory.showMsg();
      return response;
    });
  };

  var avgDiag = function(){
    var item = this;
    return Restangular.one( 'items', this.id ).customPOST( null, 'avgDiag' ).then( function( response ){
      var averaged_diagram = [];
      angular.forEach( response, function( value, key ){
        if( value && value.value ){
          averaged_diagram.push( value );
        }
      });
      item.averaged_diagram = averaged_diagram;
      return item;
    });
  };

  var getDocs = function(){
    var params = {
      entities: {
        shared_doc: {
          "author": true,
          "description": true,
          "dlCount": true,
          "file": true,
          "name": true
        },
        user: {
          firstname: true,
          lastname: true,
          image: true
        }

      }
    };
    var item = this;
    return Restangular.one( 'items', this.id ).customPOST( params, 'sharedDocs').then( function( response ){
      item.documents = response.shared_docs;
      return item;
    });
  };

  var postDoc = function( sharedDoc ){
    return Restangular.one( 'items', this.id ).customPOST({sharedDoc: sharedDoc}, 'sharedDocs/create');
  };

  var removeDoc = function( doc, index ){
    var item = this;
    return Restangular.one( 'items', this.id).one('sharedDocs', doc.id).remove().then( function(){
      item.documents.splice( index, 1 );
    });
  };

  // adding custom behavior
  var extendItem = function(item) {
    return angular.extend(item, {
      editDiagram: editDiagram,
      getComments: getComments,
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      loadFullItem: loadFullItem,
      addNewTag: addNewTag,
      removeTag: removeTag,
      cart: cart,
      uncart: uncart,
      updateSyllabus: updateSyllabus,
      constructor: constructor,
      unconstructor: unconstructor,
      avgDiag: avgDiag,
      getDocs: getDocs,
      postDoc: postDoc,
      removeDoc: removeDoc,
      loadComments: loadComments,
      toggleCart: toggleCart,
      loadUserDiagram: loadUserDiagram,
      loadDiagram: loadDiagram,
      loadSyllabus: loadSyllabus, 
      loadTags: loadTags,
      currentUserDiag: currentUserDiag

    });
  };

  Restangular.extendModel('items', function (item) {
    return extendItem(item);
  });

  //********* Adding functions to Item *************//
  var Item = Restangular.all('items');

  var createTaggedItems = function( items, tags ){
    var itemNames = [];
    angular.forEach( items, function( item ){
      if( item.name ){
        itemNames.push( item.name );
      }
    });

    return Restangular.all( 'items' ).customPOST({ item_names: itemNames, tags: tags }, 'create_with_tags' );

  };

  Item.createTaggedItems = createTaggedItems;
  Item.getListFromTags = function( tags, total, batchSize, index, quality_filter, cart_only ) {
    var entities = {
      item: {
        "averaged_diagram": true,
        "comments_count": true,
        "diagrams_count": true,
        "documents_count": true,
        "name": true,
        "tags": true,
        "current_user_can_comment": true,
        "current_user_has_in_cart": true,
        "current_user_subscribed": true,
        "current_user_comments_count": true,
        "current_user_diagram": true,
        "follower_friends": false
      },
      tag: {
        name: true,
        category: true,
        short_name: true
      },
      user: {
        firstname: true,
        lastname: true
      }
    };
    /*
    // total : [ bool ] -> load up to 1500 items, ignores index and batch
    // batchSize: size of the batches of items to recieve ( ex 15 by 15 )
    // index: index of the batch. ex with 2 : items 15 to 29
    */

    //from a list of tags, return the list of items having these tags
    var n_start, n_stop;

    if( total === true ){
      n_start = 0;
      n_stop = 1500;
    }
    else if( index !== undefined && batchSize !== undefined ){
      n_start = batchSize * index;
      n_stop = batchSize * (index + 1) - 1;
    }
    else {
      n_start = 0;
      n_stop = 15;
    }
    if ( tags.length > 0 ){

      return Restangular.all('items').customPOST({entities: entities, filter: tags, n_start: n_start, n_stop: n_stop, quality_filter: quality_filter, cart_only: cart_only}, 'filter').then( function( response ){
        response.items = Restangular.restangularizeCollection( null , response.items, 'items', {});
        return response;
      });
    }
    else {
      return $q.when([]);
    }
  };

  Item.signupFunnel = function( exclude ){
    return Restangular.all( 'items' ).customPOST({ exl: exclude, limit: 7 }, 'suggested');
  };

  Item.get = function( id ){
    return Restangular.one( 'items', id ).post();
  };

  Item.countDl = function( itemId, docId ){
    return Restangular.one( 'items', itemId ).one( 'sharedDocs', docId ).customPOST( {}, 'countDl' );
  };

  Item.load = function( id ){
    var params = {
      entities: {
        item: {
          "averaged_diagram": true,
          "comments": true,
          "comments_count": true,
          "constructor_users": false,
          "current_user_can_comment": true,
          "current_user_comments_count": true,
          "current_user_diagram": true,
          "current_user_has_in_cart": true,
          "current_user_has_in_constructor": true,
          "current_user_subscribed": true,
          "current_user_has_diagram": true,
          "diagrams_count": true,
          "documents_count": true,
          "follower_friends": false,
          "interested_users": false,
          "name": true,
          "requires_comment_score": false,
          "shared_docs": false,
          "subscribers": true,
          "syllabus": true,
          "tags": true,
          "this_user_has_comment": true,
          "this_user_has_diagram": true,
          "user_can_view_comments": true
        },
        tag: {
          name: true,
          category: true,
          short_name: true
        },
        comment: {
          "author": true,
          "content": true,
          "created_at": true,
          "current_user_likes": true,
          "dislikers_count": true,
          "item": false,
          "likers_count": true,
          "updated_at": true,
          "is_alien": true,
          "alien_schools": true,
          "context": true
        },
        user: {
          "firstname": true,
          "lastname": true,
          "image": true
        },
        diagram: {
          "author": true,
          "front_values": true,
          "item": false
        }
      }
    };
    return Restangular.one( 'items', id ).customPOST( params ).then( function( response ){

      var item =  Restangular.restangularizeElement( null, response, 'items', {});

      item.comments = Restangular.restangularizeCollection( item, response.comments, 'comments', {});
      if( item.newComment === undefined ){
        item.newComment = {
          content: ''
        };
      }

      return item;
    }, function( e ){
      console.log( e );
    });
  };

  Item.addTags = function( item_ids, tags ){
    return Restangular.all('items').all('tags').customPOST({ item_ids: item_ids, tags: tags }, 'add');
  };

  Item.removeTags = function( item_ids, tags ){
    return Restangular.all('items').all('tags').customPOST({ item_ids: item_ids, tags: tags }, 'delete');
  };



  return Item;
}]);
