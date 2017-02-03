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

  describe('new', function () {
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
        "count": {"field":"TOTAL_STUD_SUM","label":"Total Students"}
      }
    });

    it("should throw if data.features is not an array", function() {
      var fct = function(){
        var x = Cedar._validateData({}, mappings);
      }
      expect(fct).to.throw();
    });

    it("should return empty array if no errors", function() {
      // this test needs to be reviewed, validateData calls getMappingFieldName
      // which has no discernable use at the moment (though it could be useful)
      // see 178 - 180
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
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&sqlFormat=standard&f=json');
    });

    it("should serialize where", function() {
      dataset.query = {
        "where":"ZIP = 80524"
      };
      var u = Cedar._createFeatureServiceRequest(dataset, dataset.query);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=ZIP%20%3D%2080524&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&sqlFormat=standard&f=json');
    });
    it("should serialize the token", function() {
      dataset.token = "ABC123";
      var u = Cedar._createFeatureServiceRequest(dataset);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&sqlFormat=standard&f=json&token=ABC123');
    });
    it("should serialize bbox", function() {
      dataset.query = {
        "bbox":"-103,30,-102,40"
      };
      var u = Cedar._createFeatureServiceRequest(dataset, dataset.query);
      expect(u).to.equal('http://not-real.com/arcgis/rest/foobar/featureserver/4/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&sqlFormat=standard&f=json&geometry=%7B%22xmin%22%3A%22-103%22%2C%22ymin%22%3A%22-102%22%2C%22xmax%22%3A%2230%22%2C%22ymax%22%3A%2240%22%7D&inSR=4326');
    });
  });


  describe('mapping names', function () {
    xit("should append _SUM for count", function() {
      // This test needs to be readdressed. Specifically getMappingFieldName
      // needs to be looked at. Currently it is doing nothing, Could be used to
      // append statType to fieldName
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

  describe('spec utils', function () {
    describe('when converting datasets to dataset', function () {
      describe('for bar charts', function () {
        // set up input and expected output
        var datasets, expected;
        beforeEach(function () {
          datasets = [
            {
              "url":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
              "query": {
                "groupByFieldsForStatistics": "Type",
                "outStatistics": [{
                  "statisticType": "sum",
                  "onStatisticField": "Number_of",
                  "outStatisticFieldName": "Number_of_SUM"
                }]
              },
              "mappings":{
                "sort": "Number_of_SUM DESC",
                "category": { "field": "Type", "label": "Facility Use" },
                "series": [
                  { "field":"Number_of_SUM","label":"Total Students" }
                ]
              }
            }
          ];
          expected = {
            "url":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
            "query": {
              "groupByFieldsForStatistics": "Type",
              "outStatistics": [{
                "statisticType": "sum",
                "onStatisticField": "Number_of",
                "outStatisticFieldName": "Number_of_SUM"
              }]
            },
            "mappings":{
              "sort": "Number_of_SUM DESC",
              "x": {"field":"Type","label":"Facility Use"},
              "y": {"field":"Number_of_SUM","label":"Total Students"}
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'bar');
          expect(actual).to.deep.equal(expected);
        });
        it('should handle category string', function () {
          datasets[0].mappings.category = 'Type';
          expected.mappings.x.label = 'Type';
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'bar');
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for horizontal bar charts', function () {
        // set up input and expected output
        var datasets, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
              "query": {
                "groupByFieldsForStatistics": "Zip",
                "outStatistics": [{
                  "statisticType": "sum",
                  "onStatisticField": "Number_of",
                  "outStatisticFieldName": "Number_of_SUM"
                }]
              },
              "mappings":{
                "category": { "field": "Zip", "label": "ZIP Code" },
                "series": [
                  { "field":"Number_of_SUM","label":"Total Students" }
                ]
              }
            }
          ];
          expected = {
            "url":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
            "query": {
              "groupByFieldsForStatistics": "Zip",
              "outStatistics": [{
                "statisticType": "sum",
                "onStatisticField": "Number_of",
                "outStatisticFieldName": "Number_of_SUM"
              }]
            },
            "mappings":{
              "y": {"field":"Zip","label":"ZIP Code"},
              "x": {"field":"Number_of_SUM","label":"Total Students"}
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'bar-horizontal');
          expect(actual).to.deep.equal(expected);
        });
        it('should handle category string', function () {
          datasets[0].mappings.category = 'Zip';
          expected.mappings.y.label = 'Zip';
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'bar-horizontal');
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for grouped bar charts', function () {
        // set up input and expected output
        var datasets, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0",
              "mappings":{
                "category": { "field": "NAME", "label": "Name" },
                "series": [
                  { "field":"MED_AGE_M","label":"Age" }
                ]
              }
            },
            {
              "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0",
              "mappings":{
                "category": { "field": "NAME", "label": "Name" },
                "series": [
                  { "field":"MED_AGE_F","label":"Age" }
                ]
              }
            },
            {
              "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0",
              "mappings":{
                "category": { "field": "NAME", "label": "Name" },
                "series": [
                  { "field":"MED_AGE","label":"Age" }
                ]
              }
            }
          ];
          expected = {
        	  "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0",
        	  "mappings":{
        	    "x": {"field":["attributes.MED_AGE_M", "attributes.MED_AGE_F", "attributes.MED_AGE"],"label":"Age"},
        	    "group":{"field":"NAME","label":"Name"}
        	  },
            "query": {
              "where": '1=1',
              "returnGeometry": false,
              "returnDistinctValues": false,
              "returnIdsOnly": false,
              "returnCountOnly": false,
              "outFields": '*',
              "sqlFormat": 'standard',
              "f": 'json'
            }
        	};
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'grouped');
          expect(actual).to.deep.equal(expected);
        });
        it('should handle category string', function () {
          datasets[0].mappings.category = 'NAME';
          expected.mappings.group.label = 'NAME';
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'grouped');
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for grouped bar charts with multiple series and not multiple datasets', function () {
        // set up input and expected output
        var datasets, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0",
              "mappings":{
                "category": { "field": "NAME", "label": "Name" },
                "series": [
                  { "field":"MED_AGE_M","label":"Age" },
                  { "field":"MED_AGE_F","label":"Age" },
                  { "field":"MED_AGE","label":"Age" }
                ]
              }
            }
          ];
          expected = {
            "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0",
            "mappings":{
              "x": {"field":["attributes.MED_AGE_M", "attributes.MED_AGE_F", "attributes.MED_AGE"],"label":"Age"},
              "group":{"field":"NAME","label":"Name"}
            },
            "query": {
              "where": '1=1',
              "returnGeometry": false,
              "returnDistinctValues": false,
              "returnIdsOnly": false,
              "returnCountOnly": false,
              "outFields": '*',
              "sqlFormat": 'standard',
              "f": 'json'
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'grouped');
          expect(actual).to.deep.equal(expected);
        });
        it('should handle category string', function () {
          datasets[0].mappings.category = 'NAME';
          expected.mappings.group.label = 'NAME';
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'grouped');
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for scatterplot chart', function () {
        // set up input and expected output
        var datasets, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
              "mappings":{
                "category": { "field": "Number_of", "label": "Student Enrollment (2008)" },
                "series": [
                  { "field":"F_of_teach", "label": "Fraction of Teachers" },
                  { "field":"Type", "label":"Facility Type" }
                ]
              }
            }
          ];
          expected = {
            "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
            "mappings":{
              "x": {"field":"Number_of", "label":"Student Enrollment (2008)"},
              "y": {"field":"F_of_teach", "label":"Fraction of Teachers"},
              "color":{"field":"Type", "label":"Facility Type"},
            },
            "query": {
              "where": '1=1',
              "returnGeometry": false,
              "returnDistinctValues": false,
              "returnIdsOnly": false,
              "returnCountOnly": false,
              "outFields": '*',
              "sqlFormat": 'standard',
              "f": 'json'
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, undefined, 'scatter');
          expect(actual).to.deep.equal(expected);
        });
      });
    });
  });
});
