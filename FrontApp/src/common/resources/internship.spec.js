describe('Internship', function () {
  var mockInternship, httpBackend;

  beforeEach(function() {
    // load the module. REALLY? AMAZING!
    module('resources.internship');

    // get your service, also get $httpBackend
    // $httpBackend will be a mock, thanks to angular-mocks.js
    inject(function (_$httpBackend_, $injector) {
      httpBackend = _$httpBackend_;
      Restangular = $injector.get('Restangular');
      mockInternship = $injector.get('Internship');
    });
  });

  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('can get an instance of my factory', inject(function() {
    expect(mockInternship).toBeDefined();
  }));

  it('should have a get and filter function', inject(function() {
    expect(angular.isFunction(mockInternship.get)).toBe(true);
    expect(angular.isFunction(mockInternship.getListFromTags)).toBe(true);
  }));

  it('should get an internship with a given id', inject(function(Internship) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').andCallThrough();
    // a mock to be returned from http.
    var mockToReturn = {
      "id": 1,
      "name": "Stagiaire qui fout la merde",
      "description": "C'était un super stage",
      "company_name": "Shapter",
      "company_size": "0-49",
      "begin_date": "Today",
      "end_date": "Tomorrow",
      "domain": "Informatique",
      "position": "Stagiaire développement web",
      "skills": ["RoR", "AngularJS"],
      "school": {
        id: 2,
        name: "Telecom ParisTech"
      }
    };
    // a parameter with which the http service we expect to be called
    var id = 1;
    // httpBackend would append a "/" in front of a restangular call      
    httpBackend.expectPOST('/internships/' + id.toString() + "/" + {internship: {"name": true}})
    // respond with the mock
    .respond(mockToReturn);

    // now call our service
    var internship;
    mockInternship.get(id).then(function(response) {
      internship = response;
    });

    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('internships', id);
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();

    expect(internship.name).toEqual("Stagiaire qui fout la merde");

    /*
    // now follows the tricky part. The restangular promise has been unproxied by the httpBackend.flush call,
    // but our promise, the one we return in the service, still hasn't been unproxied
    // so, if we were to directly expect it to be unproxied, we are in for a surprise, it is a still a promise
    // this took some fiddling, but I created a utility function that will do the unproxying for you:
    newRes = TestUtils.resolvePromise(newRes, q, scope);

    // expect the new object to have been 'enhanced' by the service
    expect(newRes).toEqual({
      someProp: 'someValue',
      someOtherProp: 'someOtherValue',
      newlyCreatedProp : 'newlyCreatedProp'
    }); 
    */
  }));

  it('should get some internships according to filter', inject(function(Internship) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'all').andCallThrough();
    // a mock to be returned from http.
    var mockToReturn = [
      {
        "id": 1,
        "name": "Stagiaire qui fout la merde",
        "description": "C'est un super stage",
        "company_name": "Shapter",
        "company_size": "0-49",
        "begin_date": "Today",
        "end_date": "Tomorrow",
        "domain": "Informatique",
        "position": "Stagiaire développement web",
        "skills": ["RoR", "AngularJS"],
        "school": {
          id: 2,
          name: "Telecom ParisTech"
        },
        "user": {
          "name": "Adrien Tibere-inglesse"
        }
      },
      {
        "id": 2,
        "name": "Stagiaire qui est trop cool",
        "description": "C'est un stage de merde",
        "company_name": "Shapter",
        "company_size": "0-49",
        "begin_date": "Today",
        "end_date": "Tomorrow",
        "domain": "Informatique",
        "position": "Stagiaire développement angular",
        "skills": ["RoR", "AngularJS", "html"],
        "school": {
          id: 3,
          name: "Centrale Lyon"
        },
        "user": {
          "name": "Ulysse Klatzmann"
        }
      }
    ];
    // a parameter with which the http service we expect to be called
    var tags = ["tag1", "tag2"];
    var current_only = true;
    // httpBackend would append a "/" in front of a restangular call      
    httpBackend.expectPOST('/internships/filter')
    // respond with the mock
    .respond(mockToReturn);

    // now call our service
    var internships;
    mockInternship.getListFromTags(tags, current_only).then(function(response) {
      internships = response;
    });

    // handle restangular expectations
    expect(Restangular.all).toHaveBeenCalledWith('internships');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();

    expect(internships[1].user.name).toEqual("Ulysse Klatzmann");
  }));

  it('should create an internship', inject(function(Internship) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'all').andCallThrough();
    httpBackend.expectPOST('/internships/create').respond({success: true});

    var internship = {
      "name": "Stagiaire qui fout la merde",
      "description": "C'était un super stage",
      "company_name": "Shapter",
      "company_size": "0-49",
      "begin_date": "Today",
      "end_date": "Tomorrow",
      "domain": "Informatique",
      "position": "Stagiaire développement web",
      "skills": ["RoR", "AngularJS"],
      "school": {
        id: 2,
        name: "Telecom ParisTech"
      }
    };

    var res = false;
    mockInternship.create(internship).then(function(response) {
      res = response.success;
    });

    // handle restangular expectations
    expect(Restangular.all).toHaveBeenCalledWith('internships');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();

    expect(res).toBe(true);
  }));

});
