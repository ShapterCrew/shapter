angular.module( 'shapter.cursus', [
  'ui.router',
  'ui.bootstrap',
  'security',
  'services.appText'
])

.config(['$stateProvider',function config( $stateProvider ) {
  $stateProvider.state( 'cursus', {
    url: '/schools/:schoolId/cursus',
    views: {
      "main": {
        controller: 'CursusCtrl',
        templateUrl: 'cursus/cursus.tpl.html'
      }
    },
    data:{ pageTitle: 'Cursus' },
    resolve: {
      schools: ['School', function( School ){
        return School.index();
      }]
    }
  });
}])

.directive('shCursusBox', [function(){
  return {
    restrict: 'E',
    scope: {
      box: '=',
      displaySchool: '='
    },
    templateUrl: 'cursus/cursusBox.tpl.html',
    controller: 'CursusBoxCtrl'
  };
}])

.controller('CursusBoxCtrl', ['$scope', 'AppText', function( $scope, AppText ){
  $scope.AppText = AppText;
}])

.controller('CursusCtrl', ['$scope', 'schools', 'Tag', 'Item', '$stateParams', '$filter', 'AppText', 'followBoxModalFactory', 'School', '$location', function( $scope, schools, Tag, Item, $stateParams, $filter, AppText, followBoxModalFactory, School, $location ){

  School.index().then( function( schools ){
    $scope.schools = schools.schools;
  });

  $location.search('state', null);
  $scope.$location = $location;
  $scope.alerts = [];
  $scope.AppText = AppText;
  $scope.firstOfASchool = function( $index, boxes, box ){
      return $index === 0 || ($filter( 'filter' )( boxes[ $index - 1 ].tags,  {category: 'school'})[0].id != $filter( 'filter' )( box.tags,  {category: 'school'})[0].id);
  };

  $scope.displayAddSuggestion = function( suggestion ){
    $location.search('state', 'addingBox');
    if( !!suggestion ){
    $scope.newBox = angular.copy( suggestion );
    }
    else {
      $scope.newBox = {
        type: 'classes',
        displayDetails: true,
        tags: [],
        items: []
      };
    }
  };

  $scope.loadSuggestionItems = function( box ){
    getIdsList = function( tags ){
      return tags.map( function( tag ){
        return( tag.id );
      });
    };
    box.itemsLoading = true;
    Item.getListFromTags( getIdsList( box.tags), true ).then( function( response ){
      box.itemsLoading = false;
      box.items = response.items;
    });
  };

  $scope.cancelAddBox = function(){
    $location.search('state', null);
    delete $scope.newBox;
  };

  $scope.addBox = function(){
    $scope.alerts.push({
      type: 'info',
      msg: 'L\'étape a bien été ajoutée à ton parcours !'
    });
    $scope.cancelAddBox();
  };

  $scope.getTypeahead = function( string ){
    var tag_ids = [ $scope.newBox.school.id ];
    return Tag.typeahead( string, tag_ids, 'item', 30, null ).then( function( response ){
      return response.tags;
    });
  };

  $scope.addTextTag = function(){
    $scope.newBox.tags = $scope.newBox.tags || [];
    $scope.newBox.tags.push( $scope.newBox.typedTag );
    $scope.newBox.typedTag = null;
  };

  $scope.$watch( function(){
    return $scope.newBox ? $scope.newBox.tags : null;
  }, function( newVal, oldVal ){
    $scope.newBox.items = [];
    if( newVal && newVal.length > 0 ){
      $scope.loadSuggestionItems( $scope.newBox );
    }
  }, true);

  $scope.classesSuggestions = [{
    name: 'Cours de lol',
    type: 'classes',
    school: {
      name: 'Centrale Lyon',
      id: '538310614d61631781010000'
    },
    tags: [ {
      id: '538310614d61631781010000',
      name: 'lol'
    }, {
      id: '538310614d616317811f0000',
      name: 'haha'
    }]
  }, {
    name: 'Cours de haha',
    type: 'classes'
  }];
  $scope.internshipsSuggestions = [{
    title: 'Stage ouvrier',
    type: 'internship'
  }, {
    title: 'Stage d\'application',
    type: 'internship'

  }, {
    title: 'Travail de fin d\'études',
    type: 'internship'
  }];
  $scope.boxes = [{
    title: "TFE",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    description: "lol haha c'était kikoulol j\'ai bien rigolé",
    type: "internship",
    company: "Shapter",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }]
  }, {
    title: "Master qq chose",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    type: "classes",
    tags: [{
      name: "Telecom",
      category: "school",
      id: 2
    }, {
      name: "Cycle master",
      category: "choice"
    }, {
      name: "2A",
      category: "admin"
    }]
  }, {
    title: "Master qq chose",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    type: "classes",
    tags: [{
      name: "Telecom",
      category: "school",
      id: 2
    }, {
      name: "Cycle master",
      category: "choice"
    }, {
      name: "2A",
      category: "admin"
    }]
  }, {
    title: "Métier 3A",
    description: "lol haha c'était kikoulol j\'ai bien rigolé",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    type: "classes",
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }, {
      name: "MOD",
      category: "choice"
    }, {
      name: "3A",
      category: "admin"
    }],
    items: [{
      name: 'cours de lol',
      id: '538310624d616317813f0100',
      current_user_comments_count: 1,
      current_user_has_diagram: true
    }, {
      name: 'cours de haha',
      id: '538310624d61631781f10000',
      current_user_comments_count: 0,
      current_user_has_diagram: true
    }]
  }, {
    title: "Option 3A",
    description: "Ldf d qdfqsdfqsd qsd qsd qsdf qsdfqsdf qsdq dfqsdf qsqqq q q qq qq qdsf q qsd qsdf qsdf dfsq qsdfqsdfsqdf fqds sdq qfdfqds fdsqqsdq q qsd fqsdfqd qsdf qsdf qsdf dsq fqsd",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    type: "classes",
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }, {
      name: "MOS",
      category: "choice"
    }, {
      name: "3A",
      category: "admin"
    }]
  },{
    title: "Modules Ouverts Métiers",
    description: "Les modules ouverts sectoriels c'set tagada tagad, et j'ai fait ceci et j'ai fait cela et j'ai tagada",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    type: "classes",
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }, {
      name: "MOS",
      category: "choice"
    }, {
      name: "3A",
      category: "admin"
    }]
  }, {
    title: "Modules Ouverts Sectoriels",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    type: "classes",
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }, {
      name: "MOS",
      category: "choice"
    }, {
      name: "3A",
      category: "admin"
    }]
  }, {
    title: "Électifs semestre 7",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    description: "sisi",
    type: "classes",
    company: "",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }]
  }, {
    title: "Semestre 7",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    description: "sisi",
    type: "common",
    company: "",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }]
  }, {
    title: "Stage ouvrier",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    description: "sisi",
    type: "internship",
    company: "Le Louvre",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }]
  }, {
    title: "Semestre 6",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    description: "sisi",
    type: "common",
    company: "",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }]
  }, {
    title: "Semestre 5",
    unfolded: false,
    start_date: '2014-07-08T13:05:59.679Z',
    end_date: '2014-09-08T13:05:59.679Z',
    description: "sisi",
    type: "common",
    company: "",
    lat: 35,
    lng: 32,
    tags: [{
      name: "Centrale Lyon",
      category: "school",
      id: 1
    }]
  }];
}])

.factory('followBoxModalFactory', ['$modal', function( $modal ){
  return {
    openModal: function( tags, title ) {
      return $modal.open({
        templateUrl: 'cursus/selectBoxItemsModal.tpl.html',
        controller: 'SelectBoxItemsCtrl',
        windowClass: 'show',
        resolve: {
          title: function() {
            return title;
          },
          items: ['Item', function( Item ){
            return Item.getListFromTags( tags, true );
          }]
        }
      });
    }
  };
}])

.controller('SelectBoxItemsCtrl', ['$scope','items', 'title', '$modalInstance', 'AppText', function( $scope, items, title, $modalInstance, AppText ){
  $scope.box = {};
  $scope.AppText = AppText;
  $scope.close = $modalInstance.close;
  $scope.title = title;
  $scope.items = items.items;
  $scope.validate = function(){
  };
}]);
