'use strict';
/**
 * Cedar
 */


/**
 * Constructor
 * @param {object} options Cedar options
 */
var Cedar = function Cedar(options){
  
  this.view = {};
  this.options = options;
  this._events = [];
};


/**
 * Render a chart in the specified element
 * @param  {object} options 
 * 
 * options.elementId [required] Id of the Dom element into which the chart will be rendered
 * options.spec      [required] Cedar chart spec
 * options.token     [optional] Token to be used if the data or spec are on a secured server
 */
Cedar.prototype.show = function(options){
  var err, self = this;
  //ensure we got an elementId
  if( !options.elementId ){
    err= "Cedar.render requires options.elementId";
  }

  //ensure we got a spec 
  if( !options.spec ){
    err = "Cedar.render requires options.spec";
  }

  //if we have any errors, fire callback or throw
  if( err ){
    throw err;
  }

  try{
    //use vega to parse the spec 
    //it will handle the spec as an object or url
    vg.parse.spec(options.spec, function(chartCtor) { 
      //create the view
      self.view = chartCtor({el: options.elementId});
      //render
      self.view.update(); 
      self.attach(self.view);

    });
  }
  catch(ex){
    throw(ex);
  }
};





/**
 * Attach the generic handler to the chart view
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
Cedar.prototype.create = function( chartTemplate, serviceUrl, mappings ){
  //TODO: add more validation of chart template object
  if( chartTemplate !== null && typeof chartTemplate === 'object'){
    
    var input, err = '';
    //check that we have mappings for the inputs 
    for(var i=0;i<chartTemplate.inputs.length;i++){
      input = chartTemplate.inputs[i];
      if(input.required){
        if(!mappings[input.name]){
          err += 'Missing mapping for template input: ' + input.name + ' ';
        }
      }
    }
    if(err){
      throw new Error( err );
    }

    //add the query string to the serviceUrl
    var dataUrl = Cedar._generateServiceQueryUrl(serviceUrl, mappings);
    //append that as data
    mappings.data = dataUrl;
    //interpolate the template and return the object
    return  JSON.parse(Cedar._supplant(JSON.stringify(chartTemplate), mappings)); 
  
  }else{
    throw new Error('Cedar.generateChart requires a chart template object. You can use Cedar.getJson() to fetch a from a remote location.');
  }
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
  //alt option if events[type]
  //
};

/**
 * Add a handler for the named event
 */
Cedar.prototype.on = function(evtName, callback){

  this._events.push({"type":evtName, "callback":callback});

  //or should we hold the hash by type
  //events = this._events[evtName] || (this._events[evtName]=[]);
  //events.push(callback);

};

/**
 * Remove a handler for the named event
 */
Cedar.prototype.off = function(evtName, callback){
  console.log('Handler for ' + evtName +' removed...');
};

/**
 * fetch json from a url
 * @param  {string}   url      Url to json file
 * @param  {Function} callback node-style callback function (err, data)
 */
Cedar.getJson = function( url, callback ){
  d3.json(url, function(err,spec) {
    if(err){
      callback('Error loading ' + url + ' ' + err.message);
    }
    callback(null, spec);
  });
};

/**
 * Generate a correct service url w/ query string
 * so that vega can fetch data
 * @param  {object} params Hash of params for the query
 * @return {string}        Data url
 */
Cedar._generateServiceQueryUrl = function(serviceUrl, params) {

  //TODO: limit out fields to those required by the chart unless params specifies outfields
  //TODO: support where clause from params
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

  var dataUrl = serviceUrl + "/query?" + this._serializeQueryParams(options);
  
  return dataUrl;
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
      var r = params[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
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