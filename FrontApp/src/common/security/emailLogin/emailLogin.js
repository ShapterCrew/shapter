angular.module('security.emailLogin', [
  'services.localizedMessages',
  'LocalStorageModule'
])

.controller('EmailLoginCtrl', ['Restangular', 'Item', '$scope', 'security', '$window', 'AppText', 'User', '$modalInstance', '$location', 'localStorageService', 'reason', '$timeout', '$stateParams', function(Restangular, Item, $scope, security, $window, AppText, User, $modalInstance, $location, localStorageService, reason, $timeout, $stateParams ){

  $scope.close = $modalInstance.close;
  $scope.AppText = AppText;
  $scope.loginUser = {};
  $scope.signupUser = {};
  $scope.reasonAlerts = [];

  if( reason ){
    $scope.reasonAlerts.push({
      msg: AppText.security[ reason ],
      type: 'info'
    });
  }

  if( security.isAuthenticated() && !security.isConfirmedStudent()){
    if( $stateParams.schoolId ){
      $location.path("/schools/" + $stateParams.schoolId + '/confirmationSent').search('item', null);
    }
    else {
      $location.path('/confirmationSent').search('item', null);
    }
    $timeout( function(){
      $scope.close();
    });
  }

  $scope.facebookConnect = function(){
    localStorageService.set('back url', $location.url());
    $window.location.href = "/api/v1/users/auth/facebook";
  };

  $scope.checkEmail = function(){
    User.schools_for( $scope.signupUser.email ).then( function( response ){
      if( response.schools.length === 0){
        $scope.emailSignupAlerts = [
          {
          type: 'warning',
          msg: {
            en: 'Your email seems to be valid but doesn\'t authenticates you as student from on of our campuses. If your campus uses Shapter, make sure you use your campus email',
            fr: 'Ton email semble être valide mais ne nous permet pas de t\'identifier comme étudiant d\'un campus de Shapter. Si tu possèdes un email d\'un tel campus, utilises plutôt celui-là'
          }
        }
        ];
      }
      else {
        $scope.emailSignupAlerts = [
          {
          msg: {
            en: 'your email grant you editing rights for the following campuses on Shapter : ',
            fr: 'Ton email t\'identifie comme étudiant des campus suivants sur Shapter:'
          },
          type: 'success',
          schools: response.schools
        }
        ];
      }
    });
  };

  $scope.login = function() {
    return security.login($scope.loginUser.email, $scope.loginUser.password);
  };

  $scope.authError = null;

  $scope.signup = function(){
    $scope.pendingRequest = true;
    security.signup($scope.loginUser.email, $scope.loginUser.password, $scope.loginUser.firstname, $scope.loginUser.lastname).then(function(data){
      $scope.pendingRequest = false;
    });
  };

  $scope.showForgotPassword = function() {
    security.showForgotPassword();
  };

}]);
