/* This service aim to use an API of svg-svg-to-jpg conversion */

angular.module('services.diagconv', [])
.factory('StoJ', [function(){

  Converter = function(){

    this.convert = function(svg){
      var cv = document.createElement('canvas');
      canvg(cv, svg);
      var img = cv.toDataURL("image/png");
      return img;
    };
  };

  return new Converter();

}]);
