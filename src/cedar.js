/**
 * Cedar
 *
 * Generic charting / visualization library for the ArcGIS Platform
 * that leverages vega + d3 internally.
 */

(function(window){
  'use strict';

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

  if(opts.override) {
    this._definition.override = opts.override;
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
    var defaultQuery = Cedar._defaultQuery();

    if(!opts.dataset.query){
      opts.dataset.query = defaultQuery;
    }else{
      opts.dataset.query = _.defaults(opts.dataset.query, defaultQuery);
    }
    //assign it
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

  Object.defineProperty(this, 'override', {
    get: function() {
        return this._definition.override;
    },
    set: function(val) {
      this._definition.override = val;
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
    //check if element exists in the page
    if(d3.select(options.elementId)[0][0] === null){
      err = "Element " + options.elementId + " is not present in the DOM";
     }
  
    //hold onto the id
    this._elementId = options.elementId;
    this._renderer = options.renderer || "canvas"; //default to canvas

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
  
  if(this._pendingXhr){
    
    this._addToMethodQueue('update');

  }else{

    if(this._view){
      //remove handlers
      //TODO Remove existing handlers
      this._remove(this._view);
    }
    try{
      //ensure we have required inputs or defaults 
      var compiledMappings = Cedar._applyDefaultsToMappings(this._definition.dataset.mappings, this._definition.specification.inputs); //Cedar._compileMappings(this._definition.dataset, this._definition.specification.inputs);

      //compile the template + mappings --> vega spec
      var spec = JSON.parse(Cedar._supplant(JSON.stringify(this._definition.specification.template), compiledMappings)); 

      // merge in user specified style overrides
      spec = Cedar._mergeRecursive(spec, this._definition.override);

      //if the spec has a url in the data node, delete it
      if(spec.data[0].url){
        delete spec.data[0].url;
      }

      if(this._definition.dataset.data){

        //create the data node using the passed in data
        spec.data[0].values = this._definition.dataset.data;
        
        //send to vega
        this._renderSpec(spec);
      
      }else{
      
        //we need to fetch the data so
        var url = Cedar._createFeatureServiceRequest(this._definition.dataset);
      
        //create a callback closure to carry the spec
        var cb = function(err,data){
      
          //todo add error handlers for xhr and ags errors
          spec.data[0].values = data;

          //send to vega
          self._renderSpec(spec);
        };

        //fetch the data from the service
        Cedar.getJson(url, cb);
      }
    }
    catch(ex){
      throw(ex);
    }
  }
};

/**
 * Render a fully cooked spec
 */
Cedar.prototype._renderSpec = function(spec){
  var self = this;
  try{
    //use vega to parse the spec 
    //it will handle the spec as an object or url
    vg.parse.spec(spec, function(chartCtor) { 

      //create the view
      self._view = chartCtor({
        el: self._elementId,
        renderer: self._renderer
      });

      
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
 * highlight marker based on attribute value
 */
Cedar.prototype.select = function( opt ) {
  var self = this;
  var view = this._view;
  var items = view.model().scene().items[0].items[0].items;

  items.forEach(function(item) {
    if ( item.datum.data.attributes[opt.key] === opt.value ) {
      if ( item.hasPropertySet("hover") ) {
        self._view.update({props:"hover", items:item});
      }
    }
  });

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
 * Validate that the incoming data has the fields expected
 * in the mappings
 */
Cedar._validateData = function(data, mappings){
  var missingInputs = [];
  if(!data.features || !Array.isArray(data.features)){
    throw new Error('Data is expected to have features array!');
  }
  var firstRow = data.features[0].attributes;
  for(var key in mappings){
    var fld = Cedar._getMappingFieldName(key, mappings[key].field);
    if(!firstRow.hasOwnProperty(fld)){
      missingInputs.push(fld);
    }
  }
  return missingInputs;
};

/**
 * Centralize and abstract the computation of
 * expected field names, based on the mapping name
 */
Cedar._getMappingFieldName = function(mappingName, fieldName){
  var name = fieldName;
  if(mappingName.toLowerCase() === 'count'){
    name = fieldName + '_SUM';
  }
  return name;
};

/**
 * Return a default definition object
 */
Cedar._defaultDefinition = function(){
  var defn = {
    "dataset": {
      "query": this._defaultQuery()
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
 * Given a dataset hash, create the feature service
 * query string
 */

Cedar._createFeatureServiceRequest = function( dataset ){
  var mergedQuery;
  //ensure that we have a query
  if(dataset.query){
    mergedQuery = _.clone(dataset.query);
    //ensure we have all needed properties on the query
    //TODO: use a microlib instead of underscore
    _.defaults(mergedQuery, Cedar._defaultQuery());
  }else{
    mergedQuery = Cedar._defaultQuery();
  }
  //Handle bbox
  if(mergedQuery.bbox){
    //make sure a geometry was not also passed in
    if(mergedQuery.geometry){
      throw new Error('Dataset.query can not have both a geometry and a bbox specified');
    }
    //get the bbox (W,S,E,N)
    var bboxArr = mergedQuery.bbox.split(',');

    //remove it so it's not serialized as-is
    delete mergedQuery.bbox;

    //cook it into a json string 
    mergedQuery.geometry = JSON.stringify({"xmin": bboxArr[0], "ymin": bboxArr[2],"xmax": bboxArr[1], "ymax": bboxArr[3] });
    //set the spatial ref as geographic
    mergedQuery.inSR = '4326';
  }
  if(dataset.mappings.group) {
      mergedQuery.groupByFieldsForStatistics = dataset.mappings.group.field;
  }
  if(dataset.mappings.count) {
    mergedQuery.orderByFields = dataset.mappings.count.field + "_SUM";
    mergedQuery.outStatistics = JSON.stringify([{"statisticType": "sum", "onStatisticField": dataset.mappings.count.field, "outStatisticFieldName": dataset.mappings.count.field + "_SUM"}]);
  }

  var url = dataset.url + "/query?" + this._serializeQueryParams(mergedQuery);
  
  if(dataset.token){
    url = url + '&token=' + dataset.token;
  }
  
  return url;
};

Cedar._applyDefaultsToMappings = function(mappings, inputs){
  var errs = [];
  //loop over the inputs
  for(var i =0; i < inputs.length; i++){
    //get the input
    var input = inputs[i];

    //if it's required and not in the mappings, add an exception
    if(input.required && !mappings[input.name] ){
      errs.push(input.name);
    }
    
    //if it's not required, has a default and not in the mappings
    if(!input.required && !mappings[input.name] && input.default){
      //add the default
      mappings[input.name] = input.default;
    }
  }

  if(errs.length > 0){
    throw new Error('Required Mappings Missing: ' + errs.join(','));
  }else{
    return mappings;
  }
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

/*
* Recursively merge properties of two objects 
*/
Cedar._mergeRecursive = function(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor===Object || obj2[p].constructor===Array) {
        obj1[p] = Cedar._mergeRecursive(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
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

window.Cedar = Cedar;

})(window);