angular.module('directives.shGauge', [])
.directive( 'shGauge', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    scope: {
      value: '=',
      max: '=',
      min: '=',
      inv: '=',
      editable: "="
    },
    link: function ( scope, element, attrs ) {

      scope.noGradient = true;
      scope.customSectors = [];

      scope.levelColors = scope.inv === true ? [ "#2ecc71", "#f1c40f", "#e74c3c" ] : [ "#e74c3c", "#f1c40f", "#2ecc71"  ];

      /**  Cut hex  */
      var cutHex = function(str) {
        return (str.charAt(0)=="#") ? str.substring(1,7):str;
      };

      scope.getColor = function(val, pct, col, noGradient, custSec) {

        var no, inc, colors, percentage, rval, gval, bval, lower, upper, range, rangePct, pctLower, pctUpper, color;

        if(custSec.length > 0) {
          for(var i = 0; i < custSec.length; i++) {
            if(val > custSec[i].lo && val <= custSec[i].hi) {
              return custSec[i].color;
            }
          }
        }

        no = col.length;
        if (no === 1) { return col[0];}
        inc = (noGradient) ? (1 / no) : (1 / (no - 1));
        colors = [];
        for (var ii = 0; ii < col.length; ii++) {
          percentage = (noGradient) ? (inc * (ii + 1)) : (inc * ii);
          rval = parseInt((cutHex(col[ii])).substring(0,2),16);
          gval = parseInt((cutHex(col[ii])).substring(2,4),16);
          bval = parseInt((cutHex(col[ii])).substring(4,6),16);
          colors[ii] = { pct: percentage, color: { r: rval, g: gval, b: bval  } };
        }

        if(pct === 0) {
          return 'rgb(' + [colors[0].color.r, colors[0].color.g, colors[0].color.b].join(',') + ')';
        }

        for (var j = 0; j < colors.length; j++) {
          if (pct <= colors[j].pct) {
            if (noGradient) {
              return 'rgb(' + [colors[j].color.r, colors[j].color.g, colors[j].color.b].join(',') + ')';
            } else {
              lower = colors[j - 1];
              upper = colors[j];
              range = upper.pct - lower.pct;
              rangePct = (pct - lower.pct) / range;
              pctLower = 1 - rangePct;
              pctUpper = rangePct;
              color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
              };
              return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
            }
          }
        }
      };

      scope.canvasLength = element.parent()[0].clientWidth > 0 ? element.parent()[0].clientWidth : 100;

      var paper = new Raphael(element[0], scope.canvasLength, 10);
      var empty, rect, length, dV, overflowValue;

      scope.refresh = function(value){
        if (value > 100){
          overflowValue = 100;
        }
        else if (value < 1){
          overflowValue = 1;
        }
        else {
          overflowValue = value;
        }

        //roundedOverflowValue = Math.round( overflowValue + 0.5 );

        scope.value = Math.round( overflowValue );
        scope.defineRect( scope.value );
      };

      var updateOnClick = function(event){
        V = 100 * event.layerX / scope.canvasLength;
        scope.refresh(V);
      };

      var oldValue;
      var start = function(x, y, event){
        oldValue = scope.value;
      };

      var move = function(dx, dy, x, y, event){
        dV = 100 * dx / scope.canvasLength;
        scope.refresh(dV + oldValue);
      };

      var up = function(){
        scope.$apply();
      };

      scope.noGradient = false;
      scope.customSectors = false;

      scope.defineRect = function( value ){

        length = value / (scope.max - scope.min) * scope.canvasLength;

        pristine = null;
        empty = paper.rect(0, 0, scope.canvasLength, 10);
        rect = paper.rect(0, 0, length, 10);

        empty.attr({
          fill: "#ecf0f1"
        }).attr({
          stroke: scope.getColor(scope.value, (scope.value - scope.min) / (scope.max - scope.min), scope.levelColors, scope.noGradient, scope.customSectors), "stroke-width":2
        });

        rect.attr({
          fill: scope.getColor(scope.value, (scope.value - scope.min) / (scope.max - scope.min), scope.levelColors, scope.noGradient, scope.customSectors)
        }).attr({
          stroke: scope.getColor(scope.value, (scope.value - scope.min) / (scope.max - scope.min), scope.levelColors, scope.noGradient, scope.customSectors)
        });

        if (scope.editable === true){
          rect.mousedown(updateOnClick);
          rect.drag(move, start, up);
          empty.mousedown(updateOnClick);
          empty.drag(move, start, up);
        }
      };

      scope.initializeRect = function(){
        pristine = paper.rect(0, 0, scope.canvasLength, 10);
        pristine.attr({
          stroke: "#3498db"
        }).attr({
          fill: "#ecf0f1"
        });
        pristine.mousedown( updateOnClick );
        pristine.drag( move, start, up );
      };

      if ( scope.value ){
        scope.defineRect( scope.value );
      }
      else if( scope.editable === true){ 
        scope.initializeRect();
      }

      $compile(element.contents())(scope);

    }
  };
}]);
