'use strict';
/**
 * Cedar
 */


/**
 * Constructor
 * @param {object} options Cedar options
 */
var Cedar = function Cedar(options){
  //close over this for use in callbacks
  var self = this;

  //ensure an opts object
  var opts = options || {};

  /**
   * Internals for holding state
   */

  // Array to hold event handlers
  this._events = [];

  //initialize the internal definition hash
  this._definition = Cedar._getDefaultDefinition();

  //the vega view aka the chart
  this._view = {};

  //queue to hold methods called while
  //xhrs are in progress
  this._methodQueue=[];

  /**
   * Flag used to determine if the library is
   * waiting for an xhr to return. 
   */
  this._pendingXhr = false;

  //defintion 
  if(opts.definition){
    //is it an object or string(assumed to be url)
    if(typeof opts.definition === 'object'){
      //hold onto the definition
      this._definition = opts.definition;
    }else if(typeof opts.definition === 'string') {
      //need to fetch the definition object
      this._pendingXhr = true;
      Cedar.getJson(opts.definition, function(err,data){
        self._pendingXhr = false;
        self._definition = data; 
        self._purgeMethodQueue();
      });
    }else{
      throw new Error('parameter definition must be an object or string (url)');
    }
  }

  //template
  if(opts.template){
    //is it an object or string(assumed to be url)
    if(typeof opts.template === 'object'){
      //hold onto the template
      this._definition.template = opts.template;

    }else if(typeof opts.template === 'string') {
      //need to fetch the template object
      this._pendingXhr = true;
      Cedar.getJson(opts.template, function(err,data){
        self._pendingXhr = false;
        self._definition.template = data; 
        self._purgeMethodQueue();
      });
    }else{
      throw new Error('parameter template must be an object or string (url)');
    }
  }

  //allow a dataset to be passed in...
  if(opts.dataset && typeof opts.dataset === 'object'){
    this._definition.dataset = opts.dataset;
  }

  /**
   * Setup properties
   */
  Object.defineProperty(this, 'dataset', {
    get: function() {
        return this._definition.dataset;
    },
    set: function(val) {
       this._definition.dataset = val;
    }
  });

  Object.defineProperty(this, 'template', {
    get: function() {
        return this._definition.template;
    },
    set: function(val) {
       this._definition.template = val;
    }
  });

};


/**
 * Render a chart in the specified element
 * @param  {object} options 
 * 
 * options.elementId [required] Id of the Dom element into which the chart will be rendered
 * options.token     [optional] Token to be used if the data or spec are on a secured server
 */
Cedar.prototype.show = function(options){
  if(this._pendingXhr){
    
    this._addToMethodQueue('show', [options]);

  }else{
    var err, self = this;
    //ensure we got an elementId
    if( !options.elementId ){
      err= "Cedar.render requires options.elementId";
    }

    //if we have any errors, fire callback or throw
    if( err ){
      //TODO: make this an error object
      throw err;
    }

    try{
      //extend the mappings w the data
      var compiledMappings = Cedar._compileMappings(this._definition.dataset);

      //compile the template + dataset --> vega spec
      var spec = JSON.parse(Cedar._supplant(JSON.stringify(this._definition.specification.template), compiledMappings)); 
      //use vega to parse the spec 
      //it will handle the spec as an object or url
      vg.parse.spec(spec, function(chartCtor) { 

        //create the view
        self._view = chartCtor({el: options.elementId});
        
        //render into the element
        self._view.update(); 

        //attach event proxies
        self.attach(self._view);

      });
    }
    catch(ex){
      throw(ex);
    }
  }
};


/**
 * Attach the generic proxy handlers to the chart view
 */
Cedar.prototype.attach = function(view){

  view.on('mouseover', this._handler('mouseover'));
  view.on('mouseout', this._handler('mouseout'));
  view.on('click', this._handler("click"));
  
};


/**
 * Generate chart json by merging a chart template with
 * a set of input mappings
 * @param  {object} chartTemplate Cedar Chart Template object
 * @param  {array} mappings      Array of mappings between the template's inputs and fields in a dataset
 * @return {object}              Cedar chart json
 */
// Cedar.prototype.create = function( chartTemplate, serviceUrl, mappings ){
//   //TODO: add more validation of chart template object
//   if( chartTemplate !== null && typeof chartTemplate === 'object'){
//     //check that we have mappings for the inputs 
//     var missingFields = this._validateMappings(chartTemplate.inputs, mappings);
//     if(missingFields.length > 0){
//       throw new Error( "Missing mappings for " + missingFields.join(',') );
//     }

