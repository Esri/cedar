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
    var fakeDefinition;
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
      
    });

    it("should accept options.specification as an object ", function() {
      
    });

    it("should not throw if options.template === string and ! contains http", function() {
      var fct = function(){
        var x = new Cedar({ specification:'/bar/baz.json' });
      }
      expect(fct).not.to.throw();
    });



  });


  describe('properties', function () {
  
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

  describe('drawing a chart', function () {
  
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


