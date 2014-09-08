angular.module('filters.shorterFirst', [])
.filter('shorterFirstFilter', [ 'orderByFilter', function( orderByFilter ){

  return function (input) {

    var out = [];
    angular.forEach( input, function( item ){
      item.sortScore = item.acronym.length;
      out.push( item );
    });

    return orderByFilter( out, 'sortScore' );
  };

}]);


