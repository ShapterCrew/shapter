angular.module( 'directives.fileread', [])
.directive("fileread", [function () {
  return {
    scope: {
      fileread: "=",
      filename: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();

        reader.onloadend = function(){
          scope.$apply( function(){
            scope.filename = element[0].files[0].name;
          });
        };

        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
          });
        };

        reader.readAsDataURL(changeEvent.target.files[0]);

      });
    }
  };
}]);

