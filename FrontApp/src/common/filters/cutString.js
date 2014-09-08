angular.module( 'filters.cutString', [])
.filter( 'cutString', [function(){
  return function( input, sz){

    if( sz > input.length){
      return input;
    }
    else {
      return input.slice(0, sz) + ' ...';
    }

  };
}]);
