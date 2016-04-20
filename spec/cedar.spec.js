describe('Cedar', function () {
  var chart;
  var xhr;
  var requests = [];

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(function(){
    requests = [];
  });

  describe('constructor', function () {
    var fakeDefinition, fakeSpec;
    beforeEach(function() {
      fakeDefinition = {
        "dataset":{
          "url":"http://not-real.com/4",
          "mappings":[],
          "query":{}
        },
        "specification":{
          "inputs":[],
          "template":{}
        }
      };
      fakeSpec = {

      }
    });



    it("should accept options.definition as url", function(/*done*/) {
      chart = new Cedar({definition:'http://foo.com'});
      //need to setup sinon to intercept and ensure the xhr happens
      expect(requests[0].url).to.equal('http://foo.com');
      expect(requests[0].method).to.equal('get');
      requests[0].respond(200, { 'Content-Type': 'application/json; charset=utf-8' }, JSON.stringify({dataset:{},template:{}}));
      //done()
    });

    it("should accept options.definition as an object ", function() {

      chart = new Cedar({"definition":fakeDefinition});
      expect(chart.dataset).to.equal(fakeDefinition.dataset);
      expect(chart.dataset.url).to.equal(fakeDefinition.dataset.url);
      expect(chart.specification).to.equal(fakeDefinition.specification);

    });

    it("should not throw if options.defition === string and ! contains http", function() {
      var fct = function(){
        var x = new Cedar({definition:'/foo/bar.json'});
      }
      expect(fct).not.to.throw();
      expect(requests[0].url).to.equal('/foo/bar.json');
      expect(requests[0].method).to.equal('get');

    });

    it("should accept options.specification as url", function() {
      var fct = function(){
        var x = new Cedar({specification:'/foo/bar.json'});
      }
      expect(fct).not.to.throw();
      expect(requests[0].url).to.equal('/foo/bar.json');
      expect(requests[0].method).to.equal('get');
    });

    it("should accept options.specification as an object ", function() {
      chart = new Cedar({"specification":fakeSpec});
      expect(chart.specification).to.equal(fakeSpec);

    });

    it("should not throw if options.template === string and ! contains http", function() {
      var fct = function(){
        var x = new Cedar({ specification:'/bar/baz.json' });
      }
      expect(fct).not.to.throw();
    });



  });


  describe('validate data', function () {
    var data, mappings;
    beforeEach(function() {
      data = {
        "features":[
        {
          "attributes":{
            "ZIP_CODE":"80563",
            "TOTAL_STUD_SUM":1231
          }
        },
        {
          "attributes":{
            "ZIP_CODE":"80564",
            "TOTAL_STUD_SUM":132
          }
        }
        ]
      };
      mappings = {
          "group": {"field":"ZIP_CODE","label":"ZIP Code"},
          "count": {"field":"TOTAL_STUD","label":"Total Students"}
      }
    });

    it("should throw if data.features is not an array", function() {
      var fct = function(){
        var x = Cedar._validateData({}, mappings);
      }
      expect(fct).to.throw();
    });

    it("should return empty array if no errors", function() {
      var out = Cedar._validateData(data, mappings);
      expect(out).to.be.an('array');
      expect(out).to.be.empty;
    });

  });


  describe('feature service query', function () {
    var dataset;
    beforeEach(function() {
      dataset = {
        "url":"http://not-real.com/arcgis/rest/foobar/featureserver/4",
        "mappings":{}
      };

    });

    it("should add 1=1 query", function() {
      var u = Cedar._createFeatureServiceRequest(dataset);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&f=json');
    });

    it("should serialize where", function() {
      dataset.query = {
        "where":"ZIP = 80524"
      };
      var u = Cedar._createFeatureServiceRequest(dataset);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=ZIP%20%3D%2080524&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&f=json');
    });
    it("should serialize the token", function() {
      dataset.token = "ABC123";
      var u = Cedar._createFeatureServiceRequest(dataset);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&f=json&token=ABC123');
    });
    it("should serialize bbox", function() {
      dataset.query = {
        "bbox":"-103,30,-102,40"
      };
      var u = Cedar._createFeatureServiceRequest(dataset);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&f=json&geometry=%7B%22xmin%22%3A%22-103%22%2C%22ymin%22%3A%22-102%22%2C%22xmax%22%3A%2230%22%2C%22ymax%22%3A%2240%22%7D&inSR=4326');
    });
  });


  describe('mapping names', function () {
    it("should append _SUM for count", function() {
      var out = Cedar._getMappingFieldName('count', 'SOME_FIELD');
      expect(out).to.equal('SOME_FIELD_SUM');
    });
    it("should pass thru non-matching mappings", function() {
      var out = Cedar._getMappingFieldName('notcount', 'SOME_FIELD');
      expect(out).to.equal('SOME_FIELD');
    });
  });

  xdescribe('properties', function () {

    describe('dataset', function () {
      it("should get/set dataset object", function() {

      });

      it("should expose the passed in dataset", function() {

      });
    });

    describe('template', function () {

      it("should get/set a template object", function() {

      });

      it("should expose the passed in template", function() {

      });
    });

  });

  xdescribe('drawing a chart', function () {

    describe('returns error when', function () {

      it("dataset is not set", function() {

      });

      it("dataset.url and dataset.data are not set ", function() {

      });

      it("dataset.mappings is not set", function() {

      });

      it("specification.template not set", function() {

      });

    });

  });


});
