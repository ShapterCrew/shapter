angular.module('directives.confirmAlert', [])
.factory('ConfirmAlertFactory', [ '$rootScope', '$timeout', function($rootScope, $timeout) {
  var possibleMsgs = [
    {
    fr: "Merci!",
    en: "Thanks!"
  }, {
    en: "Super!"
  }, {
    en: "Nice!"
  }, {
    en: "Champion!"
  }, {
    fr: "Solide!",
    en: "Solid!"
  }, {
    fr: "Zbeulah!",
    en: "Great!"
  }, {
    en: "#Swag"
  }, {
    en: "Bravo!"
  }
  ];
  var confirmAlert = {};

  confirmAlert.showMsg = function(msg) {
    if (!msg) {
      msg = possibleMsgs[Math.floor(Math.random() * possibleMsgs.length)];
    }
    if (msg == "success") {
      $rootScope.confirmAlert = {
        show: true,
        img: "assets/img/success.png"
      };
      $timeout(function() {
        $rootScope.confirmAlert.show = false;
      }, 1500);
      return true;
    }
    $rootScope.confirmAlert = {
      show: true,
      text: msg
    };
    $timeout(function() {
      $rootScope.confirmAlert.show = false;
    }, 700);
    return true;
  };

  return confirmAlert;
}])

.directive('shConfirmAlert', [function(){
  return {
    restrict: 'E',
    scope: {
    },
    controller: 'ConfirmAlertCtrl',
    templateUrl: 'directives/confirmAlert/confirmAlert.tpl.html'
  };
}])

.controller('ConfirmAlertCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.confirmAlert = {};
  $rootScope.$watch('confirmAlert', function(newValue, oldValue) {
    $scope.confirmAlert = newValue;
  });
}]);
/*
   .provider('confirmAlert', function() {
   $get: ['$http', '$compile', '$timeout', function('$http', '$compile', '$timeout') {
   var confirmAlert = {};

   confirmAlert.open = function(options) {
   var ctrlInstance, ctrlLocals = {};
   var scope = options.scope;
   ctrlLocals.$scope = scope;
   ctrlInstance = $controller('confirmAlertCtrl', ctrlLocals);
   var tpl = $http.get('directives/confirmAlert/confirmAlert.tpl.html').then(function(result) {
   return result.data;
   });
   $compile( tpl )( $rootScope );


   };

   return confirmAlert;
   }]
   })
   */
