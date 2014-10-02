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

.controller('CursusCtrl', ['$scope', 'schools', 'Tag', 'Item', '$stateParams', '$filter', 'AppText', function( $scope, schools, Tag, Item, $stateParams, $filter, AppText ){

  $scope.AppText = AppText;
  $scope.addClasses = function(){
    $scope.boxes.push( angular.copy( $scope.newBox.classes ));
    $scope.initializeNewBox();
    $scope.displayAddClasses = false;
    $scope.classesStep = 1;
    $scope.itemsList = [];
  };
  $scope.activeTag = null;
  $scope.firstOfASchool = function( $index, boxes, box ){
    return $index === 0 || boxes[ $index - 1 ].type != 'classes' || ( boxes[ $index - 1 ].type == 'classes' && ($filter( 'filter' )( boxes[ $index - 1 ].tags,  {category: 'school'})[0].id != ($filter( 'filter' )( box.tags,  {category: 'school'})[0].id)));
  };

  $scope.initializeNewBox = function(){
    $scope.newBox = {
      classes: {
        unfolded: true,
        type: 'classes',
        tags: [],
        items: []
      },
      internship: {}
    };
  };

  $scope.initializeNewBox();

  $scope.schools = schools.schools;
  angular.forEach( $scope.schools, function( school ){
    if( school.id == $stateParams.schoolId ){
      $scope.addClassesSchool = school;
    }
  });
  $scope.classesStep = 1;
  $scope.toggleSelectItem = function( item ){
    item.selected = !item.selected;
    $scope.newBox.classes.items = $filter( 'filter' )( $scope.itemsList, { 'selected': true });
  };

  $scope.selectTagTitle = function( tag ){
    $scope.newBox.classes.title = tag.name;
    $scope.activeTag = tag;
    $scope.loadItems();
  };

  $scope.loadItems = function(){
    if( $scope.addClassesSchool && $scope.activeTag ){
      var tags = [ $scope.addClassesSchool.id, $scope.activeTag.id ];
      $scope.newBox.classes.tags = [ $scope.addClassesSchool, $scope.activeTag ];
      return Item.getListFromTags( tags, true ).then( function( response ){
        $scope.itemsList = response.items;
      });
    }
  };

  $scope.nextClassesStep = function(){
    $scope.classesStep += 1;
  };

  $scope.getTypeahead = function( string ){
    var tag_ids = [ $scope.addClassesSchool.id ];
    return Tag.typeahead( string, tag_ids, 'item', 30, null ).then( function( response ){
      return response.tags;
    });
  };

  $scope.previousClassesStep = function(){
    $scope.classesStep -= 1;
  };
  $scope.boxes = [{
    title: "TFE",
    unfolded: true,
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
    title: "Modules Ouverts Disciplinaires",
    description: "lol haha c'était kikoulol j\'ai bien rigolé",
    unfolded: true,
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
    title: "Modules Ouverts Sectoriels",
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
    title: "Modules Ouverts Sectoriels",
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
  }];
}]);
