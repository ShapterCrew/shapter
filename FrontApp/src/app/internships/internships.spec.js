describe('AddInternshipModal Test', function() {

  beforeEach(function(){
    module('directives.addInternshipModal');
    module('services.appText');
//    module('resources.analytics');
    module(function( $provide ){
      $provide.provider('ConfirmAlertFactory', function () { 
        this.$get = function ( $q ) {
          return {
            showMsg: function(){
              return $q.when({});
            }
          };
        };
      });
      $provide.provider('Analytics', function () { 
        this.$get = function ( $q ) {
          return {
            addInternshipModule: function(){
              return $q.when({});
            }
          };
        };
      });
      $provide.provider('School', function () { 
        this.$get = function ( $q ) {
          return {
            index: function(){
              return $q.when({});
            }
          };
        };
      });
      $provide.provider('Tag', function () { 
        this.$get = function () {
          return {
            typeahead: function(){
            }
          };
        };
      });
      $provide.provider('$modalInstance', function () { 
        this.$get = function () {
          return {
            close: function(){
            }
          };
        };
      });
      $provide.provider('Internship', function () { 
        this.$get = function () {
          return {
          };
        };
      });
      $provide.provider('Map', function () { 
        this.$get = function () {
          return {
            getFormatedAdresses: function(){
              return {};
            }
          };
        };
      });
    });
  });

  describe('formatInternshipToPost filter', function(){

    /* --------------------------------- */
    it('should have a formatInternshipToPost filter', inject( function( $filter ){
      expect( $filter('formatInternshipToPost')).not.toBeNull();
    }));

    var not_formatted_internship = {
      title: 'sample title',
      description: 'haha lol',
      start_date: 'lol',
      end_date: 'haha',
      schoolId: '1234',
      tags_by_name_cat: [{
        tag_name: 'lol',
        tag_category: 'skill'
      }],
      tags: {
        company_name: 'Shapter'
      },
      address: {
        formatted_address: "35 Rue de Turbigo, 75003 Paris, France",
        address_components: [{
          long_name: '35',
          types: [
            'street_number'
          ]
        }, 
        {
          long_name: 'Rue de Turbigo',
          types: [
            'route'
          ]
        },
        {
          long_name: 'Paris',
          types: [
            'locality'
          ]
        },
        {
          long_name: 'France',
          types: [
            'country'
          ]
        }],
        geometry: {
          location: {
            lat: 48.8648256,
            lng: 2.3522737
          }
        }
      }
    };

    /* --------------------------------- */
    it('should have a title', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      expect( formatInternshipToPost( not_formatted_internship ).title).toEqual( 'sample title' );
    }));

    /* --------------------------------- */
    it('should have a description', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      expect( formatInternshipToPost( not_formatted_internship ).description).toEqual( 'haha lol' );
    }));

    /* --------------------------------- */
    it('should have a start_date', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      expect( formatInternshipToPost( not_formatted_internship ).start_date).not.toBe( undefined );
    }));

    /* --------------------------------- */
    it('should have a end_date', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      expect( formatInternshipToPost( not_formatted_internship ).end_date).not.toBe( undefined );
    }));

    /* --------------------------------- */
    it('should format locations', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      var expected_location = {
        formatted_address: "35 Rue de Turbigo, 75003 Paris, France",
        lat: 48.8648256,
        lng: 2.3522737
      };
      expect( formatInternshipToPost( not_formatted_internship ).location).toEqual( expected_location );
    }));

    /* --------------------------------- */
    it('should have school tag in tags_by_ids', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      expect( formatInternshipToPost( not_formatted_internship ).tags_by_ids).toContain( '1234' );
    }));

    /* --------------------------------- */
    it('should format tags by name cat', inject( function( $filter ){
      var formatInternshipToPost = $filter( 'formatInternshipToPost' );
      var  expected_tags_by_name_cat = [{
        tag_name: 'lol',
        tag_category: 'skill'
      },
      {
        tag_name: 'Shapter',
        tag_category: 'company_name'
      },
      {
        tag_category: 'geo',
        tag_name: 'Paris'
      },
      {
        tag_category: 'geo',
        tag_name: 'France'
      }];
      expect( formatInternshipToPost( not_formatted_internship ).tags_by_name_cat).toEqual( expected_tags_by_name_cat );
    }));
  });

  describe('AddInternshipModalController', function(){
    var $stateParams;
    beforeEach( inject (function( $injector ){
      $stateParams = $injector.get( '$stateParams' );
    }));

    /* --------------------------------- */
    it('should have an user and an addInternship function in the scope', inject(function($rootScope, $controller) {
      var scope = $rootScope.$new();
      var ctrl = $controller('AddInternshipModalCtrl', {$scope: scope});
      expect(angular.isFunction(scope.addInternship)).toBe(true);
    }));

  });
});
