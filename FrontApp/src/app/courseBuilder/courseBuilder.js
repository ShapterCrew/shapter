angular.module( 'shapter.courseBuilder', [
  'ui.router',
  'ui.bootstrap',
  'resources.user',
  'resources.tag',
  'security'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'courseBuilder', {
    url: '/courseBuilder',
    views: {
      "main": {
        controller: 'CourseBuilderCtrl',
        templateUrl: 'courseBuilder/courseBuilder.tpl.html'
      }
    },
    data:{ pageTitle: 'Mon Cursus' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireConfirmedStudent
    }
  });
}])

.controller( "CourseBuilderCtrl", [ '$scope', 'User', 'ManageCourseBuilder', '$filter', 'Tag', '$location', 'security', 'Analytics', function( $scope, User, ManageCoursesBuilder, $filter, Tag, $location, security, Analytics){

  $scope.sortedTypes = [];
  $scope.steps = [];
  $scope.activeStep = {};
  $scope.hide = {};
  $scope.hide.subscribedItems = true;
  $scope.activeStep = null;
  if( !$location.search().institution ){
    $location.search('institution', 0);
  }

  $scope.ManageCoursesBuilder = ManageCoursesBuilder;

  $scope.selectStep = function( step ){
    $scope.loadStep( step, step.key );
    $scope.activeStep = step;
  };

  var tagIsThere = function( tag, tags ){
    var out = {
      index : null,
      isThere : false
    };
    angular.forEach( tags, function( thereTag, key ){
      if( tag.id == thereTag.id ){
        out.isThere = true;
        out.index = key;
      }
    });
    return out;
  };

  $scope.stickersToDisplay = function( tag, altTag ){
    var list1 = $filter( 'displaySticker' )( tag.items, altTag );
    var list = $filter( 'subscribed_selected' )( list1, $scope.hide.subscribedItems );
    return list.length;
  };

  $scope.isTagged = function( item, tag ){
    var out = false;
    angular.forEach( item.tags, function( itemTag ){
      if( tag.id == itemTag.id ){
        out = true;
      }
    });
    return out;
  };

  var formatTypes = function( items ){
    var types = {};
    var outTypes = [];
    angular.forEach( items, function( item ){
      angular.forEach( item.tags, function( tag ){
        // type is already defined
        if( tag.type !== null && types[ tag.type ] !== undefined ){
          // tag is absent from type
          if( tagIsThere( tag, types[ tag.type ].tags ).isThere === false){
            if( tag.items ){
              tag.items.push( item );
            }
            else{
              tag.items = [ item ];
            }
            types[ tag.type ].tags.push( tag );
          }
          // tag is present in type 
          else{
            var thisTag = types[ tag.type ].tags[ tagIsThere( tag, types[ tag.type ].tags ).index ];
            if( thisTag.items ){
              if( thisTag.items.indexOf( item ) == -1 ){
                thisTag.items.push( item );
              }
            }
            else{
              thisTag.items = [ item ];
            }
          }
        }
        // type is new
        else if( tag.type !== null  && types[ tag.type ] === undefined ){
          tag.items = tag.items ? tag.items.push( item ) : [ item ];
          types[ tag.type ] = {
            tags: [ tag ]
          };
        }
      });
    });
    angular.forEach( types, function( type, key ){
      outTypes.push({
        name: key,
        tags: type.tags
      });
    });
    return outTypes;
  };


  var index;
  if( $location.search().institution !== null){
    index = $location.search().institution;
  }
  else{
    index = 0;
  }

  $scope.loadStep = function( step, key ){
    step.loading = true;
    User.constructorFunnel( key + 1 ).then( function( completeStep ){
      var formatedTypes = formatTypes( completeStep.items );
      var index1 = 0, index2 = 1;
      if( completeStep.types !== null && completeStep.types !== undefined){
        angular.forEach( formatedTypes, function(type, index){
          if( type.name == completeStep.types[0] ){
            index1 = index;
          }
          if( type.name == completeStep.types[1] ){
            index2 = index;
          }
        });
      }
      step.items = completeStep.items;
      step.formatedTypes = formatedTypes;
      step.selectedType = formatedTypes[ index1 ];
      step.selectedAltType = formatedTypes[ index2 ];
      step.loading = false;
    });
  };

  Tag.getConstructorFunnel( security.currentUser.schools[ index ] ).then( function( response ){
    angular.forEach( response.constructor_funnel, function( step, key ){
      $scope.steps.push({
        name: step.name,
        key: key
      });

    });
  });

  $scope.manageCourseBuilder = function( tag, altTag ){
    ManageCoursesBuilder.openModal( tag, altTag, $scope.activeStep.items );
    Analytics.manageCourseBuilder();
  };

}])

