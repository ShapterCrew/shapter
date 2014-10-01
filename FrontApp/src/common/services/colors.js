angular.module( 'services.colors', [])
.factory( 'Colors', [function(){

  var cutHex =  function(str) {
    return (str.charAt(0)=="#") ? str.substring(1,7):str;
  };

  var Colors = {

    getColor: function(val, pct, col, noGradient, custSec) {

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
    }
  };

  return Colors;
}]);
