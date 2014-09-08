angular.module('filters.orderByAccent', [])
.filter('orderByAccent', ['orderByFilter', '$parse', function(orderByFilter, $parse){

  return function (input, attr) {
    var get = $parse( attr );
    angular.forEach(input, function(item){

      if( get( item ) ){
        item.altName = get( item ) 
        .replace(/É/g, 'E')
        .replace(/Â/g, 'A')
        .replace(/Ê/g, 'E');
      }

    });

    return orderByFilter(input, 'altName');
  };

}]);
