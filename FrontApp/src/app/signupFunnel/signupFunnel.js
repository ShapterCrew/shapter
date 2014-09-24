angular.module( 'shapter.signupFunnel', [
  'ui.router',
  'ui.bootstrap',
  'security'
])

.config(['$stateProvider', 'securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'signupFunnel', {
    url: '/schools/:schoolId/signupFunnel',
    views: {
      "main": {
        controller: 'SignupFunnelCtrl',
        templateUrl: 'signupFunnel/signupFunnel.tpl.html'
      }
    },
    data:{ pageTitle: 'Renseigne ton cursus' },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller( 'SignupFunnelCtrl', ['$scope', '$timeout', 'Item', '$location', 'User', 'Analytics', 'ConfirmAlertFactory', 'security', '$stateParams', 'AppText', function( $scope, $timeout, Item, $location, User, Analytics, ConfirmAlertFactory, security, $stateParams, AppText){

  $scope.AppText = AppText;

  if( $location.search().fromApp ){
    $scope.initialState = false;
    $location.search( 'fromApp', null );
  }
  else {
    $scope.hideNav = true;
    $scope.initialState = false;
  }

  Analytics.signupFunnel();

  var exclude = [];
  $scope.step = 0;
  $scope.nb_of_steps = null;

  $scope.finish = function(){
    var id = security.currentUser.schools.length ? security.currentUser.schools[0].id : null;
    if( id ){
      $location.path( "/schools/" + id + "/contribute" );
    }
  };


  $scope.nextStep = function(){
    $scope.step += 1;
    if( $scope.nb_of_steps !== null && $scope.step > $scope.nb_of_steps ){
      ConfirmAlertFactory.showMsg("success");
      behave.track("end signupfunnel");
      return $scope.finish();
    }
    else {
      $scope.loadingItems = true;

      User.signupFunnel( $scope.step, $stateParams.schoolId ).then( function( response ){
        $scope.stepName = response.name;
        $scope.loadingItems = false;
        $scope.nb_of_steps = response.total_nb_of_steps;
        $scope.items = response.items;
        if( $scope.nb_of_steps === 0 ){
          $scope.noSF = true;
        }
      }, function( error ){
        console.log( error );
        $scope.noSF = true;
      });
    }
  };

  $scope.previousStep = function(){
    if( $scope.step > 1 ){
      $scope.step -= 1;
      $scope.loadingItems = true;


      User.signupFunnel( $scope.step, $stateParams.schoolId ).then( function( response ){
        $scope.stepName = response.name;
        $scope.loadingItems = false;
        $scope.nb_of_steps = response.total_nb_of_steps;
        $scope.items = response.items;
        if( $scope.nb_of_steps === 0 ){
          $scope.noSF = true;
        }

      }, function( error ){
        console.log( error );
        $scope.noSF = true;
      });
    }
  };


  if( security.isConfirmedStudent() ){
    $scope.nextStep();
  }

  $scope.selectItem = function( item ){
    if( item.current_user_subscribed ){
      item.unsubscribe().then( function(){
        Analytics.unsubscribeFromItem( item );
      });
      item.current_user_subscribed = false;
      $scope.displayThumb = false;
      $scope.displayOh = true;
      $timeout( function(){
        $scope.displayOh = false;
      }, 700);
    }
    else{
      item.subscribe().then( function(){
        Analytics.subscribeToItem( item );
      });
      item.current_user_subscribed = true;
      $scope.displayOh = false;
      $scope.displayThumb = true;
      $timeout( function(){
        $scope.displayThumb = false;
      }, 700);
    }
  };

}]);

