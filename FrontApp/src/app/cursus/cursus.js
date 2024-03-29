angular.module( 'shapter.cursus', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'services.appText'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'cursus', {
    url: '/schools/:schoolId/cursus',
    views: {
      "main": {
        controller: 'CursusCtrl',
        templateUrl: 'cursus/cursus.tpl.html'
      }
    },
    data:{ pageTitle: 'Cursus' },
    resolve: {
      schools: ['School', function( School ){
        return School.index();
      }],
      currentUser: ['security', function( security ){
        return security.requestCurrentUser();
      }]
    }
  });
}])

.directive('shCursusBox', [function(){
  return {
    restrict: 'E',
    scope: {
      box: '=',
      displaySchool: '='
    },
    templateUrl: 'cursus/cursusBox.tpl.html',
    controller: 'CursusBoxCtrl'
  };
}])

.controller('CursusBoxCtrl', ['$scope', 'AppText', function( $scope, AppText ){
  $scope.AppText = AppText;
  $scope.remove = function(){
  };
}])

.controller('CursusCtrl', ['$scope', 'schools', 'Tag', 'Item', '$stateParams', '$filter', 'AppText', 'followBoxModalFactory', 'School', '$location', 'ProfileBox', 'security', 'User', function( $scope, schools, Tag, Item, $stateParams, $filter, AppText, followBoxModalFactory, School, $location, ProfileBox, security, User ){


  $scope.loadBoxes = function(){
    User.profileBoxes( security.currentUser.id ).then( function( response ){
      $scope.boxes = response.map( function( box ){
        if( !box.tags.length ){
          box.tags = [{
            category: 'school',
            id: security.currentUser.schools[0].id,
            name: ''
          }];
        }
        box.unfolded = true;
        return box;
      });
    });
    ProfileBox.getRecommendations().then( function( response ){
      $scope.boxesRecommendations = response;
    });
  };

  if( $location.search().state == 'addingBox' && !$scope.newBox ){
    $location.search( 'state', null );
  }

  $scope.removeBox = function( box ){
    box.remove().then( function(){
      $scope.boxes.splice( $scope.boxes.indexOf( box ), 1);
      $scope.loadBoxes();
    });
  };

  $scope.removeItemFromBox = function( box, item ){
    box.removeItem( [item.id] ).then( function(){
      box.items.splice( box.items.indexOf( item ), 1 );
    });
  };

  $scope.displayCreateBox = function(){
    $scope.createBoxMode = true;
    $scope.boxToCreate = {};
  };

  $scope.cancelCreateBox = function(){
    $scope.createBoxMode = false;
  };

  $scope.createBox = function(){
    ProfileBox.create( $scope.boxToCreate).then( function(){
      $scope.loadBoxes();
      $scope.cancelCreateBox();
    });
  };

  if( security.isAuthenticated() ){
    $scope.loadBoxes();
  }

  School.index().then( function( schools ){
    $scope.schools = schools.schools;
  });

  $scope.security = security;
  $scope.$location = $location;
  $scope.alerts = [];
  $scope.AppText = AppText;
  $scope.firstOfASchool = function( $index, boxes, box ){
    return $index === 0 || ($filter( 'filter' )( boxes[ $index - 1 ].tags,  {category: 'school'})[0].id != $filter( 'filter' )( box.tags,  {category: 'school'})[0].id);
  };


  $scope.$on('InternshipCreated', function(){
    $scope.loadBoxes();
  });

  $scope.getItemsTypeahead = function( string ){
    return Item.typeahead( string, [ security.currentUser.schools[0].id ], 20 ).then( function( response ){
      return response.items;
    });
  };

  $scope.addClassFromTag = function( box ){
    box.addItems( [ box.typedItem.id ] ).then( function(){
      $scope.loadBoxes();
    });
  };

  $scope.$on('login success', function(){
    $scope.loadBoxes();
  });

  $scope.addTagsFromBox = function( box ){
    $scope.newBox.tags = box.specificTags;
    $scope.loadSuggestionItems( $scope.newBox );
  };

  $scope.displayAddSuggestion = function( suggestion ){
    $location.search('state', 'addingBox');
    var boxes = $filter('splitSharedTags')(suggestion.boxes);
    $scope.newBox = {
      type: 'classes',
      name: suggestion ? suggestion.name : '',
      commonTags: boxes[0].commonTags,
      boxes: boxes, 
      tags: [],
      items: []
    };
    $scope.loadSuggestionItems( $scope.newBox );
  };

  $scope.hideRecos = function( item ){
    item.displayRecos = false;
  };

  $scope.toggleDisplayRecos = function( item ){
    item.displayRecos = !item.displayRecos;
    if( item.displayRecos === true ){
      item.loadComments().then( function( response ){
        angular.forEach( response.comments, function( comment ){
          if( comment.author.id == security.currentUser.id ){
            item.current_user_comment = comment;
            item.current_comments_count += 1;
          }
        });
      });
    }
  };

  $scope.displayAddInternship = function( suggestion ){
    $location.search('state', 'addingInternship' );
  };

  $scope.loadSuggestionItems = function( box ){
    var getIdsList = function( tags ){
      return tags.map( function( tag ){
        return tag.id;
      }).reduce( function( oldVal, newVal ){
        if( !!newVal ){
          oldVal.push( newVal );
        }
        return oldVal;
      }, []);
    };
    box.itemsLoading = true;
    var tags = box.commonTags || [];
    angular.forEach( box.tags, function( tag ){
      if( !!tag && !!tag.id ){
        tags.push( box.tag );
      }
    });
    Item.getListFromTags( getIdsList(tags), true ).then( function( response ){
      box.itemsLoading = false;
      box.items = response.items;
    });
  };

  $scope.displayEditBox = function( box ){
    box.editMode = true;
    box.new_name = box.name;
    box.new_start_date = box.start_date;
    box.new_end_date = box.end_date;
  };

  $scope.cancelEditBox = function( box ){
    box.editMode = false;
  };

  $scope.editBox = function( box ){
    box.put().then( function(){
      $scope.loadBoxes();
    });
  };

  $scope.cancelAddBox = function(){
    $location.search('state', null);
    delete $scope.newBox;
  };

  $scope.toRecommendations = function(){
    $location.search('state', 'boxesRecommendations');
    delete $scope.newBox;
  };

  $scope.addBox = function(){
    ProfileBox.create( $filter( 'formatBoxToPost' )( $scope.newBox ) ).then( function( box ){
      $scope.loadBoxes();
      $scope.toRecommendations();
    }, function( err ){
      if( err.data.error == 'start_date is missing, end_date is missing' || err.data.error == 'start_date is missing' || err.data.error == 'end_date is missing' ){
        $scope.alerts = [{
          type: 'danger',
          msg: AppText.cursus.pick_the_dates
        }];
      }
      else {
        $scope.alerts = [{
          type: 'danger',
          msg: AppText.system.there_was_an_error
        }];
      }
    });
  };

  $scope.getTypeahead = function( string ){
    var tag_ids = $scope.newBox ? [ $scope.newBox.school.id ] : [];
    return Tag.typeahead( string, tag_ids, 'item', 30, null ).then( function( response ){
      return response.tags;
    });
  };

  $scope.addTextTag = function(){
    $scope.newBox.tags = $scope.newBox.tags || [];
    $scope.newBox.tags.push( $scope.newBox.typedTag );
    $scope.newBox.typedTag = null;
  };

}])

