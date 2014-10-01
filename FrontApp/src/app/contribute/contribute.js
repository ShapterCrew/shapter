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

.controller( 'ItemCommentsModalCtrl', ['$scope', 'item', '$modalInstance', 'AppText', function( $scope, item, $modalInstance, AppText ){

  $scope.AppText = AppText;
  $scope.item = item;
  $scope.close = function(){
    $modalInstance.close();
  };
}])

.controller( 'ContributeCtrl', ['$scope', 'User', 'Analytics', 'editDiagramFactory', 'security', 'ItemCommentsModal', '$location', 'AppText', '$stateParams', function( $scope, User, Analytics, editDiagramFactory, security, ItemCommentsModal, $location, AppText, $stateParams ){

  $scope.AppText = AppText;
  $scope.loading = true;

  $scope.$on('login success', function(){
    $scope.batchIndex = -1;
    $scope.fullyLoaded = false;
    $scope.loadMoreItems();
  });

  $scope.editDiagramFactory = editDiagramFactory;
  $scope.security = security;
  $scope.ItemCommentsModal = ItemCommentsModal;

  $scope.batchSize = 3;
  $scope.batchIndex = -1;
  $scope.fullyLoaded = false;

  $scope.commentPipe = {
    commentable_items: []
  };

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
