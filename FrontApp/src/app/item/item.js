angular.module('shapter.item', [
  'angularFileUpload',
  'services.appText',
  'ui.router',
  'editItemTags'
])

.config(['$stateProvider', function( $stateProvider ){
  $stateProvider.state( 'item', {
    url: '/item/:itemId',
    views: {
      "main": {
        controller: 'ItemCtrl',
        templateUrl: 'item/item.tpl.html'
      }
    },
    data: { pageTitle: 'Cours' },
    resolve: {
      item: ['Item', '$stateParams', function( Item, $stateParams ){
        return Item.load( $stateParams.itemId );
      }]
    }
  });
}])

.controller( 'ItemCtrl', ['$scope', 'Item', 'item', 'AppText', 'editDiagramFactory', '$location', function( $scope, Item, item, AppText, editDiagramFactory, $location ){

  $scope.navToStudent = function( id ){
    $location.path('student/' + id );
  };

  $scope.nbDisplayStudents = 20;
  $scope.editDiagramFactory = editDiagramFactory;
  $scope.nav = 'comments';
  $scope.AppText = AppText;
  $scope.item = item;

  $scope.navDocs = function(){
    item.getDocs();
    $scope.nav = 'documents';
  };

  $scope.hideAddComment = function( item ){
    item.displayAddComment = false;
  };

  $scope.uploadFile = function() {
    $scope.item.postDoc( $scope.item.newDocument ).then( function( response ){
      $scope.item.getDocs();
      Analytics.uploadFile( $scope.item );
    }, function( x ){
      console.log( x );
    }); 
  };

  $scope.trackDownload = function( item, doc ){
    Item.countDl( item.id, doc.id );
    Analytics.downloadFile( item, doc );
  };
}])

.run( ['$location', '$rootScope', 'itemFactory', function( $location, $rootScope, itemFactory ){
  console.log( 'item run running !');
  $rootScope.$watch( function(){
    return $location.search().item;
  }, function( newVal, oldVal ){
    if( !!newVal ){
      var there = false;
      angular.forEach( itemFactory.lastModals, function( lastModal ){
        if( lastModal.item.id == newVal && !!lastModal.item.loadFullItem && there === false ){
          there = true;
          return itemFactory.openModal( lastModal.item, lastModal.itemsList, lastModal.loadMoreItems, lastModal.numberOfItems );
        }
      });
      if( there === false ){
        return itemFactory.openModalById( newVal );
      }
    }
  });
}])

.factory('itemFactory', [ '$modal', '$location', 'Item', function($modal, $location, Item) {
  return {
    lastModals: [],
    openModalById: function( id ) {
      var modal =  $modal.open({
        templateUrl: 'item/itemModal.tpl.html',
        controller: 'itemModalCtrl',
        windowClass: 'show',
        resolve: {
          item: function() {
            return Item.load( id );
          },
          itemsList: function() {
            return null;
          },
          loadMoreItems: function(){
            return function(){};
          },
          numberOfItems: function(){
            return 1;
          }
        }
      });
      modal.result.then( function(){
        $location.search('item', null);
      }, function(){
        $location.search('item', null);
      });
    },
    openModal: function( item, itemsList, loadMoreItems, numberOfItems ) {
      item.loading = true;
      var modal =  $modal.open({
        templateUrl: 'item/itemModal.tpl.html',
        controller: 'itemModalCtrl',
        windowClass: 'show',
        resolve: {
          item: function() {
            return item.loadFullItem();
          },
          itemsList: function() {
            return itemsList;
          },
          loadMoreItems: function(){
            return loadMoreItems;
          },
          numberOfItems: function(){
            return numberOfItems || itemsList.length;
          }
        }
      });
      modal.result.then( function( close ){
        item.open = false;
        console.log( close );
        if( !!close ){
          $location.search('item', null);
        }
      }, function(){
        item.open = false;
        $location.search('item', null);
      });
    }
  };
}])

.directive('shItemModal', ['itemFactory', '$location', 'Analytics', function(itemFactory, $location, Analytics) {
  return {
    scope : {
      item: '=shItemModal',
      itemsList: '=',
      numberOfItems: '=',
      loadMoreItems: '&'
    },
    link: function (scope, element, attr) {
      element.addClass("pointer");
      element.bind('click', function (event) {
        if( scope.item.loading !== true ){
          scope.$apply( function(){
            itemFactory.lastModals.unshift({ item: scope.item, itemsList: scope.itemsList, loadMoreItems: scope.loadMoreItems, numberOfItems: scope.numberOfItems});

            // in case id was already in url for some reason
            $location.search( 'item', null );

            // add the id in url
            $location.search( 'item', scope.item.id );

            Analytics.selectItem( scope.item );
          });

        }
        else {
          console.log( 'was loading' );
        }
      });
    }
  };
}])


