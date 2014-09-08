angular.module('resources.behave', [])

.factory('Behave', [function(){

  var Behave = {
    identify: function(user) {
      behave.identify(user.id, {name: user.firstname + " " + user.lastname});
    }
  };

  return Behave;

}]);