.controller( 'ManageCourseBuilderCtrl', ['$scope', 'tag', 'altTag', '$modalInstance', 'items', '$timeout', 'Analytics', function( $scope, tag, altTag, $modalInstance, items, $timeout, Analytics ){

  $scope.tag = tag;
  $scope.altTag = altTag;
  $scope.items = items;

  $scope.close = function(){
    $modalInstance.close();
  };

  $scope.dropped = function(item, list) {
    $scope.$apply( function(){
      switch( list ){
        case 'in_constructor':
          item.constructor();
        item.unsubscribe();
        item.uncart();
        item.current_user_has_in_constructor = true;
        item.current_user_subscribed = false;
        item.current_user_has_in_cart = false;
        Analytics.addToConstructor( item );
        break;
        case 'all' : 
          item.unconstructor();
        item.uncart();
        item.unsubscribe();
        item.current_user_has_in_constructor = false;
        item.current_user_subscribed = false;
        item.current_user_has_in_cart = false;
        break;
        case 'cart' : 
          item.unconstructor();
        item.cart();
        item.unsubscribe();
        item.current_user_has_in_constructor = false;
        item.current_user_subscribed = false;
        item.current_user_has_in_cart = true;
        Analytics.addToCart( item );
        break;
        case 'subscribed' : 
          item.unconstructor();
        item.uncart();
        item.subscribe();
        item.current_user_has_in_constructor = false;
        item.current_user_subscribed = true;
        item.current_user_has_in_cart = false;
        Analytics.subscribeToItem( item );
        break;
      }
    });
  };

  $scope.isTagged = function( item, tag ){
    var out = false;
    angular.forEach( item.tags, function( itemTag ){
      if( tag.id === undefined || tag.id == itemTag.id ){
        out = true;
      }
    });
    return out;
  };

}])

.filter('IsTaggedFilter', [function(){
  return function( items, tag ){
    var out = [];
    angular.forEach( items, function( item ){
      angular.forEach( item.tags, function( itemTag ){
        if( tag.id === undefined || ( tag.id !== undefined && tag.id == itemTag.id) ){
          out.push( item );
        }
      });
    });
    return out;
  };
}])

.factory('ManageCourseBuilder', ['$modal', function($modal) {
  return {
    openModal: function( tag, altTag, items ) {
      return $modal.open({
        templateUrl: 'courseBuilder/manageCourseBuilder.tpl.html',
        controller: 'ManageCourseBuilderCtrl',
        windowClass: 'show',
        resolve: {
          tag: function() {
            return tag;
          },
          altTag: function() {
            return altTag;
          },
          items: function(){
            return items;
          }
        }
      });
    }
  };
}])

.filter('subscribed_selected', [function(){
  return function( items, hideSubscribedItems ){
    var out = [];
    angular.forEach( items, function( item ){
      if( (item.current_user_subscribed === true && (hideSubscribedItems === false || hideSubscribedItems === undefined)) || item.current_user_has_in_constructor ){
        out.push( item );
      }
    });
    return out;
  };
}])

.filter('displaySticker', [function () {

  isTagged = function( item, tag ){
    var out = false;
    angular.forEach( item.tags, function( itemTag ){
      if( tag.id == itemTag.id ){
        out = true;
      }
    });
    return out;
  };

  return function( items, altTag ){
    var out = [];
    angular.forEach( items, function( item ){
      if( isTagged( item, altTag ) ){
        out.push( item );
      }
    });
    return out;
  };
}])

.factory('uuid', [function() {
  var svc = {
    New: function() {
      function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
    },

    empty: function() {
      return '00000000-0000-0000-0000-000000000000';
    }
  };
  return svc;
}])

.directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
  return {
    restrict: 'A',
    scope: {
      onDrop: '&'
    },
    link: function(scope, el, attrs, controller) {
      var id = angular.element(el).attr("id");
      if (!id) {
        id = uuid.New();
        angular.element(el).attr("id", id);
      }

      el.bind("dragover", function(e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        if(e.stopPropagation) { 
          e.stopPropagation(); 
        }

        e.dataTransfer.dropEffect = 'move';
        return false;
      });

      el.bind("dragenter", function(e) {
        //  angular.element(e.target).addClass('lvl-over');
      });

      el.bind("dragleave", function(e) {
        angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
      });

      el.bind("drop", function(e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        if (e.stopPropogation) {
          e.stopPropogation(); // Necessary. Allows us to drop.
        }

        var data = e.dataTransfer.getData("text");
        var dest = document.getElementById(id);
        var src = document.getElementById(data);

        scope.onDrop( { draggedItem : $rootScope.draggedItem });
      });

      $rootScope.$on("LVL-DRAG-START", function() {
        var el = document.getElementById(id);
        angular.element(el).addClass("lvl-target");
      });

      $rootScope.$on("LVL-DRAG-END", function() {
        var el = document.getElementById(id);
        angular.element(el).removeClass("lvl-target");
        angular.element(el).removeClass("lvl-over");
      });
    }
  };
}])

.directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
  return {
    restrict: 'A',
    scope: {
      draggableItem: '='
    },
    link: function(scope, el, attrs, controller) {
      angular.element(el).attr("draggable", "true");

      var id = angular.element(el).attr("id");
      if (!id) {
        id = uuid.New();
        angular.element(el).attr("id", id);
      }

      el.bind("dragstart", function(e) {
        e.dataTransfer.setData('text', id);
        $rootScope.draggedItem = scope.draggableItem;
        $rootScope.$emit("LVL-DRAG-START");
      });

      el.bind("dragend", function(e) {
        $rootScope.draggedItem = null;
        $rootScope.$emit("LVL-DRAG-END");
      });
    }
  };
}]);

