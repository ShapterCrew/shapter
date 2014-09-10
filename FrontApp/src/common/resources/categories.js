angular.module('resources.category', [
  'restangular',
  'security.service'
])

.factory('Category', ['Restangular', '$rootScope', function( Restangular, $rootScope){
  var Category = {

    list: function(){
      var params = {
        entities: {
          category: {
            code: true
          }
        }
      };
      return Restangular.all('categories').customPOST( params );
    }
  };

  return Category;
}])

.run([ 'Category', '$rootScope', function( Category, $rootScope ){

  Category.list().then( function( response ){
    $rootScope.categories = response.categories;
  });

}]);