.filter('formatBoxToPost', [function(){
  return function( newBox ){
    return {
      'name': newBox.name,
      'start_date': newBox.start_date,
      'end_date': newBox.end_date,
      'item_ids': newBox.items.length ? newBox.items.map( function( item ){
        return item.selected ? item : null;
      }).reduce( function( previousVal, currentVal ){
        out = previousVal;
        if( currentVal !== null ){
          out.push( currentVal.id );
        }
        return out;
      }, []) : null
    };
  };
}])

.factory('followBoxModalFactory', ['$modal', function( $modal ){
  return {
    openModal: function( tags, title ) {
      return $modal.open({
        templateUrl: 'cursus/selectBoxItemsModal.tpl.html',
        controller: 'SelectBoxItemsCtrl',
        windowClass: 'show',
        resolve: {
          title: function() {
            return title;
          },
          items: ['Item', function( Item ){
            return Item.getListFromTags( tags, true );
          }]
        }
      });
    }
  };
}])

.controller('SelectBoxItemsCtrl', ['$scope','items', 'title', '$modalInstance', 'AppText', function( $scope, items, title, $modalInstance, AppText ){
  $scope.box = {};
  $scope.AppText = AppText;
  $scope.close = $modalInstance.close;
  $scope.title = title;
  $scope.items = items.items;
  $scope.validate = function(){
  };
}])

.filter('splitSharedTags', [function(){
  var intersectTags = function(arr1, arr2){
    return arr1.filter(function(n) {
      return tagIsInArray( n, arr2 );
    });
  };
  var tagIsInArray = function( tag, array ){
    out = false;
    angular.forEach( array, function( arrayTag ){
      if ( arrayTag.id == tag.id ){
        out = true;
      }
    });
    return out;
  };
  var substractIntersection = function( array, intersection ){
    return array.map( function( tag ){
      return tagIsInArray( tag, intersection ) ? null : tag;
    }).reduce( function( oldVal, newVal ){
      if( !!newVal ){
        oldVal.push( newVal );
      }
      return oldVal;
    }, []);
  };
  return function( boxes ){
    var intersection = boxes.reduce( function( oldVal, newVal ){
      return intersectTags( oldVal, newVal.tags );
    }, boxes[0].tags);
    return boxes.map( function( box ){
      box.commonTags = intersection;
      box.specificTags = substractIntersection( box.tags, intersection );
      return box;
    });
  };
}]);
