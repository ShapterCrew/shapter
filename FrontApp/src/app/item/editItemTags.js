angular.module('editItemTags', [])

.factory('EditItemTagsModalFactory', ['$modal', function($modal){
  var EditItemTagsModalFactory = {
    openModal: function( item ){
      item.loading = true;
      return $modal.open({
        templateUrl: 'item/editItemTagsModal.tpl.html',
        windowClass: 'show',
        controller: 'EditItemTagsModalCtrl',
        resolve: {
          item: function(){
            return item.loadTags();
          }
        }
      });
    }
  };

  return EditItemTagsModalFactory;
}])

.controller('EditItemTagsModalCtrl', ['$scope', '$rootScope', 'item', 'AppText', '$modalInstance', 'Tag', 'Item', function($scope, $rootScope, item, AppText, $modalInstance, Tag, Item){
  item.loading = false;

  $scope.AppText = AppText;
  $scope.schoolTags = [];
  loadSchoolsTags = function(){
  angular.forEach( item.tags, function( tag ){
    if( tag.category == 'school' ){
      Tag.getSchoolTags( tag.id ).then( function( response ){
        $scope.schoolTags = $scope.schoolTags.concat( response.tags );
      });
    }
  });
  };

  loadSchoolsTags();

  $scope.close = $modalInstance.close;

  $scope.item = item;
  angular.forEach( item.tags, function( tag ){
    tag.status = "idle";
  });

  $scope.categories = $rootScope.categories;

  $scope.validate = function(){
    var item_ids = [
      item.id
    ];
    var tagsToAdd = [];
    var tagsToRemove = [];

    angular.forEach( item.tags, function( tag ){
      var formatedTag = {
          tag_name: tag.name,
          category: tag.category
      };
      if( tag.status == 'toBeRemoved'){
        tagsToRemove.push( formatedTag );
      }
      else if( tag.status == 'new' ){
        tagsToAdd.push( formatedTag );
      }
    });

    Item.addTags( item_ids, tagsToAdd );
    Item.removeTags( item_ids, tagsToRemove ).then( function(){
      var newTags = [];
      angular.forEach( item.tags, function( tag, index ){
        if( tag.status != 'toBeRemoved'){
          newTags.push( tag );
        }
      });
      item.tags = newTags;
    });
    loadSchoolsTags();
    $scope.close();
  };

  $scope.removeTag = function( tag ){
    if( tag.status == "toBeRemoved" ){
      tag.status = "idle";
    }
    else if( tag.status == "new" ){
      tag.status = 'idle';
      var idx = item.tags.indexOf( tag );
      item.tags.splice( idx, 1 );
    }
    else if( tag.status == "idle" ){
      tag.status = "toBeRemoved";
    }
  };

  $scope.addTag = function( category, tagName ){
    var tag = {};
    tag.status = "new";
    tag.name = tagName;
    tag.category = category;
    item.tags.push( tag );
    tagName = '';
  };

}])

.directive('shEditItemTagsModal', [ 'EditItemTagsModalFactory', function( EditItemTagsModalFactory ){
  return {
    restrict: 'A',
    scope: {
      item: '=shEditItemTagsModal'
    },
    link: function( scope, elem, attr ){
      elem.bind('click', function( e ){
        e.stopPropagation();
        EditItemTagsModalFactory.openModal( scope.item );
      });
    }
  };
}]);