//     //hold onto the mappings
//     this.mappings = mappings;
//     this._template = chartTemplate;

//     //add the query string to the serviceUrl
//     var dataUrl = Cedar._generateServiceQueryUrl(serviceUrl, mappings);
//     //append that as data
//     mappings.data = dataUrl;
//     //interpolate the template and return the object
//     return  JSON.parse(Cedar._supplant(JSON.stringify(chartTemplate), mappings)); 
  
//   }else{
//     throw new Error('Cedar.generateChart requires a chart template object. You can use Cedar.getJson() to fetch a from a remote location.');
//   }
// };

/**
 * Helper function that validates that the 
 * mappings hash contains values for all
 * the inputs
 * @param  {array} inputs   Array of inputs
 * @param  {object} mappings Hash of mappings
 * @return {array}          Missing mappings
 */
Cedar._validateMappings = function(inputs, mappings){
  var missingInputs = [], input;
  for(var i=0;i<inputs.length;i++){
    input = inputs[i];
    if(input.required){
      if(!mappings[input.name]){
        missingInputs.push(input.name);
      }
    }
  }
  return missingInputs;
};

/**
 * Return a default definition object
 */
Cedar._getDefaultDefinition = function(){
  var defn = {
    "dataset": {
      "url":"",
      "query":{
        "where": "1=1",
        "returnGeometry": false,
        "returnDistinctValues": false,
        "returnIdsOnly": false,
        "returnCountOnly": false,
        "outFields": "*",
        "f": "json"
      }
    },
    "template":{}
  };
  return defn;
};


/**
 * Compile a template + dataSource + mappings 
 * into a chart spec.
 */

// Cedar.prototype.cook = function(template, dataSource, mappings){
  
//   var missingFields = Cedar._validateMappings(template.inputs, mappings);
//   if(missingFields.length > 0){
//     throw new Error( "Missing mappings for " + missingFields.join(',') );
//   }

//   //create a chart json object from the inputs
//   var chart = {
//     "configuration":{
//       "inputs": template.inputs,
//       "data": dataSource,
//       "mappings": mappings
//     },
//     "template":template
//   };
//   //remove the inputs from the template
//   if(chart.template.inputs){
//     delete chart.template.inputs;
//   }

//   //assign to the chart property
//   this.chart = chart;

//   var dataUrl = Cedar._generateServiceQueryUrl(dataSource, mappings);

//   //append that as data
//   mappings.dataUrl = dataUrl;

//   //compile the chart into a vega spec
//   return JSON.parse(Cedar._supplant(JSON.stringify(chart.template), mappings));

// };

/**
 * Re-Render the chart using the internal state of things...
 */
Cedar.prototype.update = function(){

};

/**
 * Generic event handler proxy
 */
Cedar.prototype._handler = function(evtName) {
  var self = this;
  //return a handler function w/ the events hash closed over
  var handler = function(evt, item){
    self._events.forEach( function(registeredHandler){
      if(registeredHandler.type === evtName){
        //invoke the callback with the data
        registeredHandler.callback(item.datum.data.attributes);
      }
    });
  };
  return handler;
};

/**
 * Add a handler for the named event
 */
Cedar.prototype.on = function(evtName, callback){
  this._events.push({"type":evtName, "callback":callback});
};

/**
 * Remove a handler for the named event
 */
Cedar.prototype.off = function(evtName /*, callback */){
  console.log('Handler for ' + evtName +' removed...');
};
/**
 * Creates an entry in the method queue, excuted 
 * once a pending xhr is completed 
 */
Cedar.prototype._addToMethodQueue = function(name, args){
  this._methodQueue.push({ method: name, args: args });
};
/**
 * empties the method queue
 * @return {[type]} [description]
 */
Cedar.prototype._purgeMethodQueue = function(){
  var self = this;
  if(self._methodQueue.length > 0){
    console.log('    Purge method queue'); 
    for(var i=0;i<self._methodQueue.length;i++){
      var action = self._methodQueue[i];
      console.log('   * methodQueue Calling ' + action.method);
      self[action.method].apply(self, action.args);  
    }
    // _.each(this.methodQueue, function(action, i){
      
    // });
  }
};

/**
 * fetch json from a url
 * @param  {string}   url      Url to json file
 * @param  {Function} callback node-style callback function (err, data)
 */
