angular.module('resources.document', [
  'restangular'
])

.factory( 'Document', ['Restangular', function( Restangular ){

  var Doc = {
    like: function( doc, item ) {
      return Restangular.one( 'items', item.id).one('sharedDocs', doc.id).customPUT({score:1}, 'score', {}, {}).then(function(response) {
        return response;
      });
    },

    dislike: function( doc, item ) {
      return Restangular.one( 'items', item.id).one('sharedDocs', doc.id).customPUT({score:-1}, 'score', {}, {}).then(function(response) {
        return response;
      });
    },

    unlike: function( doc, item ) {
      return Restangular.one( 'items', item.id).one('sharedDocs', doc.id).customPUT({score:0}, 'score', {}, {}).then(function(response) {
        return response;
      });
    },

    remove: function( doc, item ){
      return Restangular.one( 'items', item.id).one('sharedDocs', doc.id).remove();
    }

  };

  return Doc;
}]);

