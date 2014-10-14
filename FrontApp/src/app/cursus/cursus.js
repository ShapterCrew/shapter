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
      boxes: ['User', 'security', '$q', function( User, security, $q ){
        return security.requestCurrentUser().then( function( user ){
          return User.profileBoxes( security.currentUser.id );
        });
      }],
      boxesRecommandations: ['ProfileBox', function( ProfileBox ){
        return ProfileBox.getRecommandations();
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
}])

.controller('CursusCtrl', ['$scope', 'schools', 'Tag', 'Item', '$stateParams', '$filter', 'AppText', 'followBoxModalFactory', 'School', '$location', 'ProfileBox', 'boxes', 'boxesRecommandations', function( $scope, schools, Tag, Item, $stateParams, $filter, AppText, followBoxModalFactory, School, $location, ProfileBox, boxes, boxesRecommandations ){

  $scope.boxes = boxes.map( function( box ){
    box.unfolded = true;
    return box;
  });
  $scope.boxesRecommandations = boxesRecommandations;
  School.index().then( function( schools ){
    $scope.schools = schools.schools;
  });

  $location.search('state', null);
  $scope.$location = $location;
  $scope.alerts = [];
  $scope.AppText = AppText;
  $scope.firstOfASchool = function( $index, boxes, box ){
    return $index === 0 || ($filter( 'filter' )( boxes[ $index - 1 ].tags,  {category: 'school'})[0].id != $filter( 'filter' )( box.tags,  {category: 'school'})[0].id);
  };

  $scope.$on('InternshipCreated', function(){
    ProfileBox.getRecommandations().then( function( response ){
      $scope.boxesRecommandations = boxesRecommandations;
    });
    User.profileBoxes( security.currentUser.id ).then( function( boxes ){
      $scope.boxes = boxes.map( function( box ){
        box.unfolded = true;
        return box;
      });
    });
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

  $scope.cancelAddBox = function(){
    $location.search('state', null);
    delete $scope.newBox;
  };

  $scope.addBox = function(){
    ProfileBox.create( $filter( 'formatBoxToPost' )( $scope.newBox ) ).then( function( box ){
      ProfileBox.getRecommandations().then( function( response ){
        $scope.boxesRecommandations = boxesRecommandations;
      });
      box.unfolded = true;
      $scope.boxes.push( box );
      $scope.alerts.push({
        type: 'info',
        msg: 'L\'étape a bien été ajoutée à ton parcours !'
      });
      $scope.cancelAddBox();
    }, function(){
      $scope.alerts.push({
        type: 'danger',
        msg: 'Il y a eu une erreur'
      });
      $scope.cancelAddBox();
    });
  };

  $scope.getTypeahead = function( string ){
    var tag_ids = [ $scope.newBox.school.id ];
    return Tag.typeahead( string, tag_ids, 'item', 30, null ).then( function( response ){
      return response.tags;
    });
  };

  $scope.addTextTag = function(){
    $scope.newBox.tags = $scope.newBox.tags || [];
    $scope.newBox.tags.push( $scope.newBox.typedTag );
    $scope.newBox.typedTag = null;
  };

  $scope.internshipsSuggestions = [{
    name: 'Stage ouvrier',
    type: 'Stage ouvrier',
    tags: ['54101eab4d61631e55b61600']
  }, {
    name: 'Stage d\'application',
    type: 'internship',
    tags: ['54101eab4d61631e55b61600']
  }, {
    name: 'Travail de fin d\'études',
    type: 'internship',
    tags: ['54101eab4d61631e55b61600']
  }];

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
