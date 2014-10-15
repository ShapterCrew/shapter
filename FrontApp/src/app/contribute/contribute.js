angular.module( 'shapter.contribute', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'resources.user',
  'services.appText'
])

.config(['$stateProvider', function config( $stateProvider ) {
  $stateProvider.state( 'schoolContribute', {
    url: '/schools/:schoolId/contribute',
    views: {
      "main": {
        controller: 'ContributeCtrl',
        templateUrl: 'contribute/contribute.tpl.html'
      }
    },
    data:{ pageTitle: 'Contribuer' }
  }).state( 'contribute', {
    url: '/contribute',
    views: {
      "main": {
        controller: 'ContributeCtrl',
        templateUrl: 'contribute/contribute.tpl.html'
      }
    },
    data:{ pageTitle: 'Contribuer' }
  });
}])

.factory( 'ItemCommentsModal', ['$modal', function( $modal ){
  return {
    openModal: function( item ){
      return $modal.open({
        templateUrl: 'contribute/itemCommentsModal.tpl.html',
        windowClass: 'show',
        controller: 'ItemCommentsModalCtrl',
        resolve: {
          item: function(){
            return item.loadComments();
          }
        }
      });
    }
  };
}])

.directive('shItemContribute', [function(){
  return {
    restrict: 'AE',
    templateUrl: 'contribute/itemContributeModule.tpl.html',
    controller: 'ItemConributeModuleCtrl',
    scope: {
      item: '=',
      next: '&',
      previous: '&'
    }
  };
}])

.filter('ownComments', ['security', function( security ){
  return function( comments ){
    if( comments ){
      return comments.map( function( comment ){
        return comment.author.id == security.currentUser.id ? comment : null;
      }).reduce( function( oldVal, newVal ){
        if( newVal !== null ){
          oldVal.push( newVal );
        }
      }, []);
    }
    else {
      return [];
    }
  };
}])

.controller('ItemConributeModuleCtrl', ['$scope', 'AppText', 'security', 'Analytics', function( $scope, AppText, security, Analytics ){
  $scope.security = security;
  $scope.AppText = AppText;
  $scope.reco = function( item, score ){
    item.current_user_reco_score = score;
    item.reco_score( score );
    Analytics.reco( item, score );
  };
}])

.controller( 'ItemCommentsModalCtrl', ['$scope', 'item', '$modalInstance', 'AppText', function( $scope, item, $modalInstance, AppText ){

  $scope.AppText = AppText;
  $scope.item = item;
  $scope.close = function(){
    $modalInstance.close();
  };
}])

.controller( 'ContributeCtrl', ['$scope', 'User', 'Analytics', 'editDiagramFactory', 'security', 'ItemCommentsModal', '$location', 'AppText', '$stateParams', '$timeout', function( $scope, User, Analytics, editDiagramFactory, security, ItemCommentsModal, $location, AppText, $stateParams, $timeout){

  $scope.AppText = AppText;
  $scope.loading = true;

  $scope.$on('Comment Added', function(){
    $scope.next();
  });

  $scope.test = function(){
    console.log( 'haha' );
  };

  $scope.$on('login success', function(){
    $scope.batchIndex = -1;
    $scope.fullyLoaded = false;
    $scope.loadMoreItems();
  });

  $scope.editDiagramFactory = editDiagramFactory;
  $scope.security = security;
  $scope.ItemCommentsModal = ItemCommentsModal;

  $scope.commentPipe = {
    commentable_items: []
  };

  $scope.next = function(){
    $scope.animationState = 'next';
    $timeout( function(){
      var idx = $scope.commentPipe.commentable_items.indexOf( $scope.activeItem );
      if( idx < $scope.commentPipe.commentable_items.length - 1 ){
        $scope.activeItem = $scope.commentPipe.commentable_items[ idx + 1 ];
      }
      else {
        User.commentPipe( $scope.commentPipe.commentable_items.length, 1, $stateParams.schoolId ).then( function( response ){
          if( response.commentable_items.length ){
            $scope.commentPipe.commentable_items.push( response.commentable_items[0]);
            $scope.activeItem = $scope.commentPipe.commentable_items[ $scope.commentPipe.commentable_items.length - 1 ];
          }
          else {
            $scope.activeItem = $scope.commentPipe.commentable_items[ 0 ];
          }
        });
      }
    });
    Analytics.contributeNav('next');
  };

  $scope.previous = function(){
    $scope.animationState = 'previous';
    $timeout( function(){
      var idx = $scope.commentPipe.commentable_items.indexOf( $scope.activeItem );
      if( idx > 0 ){
        $scope.activeItem = $scope.commentPipe.commentable_items[ idx - 1 ];
      }
    });
    Analytics.contributeNav('previous');
  };

  $scope.next();

  /*
     $scope.batchSize = 3;
     $scope.batchIndex = -1;
     $scope.fullyLoaded = false;
     $scope.loadMoreItems = function(){
     $scope.loading = true;

     $scope.batchIndex += 1;
     var n_start = $scope.batchIndex * $scope.batchSize;

     if( $scope.fullyLoaded === false){
     var n = $scope.batchSize;
     var id = $stateParams.schoolId ? $stateParams.schoolId : null;

     User.commentPipe( n_start, n, id ).then( function( response ){
     $scope.loading = false;
     if( response.commentable_items.length === 0 ){
     $scope.fullyLoaded = true;
     }

     angular.forEach( response.commentable_items, function( item, key ){
     $scope.commentPipe.commentable_items.push( item );
     });

     }, function( x ){
     $scope.loading = false;
     console.log( x );
     });
     }
     else {
     $scope.loading = false;
     }
     };
     $scope.loadMoreItems();
     */


  $scope.editDiagram = function( item ){
    item.loadFullItem().then( function(){
      editDiagramFactory.openModal( item );
    });
  };

  $scope.navSf = function(){
    var schoolId = $stateParams.schoolId ? $stateParams.schoolId : ( security.currentUser.schools.length ? security.currentUser.schools[0].id : null);
    $location.path( '/schools/' + schoolId + '/signupFunnel' );
  };

  $scope.displayComments = false;

  Analytics.contribute();
}])

.filter( 'ownComment', [function(){
  return function( comments, id ){
    var out = [];
    angular.forEach( comments, function( comment ){
      if( comment.author.id == id ){
        out.push( comment );
      }
    });
    return out;
  };
}]);
