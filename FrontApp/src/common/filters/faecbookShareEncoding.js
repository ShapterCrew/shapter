angular.module('filters.shareEncoding', [])
.filter('shareEncoding', [function(){
  return function( input ){
    return input
    .replace(/\//g, '_')
    .replace(/\+/g, '-');
  };
}]);

