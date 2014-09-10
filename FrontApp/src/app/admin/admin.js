angular.module( 'shapter.admin', [
  'ui.router',
  'ui.bootstrap',
  'security'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'admin', {
    url: '/admin',
    reloadOnSearch: false,
    views: {
      "main": {
        controller: 'AdminCtrl',
        templateUrl: 'admin/admin.tpl.html'
      }
    },
    data:{ pageTitle: 'Admin' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAdminUser,
      schools: ['Tag', function( Tag ){
        return Tag.getSchools();
      }]
    }
  });
}])

.controller('AdminCtrl', [ '$scope', '$rootScope', 'schools', 'Tag', 'Item', '$filter', 'User', function( $scope, $rootScope, schools, Tag, Item, $filter, User){

  $scope.Tag = Tag;
  $scope.nav = 'tagItems';
  $scope.schools = schools;
  $scope.categories = $rootScope.item_categories;

  /* {{{ add students  */

  $scope.newStudent = {
    email: '',
    schoolTags: []
  };

  $scope.addAuthorization = function(){
    User.addSignupPermission( $scope.newStudent.email, [ $scope.newStudent.schoolTag ] );
  };
  /* }}} */

  // {{{ associate tag and items 
  $scope.activeItems = [];
  $scope.step = '1';
  $scope.initializeTagItems = function(){
    angular.forEach( $scope.activeItems, function( item ){
      item.selected = false;
    });
    $scope.activeItems = [];
    $scope.activeTags = [];
    $scope.activeItemsToUpdate = [];
  };

  $scope.initializeTagItems();

  $scope.selectTagItemsSchool = function(){
    $scope.initializeTagItems();
    $scope.schoolTagsLoading = true;
    Tag.getSchoolTags( $scope.tagItemsSchool.id ).then( function( response ){
      $scope.schoolTagsLoading = false;
      $scope.schoolTags = response.tags;
    }, function(){
      $scope.schoolTagsLoading = false;
    });
  };

  $scope.addItemToUpdate = function( tag ){
    Item.getListFromTags( [tag.id], true ).then( function( response ){
      if (response.number_of_results != 1){
        alert("Tape le nom d'un cours !");
      }
      else {
        $scope.activeItemsToUpdate.splice(0,0,response.items[0]);
      }
    });
    $scope.tagItemToUpdate = null;
  };

  $scope.removeItemToUpdate = function( index ){
    $scope.activeItemsToUpdate.splice( index, 1 );
  };

  $scope.addTagItemsTag = function( tag ){
    $scope.activeTags.push( tag );
    $scope.updateTagItems();
    $scope.tagItemstagToAdd = null;
  };

  $scope.removeTagItemsTag = function( index ){
    $scope.activeTags.splice( index, 1 );
    $scope.updateTagItems();
  };

  $scope.updateTagItems = function(){
    $scope.activeItems = [];
    var tags = [ $scope.tagItemsSchool.id ];
    angular.forEach( $scope.activeTags, function( tag ){
      tags.push( tag.id );
    });
    Item.getListFromTags( tags, true ).then( function( response ){
      $scope.nbItems = response.number_of_results;
      $scope.activeItems = response.items;
    }); 
  };

  $scope.toggleItem = function( item ){
    item.selected = !item.selected;
  };

  $scope.toggleToBeRemoved = function( tag ){
    if( $scope.tagsToBeRemoved.indexOf( tag ) > -1 ){
      $scope.tagsToBeRemoved.splice( $scope.tagsToBeRemoved.indexOf( tag ), 1 );
    }
    else {
      $scope.tagsToBeRemoved.push( tag );
    }
  };

  $scope.toggleToBeAdded = function( index ){
    $scope.tagsToBeAdded.splice( index, 1 );
  };

  $scope.newTagToBeAdded = function( tag ){
    $scope.tagsToBeAdded.push( tag );
    $scope.tagToBeAdded = null;
  };

  $scope.$watch( function(){
    return $scope.activeItems;
  }, function(){

    $scope.tagsToBeAdded = [];
    $scope.tagsToBeRemoved = [];

    $scope.selectedItems = $filter( 'filter' )( $scope.activeItems, {selected: true} );
    $scope.intersection = $filter( 'getIntersection' )( $scope.selectedItems );

  }, true );

  $scope.addTagItems = function( category, tagName ){
    if( tagName ){
      $scope.tagsToBeAdded.push({
        name: tagName,
        category: category
      });
    }
  };

  $scope.removeTagItemsToBeAdded = function( tag ){
    $scope.tagsToBeAdded.splice( $scope.tagsToBeAdded.indexOf( tag ), 1 );
  };

  $scope.validate = function(){
    var item_ids = [];
    var tagsToAdd = [];
    var tagsToRemove = [];

    angular.forEach( $scope.selectedItems, function( item ){
      item_ids.push( item.id );
    });

    angular.forEach( $scope.tagsToBeAdded, function( tag ){
      var formatedTag = {
        tag_name: tag.name,
        category: tag.category
      };
      tagsToAdd.push( formatedTag );
    });

    angular.forEach( $scope.tagsToBeRemoved, function( tag ){
      var formatedTag = {
        tag_name: tag.name,
        category: tag.category 
      };
      tagsToRemove.push( formatedTag );
    });

    if( tagsToAdd.length && item_ids.length ){
      Item.addTags( item_ids, tagsToAdd ).then( function(){
        alert('tags added');
      }, function(){
        alert('error adding tags');
      });
    }
    if( tagsToRemove.length && item_ids.length ){
      Item.removeTags( item_ids, tagsToRemove ).then( function(){
        alert('tags removed');
      }, function(){
        alert('error removing tags');
      });
    }
  };

  // }}}

  // {{{ add Items 

  $scope.selectAddItemsSchool = function(){
    $scope.initialize();

    $scope.schoolTagsLoading = true;
    Tag.getSchoolTags( $scope.newItemSchool.id ).then( function( response ){
      $scope.schoolTags = response.tags;
      $scope.schoolTagsLoading = false;
    }, function(){
      $scope.schoolTagsLoading = false;
    });
  };

  $scope.initialize = function(){
    $scope.displayNewItemsSuccess = false;
    $scope.displayNewItemsFail = false;
    $scope.newItems = [
      {
      name: ''
    }
    ];
    $scope.newItemTags = [];
    $scope.newItemTags.push({
      tag_name: $scope.newItemSchool.name,
      category: 'school'
    });
  };

  $scope.addNewItem = function(){
    $scope.newItems.push({
      name: '' 
    });
  };

  $scope.addTag = function( category, tagName ){
    if( !!tagName ){
      $scope.newItemTags.push({
        tag_name: tagName,
        category: category
      });
      tagToAdd = '';
      tagMissing = false;
    }
  };

  $scope.removeTag = function( tag ){
    if( tag.code == 'school' ){
      $scope.initialize();
    }
    var idx = $scope.newItemTags.indexOf( tag );
    $scope.newItemTags.splice( idx, 1 );
  };

  $scope.updateItems = function() {
    angular.forEach($scope.activeItemsToUpdate, function(item){
      item.edit();
    });
    $scope.activeItemsToUpdate = [];
    alert( 'Les cours ont bien été modifiés !');
  };

  $scope.createItem = function(){
    $scope.newItemsLoading = true;
    $scope.displayNewItemsSuccess = false;
    $scope.displayNewItemsFail = false;
    return Item.createTaggedItems( $scope.newItems, $scope.newItemTags ).then( function(){
      Tag.loadSchoolTags( $scope.newItemSchool.id );
      $scope.newItemsLoading = false;
      $scope.displayNewItemsSuccess = true;
      $scope.displayNewItemsFail = false;
      alert( 'les cours ont bien été ajoutés');

      $scope.newItems = [{
        name: ''
      }];

    }, function(){

      $scope.newItemsLoading = false;
      $scope.displayNewItemsFail = true;
      $scope.displayNewItemsSuccess = false;

    });
  };
  // }}}
}])

.filter( 'notAlreadyThereName', [function(){
  return function( input, list ){
    var out = [];
    angular.forEach( input, function( item ){
      var present = false;
      angular.forEach( list, function( listItem ){
        if( listItem.tag_name == item.name ){
          present = true;
        }
      });
      if( present === false ){
        out.push( item );
      }
    });
    return out;
  };
}])

.filter( 'getIntersection', [function(){

  return function( input ){
    var out = [];
    if( input.length === 0 ){
      out = [];
    }
    else if ( input.length == 1 ){
      out = input[0].tags;
    }
    else {
      out = input[ 0 ].tags;
      angular.forEach( input, function( item ){
        newOut = [];
        angular.forEach( item.tags, function( tag ){
          angular.forEach( out, function( outTag ){
            if( outTag.id == tag.id ){
              newOut.push( tag );
            }
          });
        });
        out = newOut;
      });
    }
    return out;
  };
}]);
