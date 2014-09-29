angular.module('filters.orderByAccent', [])
.filter('orderByAccent', ['orderByFilter', '$parse', function(orderByFilter, $parse){

  return function (input, attr) {
    var get = $parse( attr );
    angular.forEach(input, function(item){

      if( get( item ) ){
        item.altName = get( item ) 
        .replace(/É/g, 'E')
        .replace(/È/g, 'E')
        .replace(/é/g, 'e')
        .replace(/è/g, 'e')
        .replace(/ë/g, 'e')
        .replace(/ê/g, 'e')
        .replace(/Ê/g, 'E')
        .replace(/â/g, 'a')
        .replace(/à/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/Â/g, 'A')
        .replace(/Ê/g, 'E');
      }

    });

    return orderByFilter(input, 'altName');
  };

}]);
