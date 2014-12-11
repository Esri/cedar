'use strict';

var Cedar = Cedar || {};


Cedar.query = function(params) {
  var self = this;
  var options = {
    where: "1=1",
    returnGeometry: false,
    returnDistinctValues: false,
    returnIdsOnly: false,
    returnCountOnly: false,
    outFields: "*",
    f: "json"
  };
  if(params.group) {
    options.groupByFieldsForStatistics = params.group;
  }
  if(params.count) {
    options.orderByFields = params.count + "_SUM";
    options.outStatistics = JSON.stringify([
      {"statisticType": "sum", "onStatisticField": params.count, "outStatisticFieldName": params.count + "_SUM"}]);
  }
  var dataUrl = params.url + "/query?" + self.serialize(options);
  console.log('Data url: ' + dataUrl);
  return dataUrl;
};

Cedar._agolData = "http://arcgis.com/sharing/rest/content/items/{item}/data?f=json";

Cedar.chart = function(params) {
  var self = this;
  //defer to the helper to fetch the style
  self.fetchStyle(params.style, function(){
    //now generate
    self.generate(params);
  });

};



Cedar.generate = function(params){
  //check if we have data or use a query w/ the params
  params.data = params.data || Cedar.query(params);
  var chart = JSON.stringify(this.styleJson).supplant(params);
  Cedar.parse(params.el, JSON.parse(chart));
};

/**
 * Get the url of the style
 * Abstracted so we can use angular to
 * get the json via promises which is
 * nicer than callback stacks
 */
Cedar.getStyleUrl = function(styleParam){
  var style;
  if(styleParam.indexOf("http") > -1) {
    style = styleParam;
  } else if(styleParam.match(/^[a-f0-9]{32}$/)) {
    style = Cedar._agolData.supplant({item: styleParam});
  } else {
    //look for a file
    style = styleParam + ".json";
  }
  return style;
};

/**
 * Fetch the style from a url
 */
Cedar.fetchStyle = function(styleParam, cb){
  var self = this;
   //parse style
  var style = self.getStyleUrl(styleParam);

  //fetch style
  d3.json(style, function(err,spec) {
    if(err){
      console.error('Error loading ' + style + ' ' + err.message);
    }
    self.styleJson = spec;
    cb(spec);
  });
};

/**
 * Allow json to be passed in
 */
Cedar.setStyle = function(json){
 this.styleJson = json;
};

/**
 * Parse the vega spec
 */
Cedar.parse = function(el, spec) {
  vg.parse.spec(spec, function(chartCtor) { 
    //console.log(el, spec); 
    var view = chartCtor({el: el})
    //can now add event handlers via view.on('evt-name', cb)
    //we will want to bubble up the events, but also standardize
    //them from the native vega / d3 events that they are
    view.update(); 

  });
};


String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

Cedar.serialize = function(obj) {
  console.log('in serialize');
  var str = [];
  for(var p in obj){
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  var queryString = str.join("&");
  console.log('Query String ' + queryString);
  return queryString;
};