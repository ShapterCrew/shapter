angular.module( 'resources.type', [
  'restangular'
])

.factory( 'Type', ['Restangular', function( Restangular ){

  var types = [];
  var Type = {
    getAll: function(){
      return Restangular.all( 'types' ).post();
    }
  };

  return Type;
}]);

