'use strict';
/**
 * Cedar
 *
 * Generic charting / visualization library for the ArcGIS Platform
 * that leverages vega + d3 internally.
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
  this._definition = Cedar._defaultDefinition();

  //the vega view aka the chart
  this._view = undefined;

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
    }else if(typeof opts.definition === 'string' ){ 
      //assume it's a url (relative or abs) and fetch the definition object
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
  if(opts.specification){
    //is it an object or string(assumed to be url)
    if(typeof opts.specification === 'object'){
      //hold onto the template
      this._definition.specification = opts.specification;

    }else if(typeof opts.specification === 'string' ){ 
      //assume it's a url (relative or abs) and fetch the template object
      this._pendingXhr = true;
      Cedar.getJson(opts.specification, function(err,data){
        self._pendingXhr = false;
        self._definition.specification = data; 
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
   * Properties
   *
   * ES 5.1 syntax, so IE 8 & lower won't work
   * 
   * If the val is a url, should we expect
   * cedar to fetch the object? 
   * 
   * I'd say no... as that violates the principal 
   * of least suprise. Also - cedar has a .getJSON
   * helper method the dev should use.
   * 
   */
      
  Object.defineProperty(this, 'dataset', {
    get: function() {
        return this._definition.dataset;
    },
    set: function(val) {
       this._definition.dataset = val;
    }
  });

  Object.defineProperty(this, 'specification', {
    get: function() {
        return this._definition.specification;
    },
    set: function(val) {

      this._definition.specification = val;
    }
  });

};


/**
 * Inspect the current state of the object
 * and determine if we have sufficient information
 * to render the chart
 * @return {object} Hash of the draw state + any missing requirements
 */
Cedar.prototype.canDraw = function(){

  //dataset?
  //dataset.url || dataset.data?
  //dataset.mappings?
  //specification?
  //specification.template?
  //specification.inputs?
  //specification.inputs ~ dataset.mappings?
  
  return {drawable:true, errs:[]};

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

    var err;
    //ensure we got an elementId
    if( !options.elementId ){
      err= "Cedar.show requires options.elementId";
    }
    //TODO: check if element exists in the page
  
    //hold onto the id
    this._elementId = options.elementId;

    //hold onto the token
    if(options.token){
      this._token = options.token;
    }

    if( err ){
      throw new Error( err );
    }
    var chk = this.canDraw();
    if(chk.drawable){
      //update centralizes the spec compilation & drawing
      this.update();  
    }else{
      //report the issues
      var errs = chk.issues.join(',');
      throw new Error('Chart can not be drawn because: ' + errs);  
    }
    
  }
};

/**
 * Render the chart using the internal state
 * Should be called after a user modifies the 
 * of the dataset, query, mappings or template
 */
Cedar.prototype.update = function(){
  var self = this;
  
  if(this._view){
    //remove handlers
    //TODO Remove existing handlers
    this._remove(this._view);
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
      self._view = chartCtor({el: self._elementId});
      
      //render into the element
      self._view.update(); 

      //attach event proxies
      self._attach(self._view);

    });
  }
  catch(ex){
    throw(ex);
  }
};

/**
 * Attach the generic proxy handlers to the chart view
 */
Cedar.prototype._attach = function(view){

  view.on('mouseover', this._handler('mouseover'));
  view.on('mouseout', this._handler('mouseout'));
  view.on('click', this._handler("click"));
  
};

/**
 * Remove all event handlers from the view
 */
Cedar.prototype._remove = function(view){

  view.off('mouseover');
  view.off('mouseout');
  view.off('click');
  
};

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
Cedar._defaultDefinition = function(){
  var defn = {
    "dataset": {
      "url":""
    },
    "template":{}
  };

  defn.dataset.query = Cedar._defaultQuery();

  return defn;
};

/**
 * Default Query Object
 */
Cedar._defaultQuery = function(){
  var defaultQuery = {
    "where": "1=1",
    "returnGeometry": false,
    "returnDistinctValues": false,
    "returnIdsOnly": false,
    "returnCountOnly": false,
    "outFields": "*",
    "f": "json"
  };
  return defaultQuery;
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
 * empties the method queue by calling the queued methods
 * This helps build a more syncronous api, while still
 * doing async things in the code
 */
Cedar.prototype._purgeMethodQueue = function(){
  var self = this;
  if(self._methodQueue.length > 0){

    for(var i=0;i<self._methodQueue.length;i++){
      var action = self._methodQueue[i];
      self[action.method].apply(self, action.args);  
    }
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
 * Compile the data url into the mappings
 */
Cedar._compileMappings = function(dataset){

  //clone the query so we don't modifiy it
  var mergedQuery; 
  var defaultQuery = Cedar._defaultQuery();
  
  //ensure that we have a query
  if(dataset.query){
    mergedQuery = _.clone(dataset.query);
    //ensure we have all needed properties on the query
    //TODO: use a microlib instead of underscore
    _.defaults(mergedQuery, defaultQuery);
  }else{
    mergedQuery = defaultQuery;
    
  }

  // add any aggregations
  if(dataset.mappings.group) {
    mergedQuery.groupByFieldsForStatistics = dataset.mappings.group.field;
  }
  
  if(dataset.mappings.count) {
    mergedQuery.orderByFields = dataset.mappings.count.field + "_SUM";
    mergedQuery.outStatistics = JSON.stringify([{"statisticType": "sum", "onStatisticField": dataset.mappings.count.field, "outStatisticFieldName": dataset.mappings.count.field + "_SUM"}]);
  }

  //compile the url
  var dataUrl = dataset.url + "/query?" + this._serializeQueryParams(mergedQuery);
  
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
      var r = Cedar._getTokenValue(params, b);
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