Cedar.getJson = function( url, callback ){
  d3.json(url, function(err,data) {
    if(err){
      callback('Error loading ' + url + ' ' + err.message);
    }
    callback(null, data);
  });
};

/**
 * Generate a correct service url w/ query string
 * so that vega can fetch data
 * @param  {object} params Hash of params for the query
 * @return {string}        Data url
 */
// Cedar._generateServiceQueryUrl = function(dataSource, mappings) {

//   var defaultQuery = {
//     "where": "1=1",
//     "returnGeometry": false,
//     "returnDistinctValues": false,
//     "returnIdsOnly": false,
//     "returnCountOnly": false,
//     "outFields": "*",
//     "f": "json"
//   };

//   //ensure that we have a query
//   if(!dataSource.query){
//     dataSource.query = defaultQuery;
//   }else{
//     //TODO: use a microlib instead of underscore
//     _.defaults(dataSource.query, defaultQuery);
//   }

//   // add any aggregations
//   if(mappings.group) {
//     dataSource.query.groupByFieldsForStatistics = mappings.group.field;
//   }
  
//   if(mappings.count) {
//     dataSource.query.orderByFields = mappings.count.field + "_SUM";
//     dataSource.query.outStatistics = JSON.stringify([{"statisticType": "sum", "onStatisticField": mappings.count.field, "outStatisticFieldName": mappings.count.field + "_SUM"}]);
//   }

//   var dataUrl = dataSource.url + "/query?" + this._serializeQueryParams(dataSource.query);
  
//   return dataUrl;
// };


/**
 * compile the data url into the mappings
 */
Cedar._compileMappings = function(dataset){

  //clone the query so we don't modifiy it
  var compiledQuery; 

  //TODO: centralize the default query
  var defaultQuery = {
    "where": "1=1",
    "returnGeometry": false,
    "returnDistinctValues": false,
    "returnIdsOnly": false,
    "returnCountOnly": false,
    "outFields": "*",
    "f": "json"
  };
  
  //ensure that we have a query
  if(dataset.query){
    compiledQuery = _.clone(dataset.query);
    //ensure we have all needed properties on the query
    //TODO: use a microlib instead of underscore
    _.defaults(compiledQuery, defaultQuery);
  }else{
    compiledQuery = defaultQuery;
    
  }

  // add any aggregations
  if(dataset.mappings.group) {
    compiledQuery.groupByFieldsForStatistics = dataset.mappings.group.field;
  }
  
  if(dataset.mappings.count) {
    compiledQuery.orderByFields = dataset.mappings.count.field + "_SUM";
    compiledQuery.outStatistics = JSON.stringify([{"statisticType": "sum", "onStatisticField": dataset.mappings.count.field, "outStatisticFieldName": dataset.mappings.count.field + "_SUM"}]);
  }

  //compile the url
  var dataUrl = dataset.url + "/query?" + this._serializeQueryParams(compiledQuery);
  
  //clone the mappings and extend it
  //TODO: add cloning microlib
  var cloneMappings = _.clone(dataset.mappings);

  //attach the data node and return
  cloneMappings.data = dataUrl;

  return cloneMappings;
};



/**
 * Token Replacement on a string
 * @param  {string} template string template
 * @param  {object} params   object hash that maps to the tokens to be replaced
 * @return {string}          string with values replaced
 */
Cedar._supplant = function( tmpl, params ){
  console.log('Mappings: ', params);
  return tmpl.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = Cedar._getTokenValue(params, b);//params[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

/**
 * Get the value of a token from a hash
 * @param  {[type]} tokens    [description]
 * @param  {[type]} tokenName [description]
 * @return {[type]}           [description]
 * Pulled from gulp-token-replace (MIT license)
 * https://github.com/Pictela/gulp-token-replace/blob/master/index.js
 * 
 */
Cedar._getTokenValue = function(tokens, tokenName) {
  var tmpTokens = tokens;
  var tokenNameParts = tokenName.split('.');
  for (var i = 0; i < tokenNameParts.length; i++) {
    if (tmpTokens.hasOwnProperty(tokenNameParts[i])) {
      tmpTokens = tmpTokens[tokenNameParts[i]];
    } else {
      return null;
    }
  }
  return tmpTokens;
};

/**
 * Serilize an object into a query string
 * @param  {object} params Params for the query string
 * @return {string}        query string
 */
Cedar._serializeQueryParams = function(params) {
  var str = [];
  for(var p in params){
    if (params.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
    }
  }
  var queryString = str.join("&");
  return queryString;
};