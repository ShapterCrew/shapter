angular.module('services.localizedMessages', [
  'services.alerts'
])

.factory('localizedMessages', ['$interpolate', 'I18N.MESSAGES', '$filter', function ($interpolate, i18nmessages, $filter) {

  var handleNotFound = function (msg, msgKey) {
    return msg || '?' + msgKey + '?';
  };

  return {
    get : function (msgKey, interpolateParams) {
      var msg =  $filter( 'language' )( i18nmessages[msgKey] );
      if (msg) {
        return $interpolate(msg)(interpolateParams);
      } else {
        return handleNotFound(msg, msgKey);
      }
    }
  };
}]);
