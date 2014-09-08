angular.module('filters.ignoreAccents', [])
.filter('ignoreAccentsFilter', [function(){

  return function (input) {

    var out = [];
    angular.forEach( input, function( item ){
    
      item.altName = item.name
      .replace(/É/g, 'E')
      .replace(/Â/g, 'A')
      .replace(/Ê/g, 'E')
      .replace(/é/g, 'e')
      .replace(/è/g, 'e')
      .replace(/ê/g, 'e')
      .replace(/ë/g, 'e')
      .replace(/â/g, 'a')
      .replace(/ï/g, 'i')
      .replace(/î/g, 'i')
      .replace(/ù/g, 'u')
      .replace(/ô/g, 'o')
      .replace(/ö/g, 'o')
      .replace(/ù/g, 'u');

      out.push( item );
    });

    return out;
  };

}]);