.factory('editDiagramFactory', [ '$modal', '$location', function($modal, $location) {
  return {
    openModal: function(item) {
      return $modal.open({
        templateUrl: 'item/editDiagram.tpl.html',
        controller: 'editDiagramCtrl',
        windowClass: 'show',
        resolve: {
          item: function() {
            return item.loadUserDiagram();
          }
        }

      });
    }
  };
}])

.controller('editDiagramCtrl', ['$scope', 'item', '$modalInstance', 'AppText', function( $scope, item, $modalInstance, AppText ){
  $scope.AppText = AppText;
  $scope.item = item;
  $scope.close = $modalInstance.close;
}])

.controller('itemModalCtrl', ['$scope', 'item', 'itemsList', 'loadMoreItems',  'numberOfItems', '$window', '$modalInstance', '$location', '$q', 'Item', 'Analytics', 'security', 'editDiagramFactory', '$upload', '$http', 'AppText', 'itemFactory', '$stateParams', '$rootScope', '$filter', function($scope, item, itemsList, loadMoreItems, numberOfItems, $window, $modalInstance, $location, $q, Item, Analytics, security, editDiagramFactory, $upload, $http, AppText, itemFactory, $stateParams, $rootScope, $filter ) {

  $scope.$apply( function(){
    item.loading = false;
  });
  $scope.$rootScope = $rootScope;
  item.open = true;
  $scope.AppText = AppText;
  $scope.displayUploadDocument = false;
  $scope.security = security;
  $scope.item = item;
  $scope.itemsList = itemsList || [ item ];
  $scope.currentIndex = $scope.itemsList.indexOf( item );
  $scope.nbDisplayStudents = 10;
  $scope.editDiagramFactory = editDiagramFactory;
  $scope.display = 'comments';
  $scope.numberOfItems = numberOfItems;
  $location.search( 'item', item.id );

  $scope.$on('login success', function(){
    item.loadComments();
  });

  var nav = function( path ){
    $location.path( path ).search( 'filter', null ).search( 'categories', null).search('item', null);
  };
  $scope.campusAuthenticationNav = function(){
    var schoolId;
    if( $stateParams.schoolId ){
      nav("/schools/" + $stateParams.schoolId + "/campusAuthentication");
    }
    else if ( security.isConfirmedStudent() ){
      schoolId = security.currentUser.schools[0].id;
      nav("/schools/" + schoolId + "/campusAuthentication");
    }
    else {
      nav("/campusAuthentication");
    }
  };

  facebookData = {
    permalink: '#/start?item=' + item.id,
    type: "default",
    title: $filter( 'language' )( AppText.item.facebook_need_comment_title ) + ' ' + item.name + $filter( 'language' )( AppText.system.question_mark ),
    description: $filter( 'language' )( AppText.item.facebook_need_comment_description )
  };

  $scope.facebookData = null;
  try {
    $scope.facebookData = $filter('shareEncoding')(btoa( JSON.stringify( facebookData )));
  } 
  catch(err) {
    console.log( err );
  }

  $scope.$watch( function(){
    return $location.search().item;
  }, function( newVal, oldVal ){

    if( !!newVal && !!oldVal && newVal != oldVal ){
      $modalInstance.close( false );
    }
    if( !newVal ){
      try {
        $modalInstance.close( true );
      }
      catch( err ){
      }
    }
  });

  if( $scope.display == 'documents' ){
    item.getDocs();
  }

  $scope.toggleItem = function( item, state ){
    switch( state ){
      case 'constructor': 
        if( item.current_user_has_in_constructor === true ){
        item.unconstructor();
        Analytics.removeFromConstructor( item );
      }
      else {
        item.constructor();
        Analytics.addToConstructor( item );
      }
      break;
      case 'cart' : 
        if( item.current_user_has_in_cart === true){
        item.uncart();
        Analytics.removeFromCart( item );
      }
      else {
        item.cart();
        Analytics.addToCart( item );
      }
      break;
      case 'subscribed' : 
        if( item.current_user_subscribed === true){
        item.unsubscribe();
        Analytics.unsubscribeFromItem( item );
      }
      else {
        item.subscribe();
        Analytics.subscribeToItem( item );
      }
      break;
    }
  };

  if( $scope.item.current_user_comments_count === 0 && $scope.item.current_user_subscribed === true){
    $scope.item.displayAddComment = false;
  }
  else{ 
    $scope.item.displayAddComment = false;
  }

  $scope.hideAddComment = function(){
    $scope.item.displayAddComment = false;
  };

  $scope.close = function() {
    $modalInstance.close( true );
    Analytics.closeItem( $scope.item );
  };

  var loadNewModal = function( item ) {

    itemFactory.lastModals.unshift({ item: item, itemsList: $scope.itemsList, loadMoreItems: $scope.loadMoreItems, numberOfItems: $scope.numberOfItems });
    $location.search( 'item', item.id );

    /*
       var loadItem = item.loadFullItem();
       var allPromise = $q.all([loadItem]);
       allPromise.then(function() {
       $scope.item = item;
       if( $scope.display == 'documents' ){
       item.getDocs();
       }
       });
       $scope.currentIndex = $scope.itemsList.indexOf( item );
       */
  };

  $scope.previous = function() {
    $scope.currentIndex = $scope.itemsList.indexOf($scope.item);
    if ($scope.currentIndex === 0) {
      loadNewModal($scope.itemsList[$scope.itemsList.length - 1]);
    }
    else {
      loadNewModal($scope.itemsList[$scope.currentIndex - 1]);
    }
    Analytics.previousItem();
  };

  $scope.next = function() {
    $scope.currentIndex = $scope.itemsList.indexOf($scope.item);
    if ($scope.currentIndex == $scope.numberOfItems - 1) {
      loadNewModal($scope.itemsList[0]);
    }
    else if( $scope.currentIndex == $scope.itemsList.length - 1 && $scope.currentIndex < $scope.numberOfItems - 1 ){
      loadMoreItems().then( function( response ){
        if( response === true ){
          $scope.next();
          return;
        }
      });
    }
    else {
      loadNewModal($scope.itemsList[$scope.currentIndex + 1]);
    }
    Analytics.nextItem();
  };

  $scope.navStudent = function( id ){
    if( !!$stateParams.schoolId ){
      $location.path("/schools/" + $stateParams.schoolId + "/student/" + id ).search('filter', null);
    }
    else {
      $location.path("/student/" + id ).search('filter', null);
    }
    $scope.close();
  };

  $scope.uploadFile = function() {
    $scope.item.postDoc( $scope.item.newDocument ).then( function( response ){
      $scope.item.getDocs();
      Analytics.uploadFile( $scope.item );
    }, function( x ){
      console.log( x );
    }); 
  };

  $scope.trackDownload = function( item, doc ){
    Item.countDl( item.id, doc.id );
    Analytics.downloadFile( item, doc );
  };

}])

