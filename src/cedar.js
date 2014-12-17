'use strict';
/**
 * Cedar
 */

var Cedar = Cedar || {};


/**
 * Render a chart in the specified element
 * @param  {object} options 
 * 
 * options.elementId [required] Id of the Dom element into which the chart will be rendered
 * options.spec      [required] Cedar chart spec
 * options.token     [optional] Token to be used if the data or spec are on a secured server
 * callback  [optional] Callback with signature (err,chartObj)
 */
Cedar.show = function(options, callback){
  var err;
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
    if( callback ){
      callback( err );
    }else{
      throw err;
    }
  }

  try{
    //use vega to parse the spec 
    //it will handle the spec as an object or url
    vg.parse.spec(options.spec, function(chartCtor) { 
      //create the view
      var vegaView = chartCtor({el: options.elementId});
      //render
      vegaView.update(); 
      //if we have a callback, send the vegaView
      if(callback){
        callback(null, vegaView);
      }
    });
  }
  catch(ex){
     if(callback){
      callback(ex);
    }else{
      throw(ex);
    }
  }
};

/**
 * Generate chart json by merging a chart template with
 * a set of input mappings
 * @param  {object} chartTemplate Cedar Chart Template object
 * @param  {array} mappings      Array of mappings between the template's inputs and fields in a dataset
 * @return {object}              Cedar chart json
 */
Cedar.create = function( chartTemplate, serviceUrl, mappings ){
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
    var dataUrl = this._generateServiceQueryUrl(serviceUrl, mappings);
    //append that as data
    mappings.data = dataUrl;
    //interpolate the template and return the object
    return  JSON.parse(this._supplant(JSON.stringify(chartTemplate), mappings)); 
  
  }else{
    throw new Error('Cedar.generateChart requires a chart template object. You can use Cedar.getJson() to fetch a from a remote location.');
  }
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