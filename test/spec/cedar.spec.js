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
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
              "query": {
                "groupByFieldsForStatistics": "Type",
                "orderByFields": "Number_of_SUM DESC",
                "outStatistics": [{
                  "statisticType": "sum",
                  "onStatisticField": "Number_of",
                  "outStatisticFieldName": "Number_of_SUM"
                }]
              }
            }
          ];
          series = [
            {
              "category": { "field": "Type", "label": "Facility Use" },
              "value": { "field":"Number_of_SUM","label":"Total Students" }
            }
          ];
          expected = {
            "url":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
            "query": {
              "groupByFieldsForStatistics": "Type",
              "orderByFields": "Number_of_SUM DESC",
              "outStatistics": [{
                "statisticType": "sum",
                "onStatisticField": "Number_of",
                "outStatisticFieldName": "Number_of_SUM"
              }]
            },
            "mappings":{
              "x": {"field":"Type","label":"Facility Use"},
              "y": {"field":"Number_of_SUM","label":"Total Students"}
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'bar', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for bar charts with inlined data', function () {
        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "data": {
                "features":[{"attributes":{"Zip":20005,"Number_of_SUM":327}},{"attributes":{"Zip":20024,"Number_of_SUM":517}},{"attributes":{"Zip":20017,"Number_of_SUM":597}},{"attributes":{"Zip":20015,"Number_of_SUM":707}},{"attributes":{"Zip":20037,"Number_of_SUM":760}},{"attributes":{"Zip":20018,"Number_of_SUM":1052}},{"attributes":{"Zip":20012,"Number_of_SUM":1184}},{"attributes":{"Zip":20007,"Number_of_SUM":1584}},{"attributes":{"Zip":20008,"Number_of_SUM":1625}},{"attributes":{"Zip":20003,"Number_of_SUM":1869}},{"attributes":{"Zip":20009,"Number_of_SUM":1945}},{"attributes":{"Zip":20001,"Number_of_SUM":2164}},{"attributes":{"Zip":20010,"Number_of_SUM":2282}},{"attributes":{"Zip":20019,"Number_of_SUM":3278}},{"attributes":{"Zip":20011,"Number_of_SUM":3817}},{"attributes":{"Zip":20020,"Number_of_SUM":3901}},{"attributes":{"Zip":20032,"Number_of_SUM":4360}},{"attributes":{"Zip":20016,"Number_of_SUM":4681}},{"attributes":{"Zip":20002,"Number_of_SUM":5590}}]
              }
            }
          ];
          series = [
            {
              "category": { "field": "Zip", "label": "Zip Code" },
              "value": { "field":"Number_of_SUM","label":"Total Students" }
            }
          ];
          expected = {
            "data": {
              "features":[{"attributes":{"Zip":20005,"Number_of_SUM":327}},{"attributes":{"Zip":20024,"Number_of_SUM":517}},{"attributes":{"Zip":20017,"Number_of_SUM":597}},{"attributes":{"Zip":20015,"Number_of_SUM":707}},{"attributes":{"Zip":20037,"Number_of_SUM":760}},{"attributes":{"Zip":20018,"Number_of_SUM":1052}},{"attributes":{"Zip":20012,"Number_of_SUM":1184}},{"attributes":{"Zip":20007,"Number_of_SUM":1584}},{"attributes":{"Zip":20008,"Number_of_SUM":1625}},{"attributes":{"Zip":20003,"Number_of_SUM":1869}},{"attributes":{"Zip":20009,"Number_of_SUM":1945}},{"attributes":{"Zip":20001,"Number_of_SUM":2164}},{"attributes":{"Zip":20010,"Number_of_SUM":2282}},{"attributes":{"Zip":20019,"Number_of_SUM":3278}},{"attributes":{"Zip":20011,"Number_of_SUM":3817}},{"attributes":{"Zip":20020,"Number_of_SUM":3901}},{"attributes":{"Zip":20032,"Number_of_SUM":4360}},{"attributes":{"Zip":20016,"Number_of_SUM":4681}},{"attributes":{"Zip":20002,"Number_of_SUM":5590}}]
            },
            "mappings":{
              "x": { "field": "Zip", "label": "Zip Code" },
              "y": {"field":"Number_of_SUM","label":"Total Students"}
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
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'bar', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for horizontal bar charts', function () {
        // set up input and expected output
        var datasets, series, expected;
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
              }
            }
          ];
          series = [
            {
              "category": { "field": "Zip", "label": "ZIP Code" },
              "value": { "field":"Number_of_SUM","label":"Total Students" }
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
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'bar-horizontal', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for grouped bar charts', function () {
        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services2.arcgis.com/cPVqgcKAQtE6xCja/arcgis/rest/services/SCCntyBirths2003_2012/FeatureServer/0"
            }
          ];
          series = [
            {
              "category": { "field": "NAME", "label": "Name" },
              "value": { "field":"MED_AGE_M","label":"Age" }
            },
            {
              "value": { "field":"MED_AGE_F","label":"Age" }
            },
            {
              "value": { "field":"MED_AGE","label":"Age" }
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
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'grouped', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for scatterplot chart', function () {
        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0"
            }
          ];
          series = [
            {
              "category": { "field": "Number_of", "label": "Student Enrollment (2008)" },
              "value": { "field":"F_of_teach", "label": "Fraction of Teachers" },
              "color": { "field":"Type", "label":"Facility Type" }
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
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'scatter', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for bubble scatterplot chart', function () {
        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0"
            }
          ];
          series = [
            {
              "category": { "field":"F_of_teach", "label": "Fraction of Teachers" },
              "value": { "field": "Number_of", "label": "Number_of" },
              "size": { "field": "Number_of", "label": "Number of Students" }
            }
          ];
          expected = {
            "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
            "mappings":{
              "x": { "field":"F_of_teach", "label": "Fraction of Teachers" },
              "y": { "field": "Number_of", "label": "Number_of" },
              "size": { "field": "Number_of", "label": "Number of Students" },
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
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'bubble', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for pie chart', function () {
        // Set up group by expression because pie chart sucks
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var groupByExpression = "CASE ";
        for (var i = 1, len = months.length; i <= len; i++) {
          var month = months[i - 1];
          groupByExpression = groupByExpression + "WHEN Month = " + i + " THEN '" + month + "'";
        }
        groupByExpression = groupByExpression + " END";

        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/It's_a_Tornado_Map/FeatureServer/0",
              "query": {
                "orderByFields": "FID_Count DESC",
                "groupByFieldsForStatistics": groupByExpression,
                "outStatistics": [{
                  "statisticType": "count",
                  "onStatisticField": "FID",
                  "outStatisticFieldName": "FID_Count"
                }]
              }
            }
          ];
          series = [
            {
              "category": {"field":"EXPR_1","label":"Month"},
              "value": { "field":"FID_Count","label":"Number of Tornados" },
              "radius": 270
            }
          ];
          expected = {
            "url":"https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/It's_a_Tornado_Map/FeatureServer/0",
            "query": {
              "orderByFields": "FID_Count DESC",
              "groupByFieldsForStatistics": groupByExpression,
              "outStatistics": [{
                "statisticType": "count",
                "onStatisticField": "FID",
                "outStatisticFieldName": "FID_Count"
              }]
            },
            "mappings":{
              "label": {"field":"EXPR_1","label":"Month"},
              "y": {"field":"FID_Count","label":"Number of Tornados"},
              // the pie will be 540px tall/wide
              "radius": 270
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'pie', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for sparkline chart', function () {
        // set up input and expected output
        var datasets, series, expected, data;
        beforeEach(function () {
          data = [
            {"attributes": {"date": "2000", "dc": 572046, "baltimore": 648654}},
            {"attributes": {"date": "2010", "dc": 601767, "baltimore": 621317}},
            {"attributes": {"date": "2013", "dc": 649111, "baltimore": 623404}},
            {"attributes": {"date": "2014", "dc": 658893, "baltimore": 622793}}
          ];
          datasets = [
            {
              "data": data
            }
          ];
          series = [
            {
              "category": { "field":"date", "label":"Date" },
              "value": { "field":"dc", "label":"dc" }
            }
          ];
          expected = {
            "data": data,
            "mappings":{
              "x": {"field":"date","label":"Date"},
              "y": {"field":"dc","label":"dc"},
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
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'sparkline', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for line charts', function () {
        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/It's_a_Tornado_Map/FeatureServer/0",
              "query": {
                "orderByFields": "Date"
              }
            }
          ];
          series = [
            {
              "category": { "field": "Date", "label": "Date" },
              "value": { "field":"Injuries","label":"Injuries" }
            }
          ];
          expected = {
            "url": "https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/It's_a_Tornado_Map/FeatureServer/0",
            "mappings":{
              "time": { "field": "Date", "label": "Date" },
              "value": { "field":"Injuries","label":"Injuries" }
            },
            "query": {
              "orderByFields": "Date"
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'time', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
      describe('for time trendline charts', function () {
        // set up input and expected output
        var datasets, series, expected;
        beforeEach(function () {
          datasets = [
            {
              "url": "https://services6.arcgis.com/Y3k193RFrcECJ8xA/arcgis/rest/services/Observed_Precipitation/FeatureServer/0",
              "query": {
                "where": "year > 2000",
                "orderByFields": "year"
              }
            }
          ];
          series = [
            {
              "category": { "field": "year", "label": "Year" },
              "value": { "field":"annual","label":"Total Precipitation" },
              "trendline": { "field": "trendline", "label": "" }
            }
          ];
          expected = {
            "url": "https://services6.arcgis.com/Y3k193RFrcECJ8xA/arcgis/rest/services/Observed_Precipitation/FeatureServer/0",
            "mappings":{
              "time": { "field": "year", "label": "Year" },
              "value": { "field":"annual","label":"Total Precipitation" },
              "trendline": { "field": "trendline", "label": "" }
            },
            "query": {
              "where": "year > 2000",
              "orderByFields": "year"
            }
          };
        });
        it('should handle category object', function () {
          var actual = Cedar._convertDatasetsToDataset(datasets, series, 'time-trendline', undefined);
          expect(actual).to.deep.equal(expected);
        });
      });
    });
  });
});