.directive( 'shUpdateItemSyllabus', [function(){
  return {
    restrict: 'A',
    scope: {
      item: '='
    },
    templateUrl: 'item/updateSyllabus.tpl.html',
    controller: 'UpdateItemSyllabusCtrl'
  };
}])

.controller( 'UpdateItemSyllabusCtrl', ['$scope', 'Item', 'AppText', '$filter', 'Analytics', function($scope, Comment, AppText, $filter, Analytics ){

  $scope.item.newSyllabus = $scope.item.newSyllabus ? $scope.item.newSyllabus : $scope.item.syllabus;
  $scope.AppText = AppText;
  $scope.alerts = [];

  $scope.removeAlert = function( index ){
    $scope.alerts.splice( index, 1 );
  };

  $scope.cancelUpdateSyllabus = function() {
    $scope.item.newSyllabus = $scope.item.syllabus;
    $scope.item.updatingSyllabus = false;
  };

  $scope.updateItemSyllabus = function() {
    $scope.item.updateSyllabus( $scope.item.newSyllabus ).then( function( response ){
      $scope.item.syllabus = $scope.item.newSyllabus;
      $scope.item.updatingSyllabus = false;
      Analytics.editSyllabus( $scope.item );
    }, function(x){
      console.log( x );
      $scope.alerts.push({
        msg: $filter( 'language' )( AppText.item.problem )
      });
    });
  };

}])

.filter('reverse', function() {
  return function(items) {
    return items ? items.slice().reverse() : [];
  };
})

.filter('textCut', [function(){
  return function(input, limit, all) {
    if (input) {
      return all ? input : input.slice(0, limit);
    }
    else {
      return null;
    }
  };
}]);
