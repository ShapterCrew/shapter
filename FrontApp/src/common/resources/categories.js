angular.module('resources.category', [
  'restangular',
  'security.service'
])

.factory('Category', ['Restangular', '$rootScope', function( Restangular, $rootScope){
  var Category = {

    for_items: function(){
      var params = {
        entities: {
          category: {
            code: true
          }
        }
      };
      return Restangular.all('categories').customPOST( params, 'for_items' );
    },
    for_internships: function(){
      var params = {
        entities: {
          category: {
            code: true
          }
        }
      };
      return Restangular.all('categories').customPOST( params, 'for_internships' );
    }

  };

  return Category;
}])

.run([ 'Category', '$rootScope', function( Category, $rootScope ){

  Category.for_items().then( function( response ){
    $rootScope.item_categories = response.categories;
  });

  Category.for_internships().then( function( response ){
    console.log( response.categories );
    $rootScope.internship_categories = response.categories;
  });

}]);

