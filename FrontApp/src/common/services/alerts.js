angular.module('services.alerts', [])

.factory('alerts', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    var alerts = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alerts.add = function(type, msg) {
      alertMsg = {
        'type': type,
        'msg': msg,
        close: function() {
          alerts.closeAlert(this);
        }
      };  
      $rootScope.alerts.push(alertMsg);
    };

    alerts.closeAlert = function(alertMsg) {
      alerts.closeAlertIdx($rootScope.alerts.indexOf(alertMsg));
    };

    alerts.closeAlertIdx = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    alerts.clear = function() {
      $rootScope.alerts = [];
    };

    return alerts;
}]);
