/* Welcome to the diagram directive of Shapter!
 *
 * For each diagram, you CAN (but don't have to) specify:
 * - the width (radius of the diagram): "width" (int)
 * - the font size: "fontSize" (int)
 * - if you want the texts in the values: "withText" (bool)
 * - the margin (right and left) you want: "margin"
 * 
 * You HAVE TO specify the values of the diagram: "values" (dict)
 *
 * You can also change the front parameters in the directive shDiagram,
 * if you're not satisfied with this beautiful diagram.
*/

angular.module('directives.shDiagram', [])
.directive( 'shDiagram', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    scope: {
      diagram: "=",
      width: "=?",
      fontSize: "=?",
      withText: "=?",
      margin: "=?"
    },
    link: function ( scope, element, attrs ) {


      /************ Front parameters **************/
      var diagramColor = "#318FFF";
      //var diagramColor = "rgba(52, 152, 219,0.5)";
      var colors = ["#c4f5bd","#fdf0d3","#f8fdbc","#c9ddd4","#ffffff"];
      var strokeWidth = 2;
      var strokeColor = diagramColor; //"#2980b9";
      var fontFamily = "'Lato', Helvetica, Arial, sans-serif";
      var withCaption = true; // Add the dashed lines in the diagram if set to true
      var defaultWidth = 100;
      var defaultFontSize = 11;
      var defaultMargin = 120;
      /******** End of front parameters ***********/
      

      /****** NEVER TOUCH THIS OR YOU DIIIE *******/
      /*********** Setting parameters *************/
      scope.withText = angular.isDefined(scope.withText) ? scope.withText : true;
      scope.width = scope.width || defaultWidth;
      scope.fontSize = scope.fontSize || defaultFontSize;
      scope.margin = scope.margin || defaultMargin;
      if (!scope.withText) {
        scope.margin = 0;
      }
      var nbValues = 0;
      var textDrawn = 0;
      var maxKeyLength = 0;
      // Setting the number of values
      angular.forEach(scope.diagram, function(cat, key) {
        nbValues += 1;
        if (key.length > maxKeyLength) {
          maxKeyLength = key.length;
        }
      });
      var nbPoly = colors.length;
      var step = 360 / nbValues;
      /********* End setting parameters ***********/

      var center = {x:scope.width+scope.margin-20, y:scope.width+parseInt(scope.fontSize/2, 10)};
      var paper = new Raphael(element[0], 2*(scope.width+scope.margin), 2*scope.width+scope.fontSize);

      // Draw a polygon with some values ({key: ..., value: {x:.., y:..}})
      var multipleLineToWithValue = function( points ) {
        var string = "M" + parseInt(points[0]["value"].x, 10).toString() + "," + parseInt(points[0]["value"].y, 10).toString();
        var x,y = 0;
        for (var i=0; i<points.length; i++) {
          x = parseInt(points[i]["value"].x, 10);
          y = parseInt(points[i]["value"].y, 10);
          string += "L" + x.toString() + "," + y.toString();
          if (scope.withText && (textDrawn < nbValues)) {
            paper.text(points[i]["keyPos"].x, points[i]["keyPos"].y,points[i]["key"])
              .attr({"font-size": scope.fontSize.toString() + "px", "font-family": fontFamily,
                "text-anchor":points[i].textAnchor, "title":points[i]["key"]});
              textDrawn += 1;
          }
        }
        string += "L" + parseInt(points[0]["value"].x, 10).toString() + "," + parseInt(points[0]["value"].y, 10).toString();
        return paper.path(string);
      };

      // Draw a polygon
      var multipleLineTo = function(points) {
        var string = "M" + parseInt(points[0].x, 10).toString() + "," + parseInt(points[0].y, 10).toString();
        for (var i=0; i<points.length; i++) {
          string += "L" + parseInt(points[i].x, 10).toString() + "," + parseInt(points[i].y, 10).toString();
        }
        return paper.path(string);
      };

      // Create polygon
      var polygon = function(center, nb_sides, radius, color) {
        var points = [];
        for (var i=0; i<nb_sides+1; i++) {
          points.push({
            x: center.x + Math.cos(step*i*Math.PI/180)*radius,
            y: center.y + Math.sin(step*i*Math.PI/180)*radius
          });
        }
        var poly = multipleLineTo(points);
        // Sets the fill attribute of the circle to red (#f00)
        poly.attr("fill", color);

        return poly;
      };

      // Draw the caption
      var drawCaption = function() {
        for (var i=0; i<nbValues; i++) {
          var string = "M" + parseInt(center.x, 10).toString() + "," + parseInt(center.y, 10).toString();
          var value = {
            x: center.x + Math.cos(step*i*Math.PI/180)*scope.width,
            y: center.y + Math.sin(step*i*Math.PI/180)*scope.width
          };
          string += "L" + parseInt(value.x, 10).toString() + "," + parseInt(value.y, 10).toString();
          paper.path(string).attr("stroke-dasharray","-");
        }
      };

      // Draw the base of the diagram (with different colors)
      var drawBaseDiagram = function() {
        for (var i=0; i<nbPoly; i++) {
          radius = scope.width/nbPoly*(nbPoly-i);
          polygon(center, nbValues, radius, colors[i]);
        }
        if (withCaption) {
          drawCaption();
        }
      };

      // Draw the diagram
      var poly;
      var drawDiagram = function() {
        angular.forEach( scope.diagram, function( axis ){
          axis.value = Math.max( 5, axis.value );
        });
        var points = [];
        var i=0;
        angular.forEach(scope.diagram, function(cat, key) {
          var textAnchor = "start";
          if (step*i/180 > 1/2 && step*i/180 < 3/2) {
            textAnchor = "end";
          }
          this.push({
            key: cat.name,
            value: {
              x: center.x + Math.cos(step*i*Math.PI/180)*cat.value/100*scope.width,
              y: center.y - Math.sin(step*i*Math.PI/180)*cat.value/100*scope.width
            },
            keyPos: {
              x: center.x + Math.cos(step*i*Math.PI/180)*scope.width,
              y: center.y - Math.sin(step*i*Math.PI/180)*scope.width
            },
            textAnchor: textAnchor
          });
          i += 1;
        }, points);
        poly = multipleLineToWithValue(points);
        // Set the inside of the diagram
        poly.attr("fill", diagramColor);
        poly.attr("stroke-width", strokeWidth);
        poly.attr("stroke", strokeColor);
        poly.attr("fill-opacity", 0.8);
      };

      // Drawing... zbeulah!
      if( scope.diagram ){
        drawBaseDiagram();
        drawDiagram();
      }

      $compile(element.contents()[0])(scope);

      scope.$watch( function(){
        return scope.diagram;
      }, function( oldValue, newValue ){
        if( poly ){
          poly.remove();
        }
        if( scope.diagram ){
          drawDiagram();
        }
      }, true);

    }
  };
}]);

