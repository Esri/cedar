/**
* arcgis-cedar - v0.9.0 - Thu Feb 23 2017 16:55:27 GMT-0500 (EST)
* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
* Apache-2.0
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('vega')) :
	typeof define === 'function' && define.amd ? define(['d3', 'vega'], factory) :
	(global.Cedar = factory(global.d3,global.vg));
}(this, (function (d3,vg) { 'use strict';

var version = "0.9.0";

/**
 * Merges n objects
 * @param  {object} source Empty object that other objects will be merged into
 * @return {Object}        Merged objects
 */
function mixin (source) {
  var i$1 = arguments.length, argsArray = Array(i$1);
  while ( i$1-- ) argsArray[i$1] = arguments[i$1];

  var args = [].concat( argsArray );
  for (var i = 1; i < args.length; i++) {
    d3.entries(args[i]).forEach(function (p) {
      source[p.key] = p.value;
    });
  }
  return source;
}

/**
 * Recursively merge properties of two objects
 */
function mergeRecursive (obj1, obj2) {
  for (var p in obj2) {
    if (obj2.hasOwnProperty(p)) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor === Object || obj2[p].constructor === Array) {
          obj1[p] = mergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value
        obj1[p] = obj2[p];
      }
    }
  }
  return obj1;
}

/**
 * Token replacement on a string
 * @param  {string} template string template
 * @param  {object} params   Object hash that maps to the tokens to be replaced
 * @return {string}          string with values replaced
 */
function supplant (template, params) {
  var t = template.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = getTokenValue(params, b);

      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
  return t.replace(/"{([^{}]*)}"/g,
    function (a, b) {
      var r = getTokenValue(params, b);
      return (!!r && r.constructor === Array) ? JSON.stringify(r) : a;
    });
}

/**
  * Get the value of a token from a hash
  * @param  {object} tokens    Hash {a: 'a', b: { c: 'c'} }
  * @param  {string} tokenName Property name: 'a' would yield 'a', 'b.c' would yield 'c'
  * @return {Any}           Returns value contained within property
  * Pulled from gulp-token-replace (MIT license)
  * https://github.com/Pictela/gulp-token-replace/blob/master/index.js
 */
function getTokenValue (tokens, tokenName) {
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
}

 /**
  * Helper function that validates that the
  * mappings hash contains values for all
  * the inputs
  * @param  {array} inputs   Array of inputs
  * @param  {object} mappings Hash of mappings
  * @return {array}          Missing mappings
  * @access private
  */
function validateMappings (inputs, mappings) {
  return inputs.filter(function (input) {
    if (input.required && !mappings[input.name]) {
      return input;
    }
  });
}

 /**
  * Validate that the incoming data has the fields expected
  * in the mappings
  * @access private
  */
function validateData (data, mappings) {
  var missingInputs = [];
  if (!data.features || !Array.isArray(data.features)) {
    throw new Error('Data is expected to have features array!');
  }
  var firstRow = data.features[0].attributes;
  for (var key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      var fld = getMappingFieldName(key, mappings[key].field);
      if (!firstRow.hasOwnProperty(fld)) {
        missingInputs.push(fld);
      }
    }
  }
  return missingInputs;
}

 /**
  * TODO does nothing, must figure out.
  * Centralize and abstract the computation of
  * expected field names, based on the mapping name
  * @access private
  */
function getMappingFieldName (mappingName, fieldName) {
  // this function why?

  var name = fieldName;
   // if(mappingName.toLowerCase() === 'count'){
   //  name = fieldName + '_SUM';
   // }
  return name;
}

var utils = {
  mixin: mixin,
  supplant: supplant,
  mergeRecursive: mergeRecursive,
  getTokenValue: getTokenValue,
  validateMappings: validateMappings,
  validateData: validateData,
  getMappingFieldName: getMappingFieldName
};

/**
 * Return a default definition Object
 * @return {Object} Default definition
 */
function defaultDefinition () {
  return {
    dataset: {
      query: defaultQuery()
    },
    template: {}
  };
}

/**
 * Return AGO query defaults
 * @return {Object} Default query
 */
function defaultQuery () {
  return {
    where: '1=1',
    returnGeometry: false,
    returnDistinctValues: false,
    returnIdsOnly: false,
    returnCountOnly: false,
    outFields: '*',
    sqlFormat: 'standard',
    f: 'json'
  };
}

/**
 * Ensure that all required inputs exist in mappings
 * @param  {object} mappings Mappings object
 * @param  {array} inputs   Array of inputs in specification
 * @return {object}          Returns mappings
 */
function applyDefaultsToMappings (mappings, inputs) {
  var errs = [];
  // iterate over inputs
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];

    // If required but not there
    if (input.required && !mappings[input.name]) {
      errs.push(input.name);
    }

    // if it's not required, has a default and not in the mappings
    if (!input.required && !mappings[input.name] && input['default']) {
      // add the default
      mappings[input.name] = input['default'];
    }
  }
  if (errs.length > 0) {
    throw new Error(("Required Mappings Missing: " + (errs.join(','))));
  } else {
    return mappings;
  }
}

/**
 * Convert datasets to dataset
 */
function convertDatasetsToDataset (datasets, series, chartType, dataset) {
  // console.log('Datasets and dataset are:', datasets, dataset);
  if (!dataset) {
    dataset = {
      query: this.defaultQuery()
    };
  }
  // Mappings held here
  var mappings = {};
  // Queries held here
  var queries = [];
  // Urls held here
  var urls = [];
  // Data held here
  var data = [];

  datasets.forEach(function (dtst) {
    // Push queries data and urls first
    if (dtst.query) {
      queries.push(dtst.query);
    }
    if (dtst.url) {
      urls.push(dtst.url);
    }
    if (dtst.data) {
      data.push(dtst.data);
    }
    // Construct mappings
    // Grouped bar chart here
    if (chartType === 'grouped') {
      if (!mappings.group) {
        mappings.group = series[0].category;
      }
      if (!mappings.x) {
        mappings.x = {
          field: [],
          label: series[0].value.label
        };
      }
      if (series.length > 1) {
        series.forEach(function (attr) {
          mappings.x.field.push(("attributes." + (attr.value.field)));
        });
      } else {
        mappings.x.field.push(("attributes." + (series[0].value.field)));
      }

      // Bubble Chart starts here
    } else if (chartType === 'bubble') {
      mappings.x = series[0].category;
      mappings.y = series[0].value;
      mappings.size = series[0].size;

      // Scatter plot starts here
    } else if (chartType === 'scatter') {
      mappings.x = series[0].category;
      mappings.y = series[0].value;
      mappings.color = series[0].color;

      // Pie Chart starts here
    } else if (chartType === 'pie') {
      mappings.label = series[0].category;
      mappings.y = series[0].value;
      mappings.radius = series[0].radius;

      // Bar horizontal starts here
    } else if (chartType === 'bar-horizontal') {
      mappings.y = series[0].category;
      mappings.x = series[0].value;

      // Timeline chart starts here
    } else if (chartType === 'time') {
      mappings.time = series[0].category;
      mappings.value = series[0].value;

      // time-trendline chart starts here
    } else if (chartType === 'time-trendline') {
      mappings.time = series[0].category;
      mappings.value = series[0].value;
      mappings.trendline = series[0].trendline;

    // X Y only charts here
    } else {
      mappings.x = series[0].category;
      mappings.y = series[0].value;
    }
  });

  var builtDataset = {
    query: convertQueries(queries, dataset.query),
    mappings: mappings
  };
  if (data.length > 0) {
    builtDataset.data = data[0];
  }

  if (urls.length > 0) {
    builtDataset.url = convertUrls(urls);
  }

  return builtDataset;
}

/**
 * Convert over query
 */
function convertQueries (queries, defaultQuery) {
  if (queries.length > 1) {
    console.warn('Warning, currently multiple queries is not supported. Reverting to default.', queries);
    return defaultQuery;
  }
  return queries[0] ? queries[0] : defaultQuery; // Might not have a query passed in so check and if it hasn't then return default query
}

/**
 * Convert over URLs
 */
function convertUrls (urls) {
  if (urls.length > 1) {
    console.warn('Warning, currently multiple URLS are not supported. Using first url', urls);
    return urls[0];
  }
  return urls[0];
}

var specUtils = {
  defaultDefinition: defaultDefinition,
  defaultQuery: defaultQuery,
  applyDefaultsToMappings: applyDefaultsToMappings,
  convertDatasetsToDataset: convertDatasetsToDataset
};

/**
 * Takes in params, iterates over them, encodes and returns stringified and encoded query
 *
 * @param {object} params - merged default and user defined parameters
 *
 * @returns {string} - stringified and encoded query
 */
function serializeQueryParams (params) {
  var str = [];
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      var val = params[param];
      if (typeof val !== 'string') {
        val = JSON.stringify(val);
      }
      str.push(((encodeURIComponent(param)) + "=" + (encodeURIComponent(val))));
    }
  }
  var queryString = str.join('&');
  return queryString;
}

/**
 * Helper function to request JSON from a url
 * @param  {string}   url      URL to request from
 * @param  {Function} callback Callback function
 * @param  {number}   timeout  Timeout on request
 * @return {object}            Response object
 */
function getJson$1 (url, callback, timeout) {
  var cb = function (err, data) {
    // if timeout error then return a timeout error
    if (err && err.response === '') {
      callback(new Error('This service is taking too long to respond, unable to chart'));
    } else if (err) {
      // Other errors return generic error.
      callback(new Error(("Error loading " + url + " with a response of: " + (err.message))));
    } else {
      callback(null, JSON.parse(data.responseText));
    }
  };
  if (url.length > 2000) {
    var uri = url.split('?');
    d3.xhr(uri[0])
      .on('beforesend', function (xhr$$1) { xhr$$1.timeout = timeout; xhr$$1.ontimeout = xhr$$1.onload; })
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .post(uri[1], cb);
  } else {
    d3.xhr(url)
      .on('beforesend', function (xhr$$1) { xhr$$1.timeout = timeout; xhr$$1.ontimeout = xhr$$1.onload; })
      .get(cb);
  }
}

/**
 * Given a dataset hash create a feature service request
 * @param  {object} dataset       Dataset object
 * @param  {object} queryFromSpec Query passed in by the user
 * @return {string}               url string
 */
function createFeatureServiceRequest (dataset, queryFromSpec) {
  var mergedQuery = mixin({}, defaultQuery(), queryFromSpec);

  // Handle bbox
  if (mergedQuery.bbox) {
    // make sure a geometry was not also passed in
    if (mergedQuery.geometry) {
      throw new Error('Dataset.query can not have both a geometry and a bbox specified');
    }
    // Get the bbox (w,s,e,n)
    var bboxArr = mergedQuery.bbox.split(',');

    // Remove it so it's not serialized as-is
    delete mergedQuery.bbox;

    // cook it into a json string
    mergedQuery.geometry = JSON.stringify({
      xmin: bboxArr[0],
      ymin: bboxArr[2],
      xmax: bboxArr[1],
      ymax: bboxArr[3]
    });
    // set spatial ref as geographic
    mergedQuery.inSR = '4326';
  }

  if (!mergedQuery.groupByFieldsForStatistics && !!dataset.mappings.group) {
    mergedQuery.groupByFieldsForStatistics = dataset.mappings.group.field;
  }
  if (!mergedQuery.outStatistics && !!dataset.mappings.count) {
    // TODO Why are we explicitlystating _SUM as a stats type?
    mergedQuery.orderByFields = (dataset.mappings.count.field) + "_SUM";
    mergedQuery.outStatistics = JSON.stringify([{
      statisticType: 'sum',
      onStatisticField: dataset.mappings.count.field,
      outStatisticFieldName: ((dataset.mappings.count.field) + "_SUM")
    }]);
  }

    // iterate the mappings keys to check for sort
    // -----------------------------------------------------------------
    // This approach would seem 'clean' but if there are multiple fields
    // to sort by, the order would be determined by how javascript decides to
    // iterate the mappings property hash.
    // Thus, using mappings.sort gives the developer explicit control
    // -----------------------------------------------------------------
    // var sort = [];
    // for (var property in dataset.mappings) {
    //   if (dataset.mappings.hasOwnProperty(property)) {
    //     if(dataset.mappings[property].sort){
    //       //ok - build up the sort
    //       sort.push(dataset.mappings[property].field + ' ' + dataset.mappings[property].sort);
    //     }
    //   }
    // }
    // if(sort.length > 0){
    //   mergedQuery.orderByFields = sort.join(',');
    // }
    // -----------------------------------------------------------------
    // check for a sort passed directly in

  if (dataset.mappings.sort) {
    mergedQuery.orderByFields = dataset.mappings.sort;
  }

  var url = (dataset.url) + "/query?" + (serializeQueryParams(mergedQuery));

  if (dataset.token) {
    url = url + "&token=" + (dataset.token);
  }

  return url;
}

var requestUtils = {
  getJson: getJson$1,
  createFeatureServiceRequest: createFeatureServiceRequest
};

// import specTemplates from './charts/specs';
// get cedar root URL for loading chart specs
var baseUrl = (function () {
  var cdnProtocol = 'http:';
  var cdnUrl = '//esri.github.io/cedar/js';
  var src;
  if (window && window.document) {
    src = (window.document.currentScript && window.document.currentScript.src);
    if (src) {
      // real browser, get base url from current script
      return src.substr(0, src.lastIndexOf('/'));
    } else {
      // ie, set base url to CDN
      // NOTE: could fallback to CDN only if can't find any scripts named cedar
      return (window.document.location ? window.document.location.protocol : cdnProtocol) + cdnUrl;
    }
  } else {
    // node, set base url to CDN
    return cdnProtocol + cdnUrl;
  }
})();

var Cedar = function Cedar (options) {
  var this$1 = this;

  this.version = version;
  // Pull templates in
  // this.chartTypes = specTemplates;

  var opts = options || {};

  var spec;

  this.baseUrl = baseUrl;
  this.chartTypes = ['bar', 'bar-horizontal', 'bubble', 'grouped', 'pie', 'scatter', 'sparkline', 'time', 'time-trendline'];

  // Cedar configs such as size..
  this.width = undefined;
  this.height = undefined;
  this.autolabels = true;
  this.maxLabelLength = undefined;

  // Array to hold event handlers
  this._events = [];

  // initialize internal definition
  this._definition = specUtils.defaultDefinition();

  // initialize vega view aka chart
  this._view = undefined;

  // the vega tooltip
  this._tooltip = undefined;

  // transform function
  this._transform = undefined;

  // Queue to hold methods called while xhrs are in progress
  this._methodQueue = [];

  // Set a base timeout
  this._timeout = undefined;

  // override the base timeout
  if (opts.timeout) {
    this._timeout = opts.timeout;
  }

  // override the base url
  if (opts.baseUrl) {
    this.baseUrl = opts.baseUrl;
  }

  /**
   * Flag used to determine if the library is waiting for an xhr to return.
   * @access private
   */
  this._pendingXhr = false;

  /**
   * Definition
   */

  if (opts.definition) {
    if (typeof opts.definition === 'object') {
      // hold onto the definition
      this._definition = opts.definition;
    } else if (typeof opts.definition === 'string') {
      // assume it's a url (relative or absolute) and fetch the def object
      this._pendingXhr = true;
      requestUtils.getJson(opts.definition, function (err, data) {
        if (err) {
          throw new Error('Error fetching definition object', err);
        }
        this$1._pendingXhr = false;
        this$1._definition = data;
        this$1._purgeMethodQueue();
      }, this._timeout);
    } else {
      throw new Error('parameter definition must be an object or string (url)');
    }
  }

  // if there are overrides
  if (opts.override) {
    this._definition.override = opts.override;
  }

  /**
   * Specs
   */

  // first, check for pre-defined chart type passed in as 'type'
  this._chartType = opts.type;
  spec = this._getSpecificationUrl(opts.type);

  // If url or object passed use that...
  if (opts.specification) {
    spec = opts.specification;
  }

  if (spec) {
    // is it an object or string, assumed to be url
    if (typeof spec === 'object') {
      // hold onto the template
      this._definition.specification = spec;
    } else if (typeof spec === 'string') {
      // assume it's a url (rel or abs) and fetch the template object
      this._pendingXhr = true;
      this._pendingXhr = true;
      requestUtils.getJson(spec, function (err, data) {
        if (err) {
          throw new Error('Error fetching template object', err);
        }
        this$1._pendingXhr = false;
        this$1._definition.specification = data;
        this$1._purgeMethodQueue();
      }, this._timeout);
    } else {
      throw new Error('parameter specification must be an object or string (url)');
    }
  }

  // Allow a dataset to be passed in....
  if (opts.dataset && typeof opts.dataset === 'object') {
    opts.dataset.query = utils.mixin({}, specUtils.defaultQuery(), opts.dataset.query);
    // Assign it
    this._definition.dataset = opts.dataset;
  }

  // Allow datasets to be passed in
  if (opts.datasets && Array.isArray(opts.datasets)) {
    this._definition.datasets = opts.datasets;
  }

  // Allow series to be passed in
  if (opts.series && Array.isArray(opts.series)) {
    this._definition.series = opts.series;
  }

  /**
   * Tooltip
   */
  // allow a tooltip to be passed in...
  if (opts.tooltip && typeof opts.tooltip === 'object') {
    this.tooltip = opts.tooltip;
  } else {
    // Build a default tooltip based on first two imputs....
    var inputs = [];
    for (var input in this._definition.dataset.mappings) {
      if (this$1._definition.dataset.mappings.hasOwnProperty(input)) {
        var field = this$1._definition.dataset.mappings[input].field;
        if (field !== undefined && field !== null) {
          inputs.push(field);
        }
      }
    }
    if (inputs.length >= 2) {
      this.tooltip = {
        'title': ("{" + (inputs[0]) + "}"),
        'content': ("{" + (inputs[1]) + "}")
      };
    }
  }

  /**
   * tranform
   */
  // Allow a transform func to pass in
  if (opts.transform && typeof opts.transform === 'function') {
    this._transform = opts.transform;
  }
};

var prototypeAccessors = { dataset: {},datasets: {},series: {},specification: {},override: {},tooltip: {},transform: {} };

/**
 * Properties
 */
// Dataset - old api
prototypeAccessors.dataset.get = function () {
  return this._definition.dataset;
};
prototypeAccessors.dataset.set = function (val) {
  this._definition.dataset = val;
};

// Datasets - new api
prototypeAccessors.datasets.get = function () {
  return this._definition.datasets;
};
prototypeAccessors.datasets.set = function (val) {
  this._definition.datasets = val;
};

// Series - new api
prototypeAccessors.series.get = function () {
  return this._definition.series;
};
prototypeAccessors.series.set = function (val) {
  this._definition.series = val;
};

// Specification
prototypeAccessors.specification.get = function () {
  return this._definition.specification;
};
prototypeAccessors.specification.set = function (val) {
  this._definition.specification = val;
};

// override
prototypeAccessors.override.get = function () {
  return this._definition.override;
};
prototypeAccessors.override.set = function (val) {
  this._definition.override = val;
  // return this.update(); // TODO is this the best way?
};

// Tooltip
prototypeAccessors.tooltip.get = function () {
  return this._definition.tooltip;
};
prototypeAccessors.tooltip.set = function (val) {
  this._definition.tooltip = val;
  if (this._definition.tooltip.id === undefined || this._definition.tooltip.id === null) {
    this._definition.tooltip.id = "cedar-" + (Date.now());
  }
};

// transform
prototypeAccessors.transform.get = function () {
  return this._transform;
};
prototypeAccessors.transform.set = function (val) {
  this._transform = val;
};

Cedar.prototype._getSpecificationUrl = function _getSpecificationUrl (spec) {
  if (this.chartTypes.indexOf(spec) !== -1) {
    spec = (this.baseUrl) + "/charts/" + (this.chartTypes[this.chartTypes.indexOf(spec)]) + ".json";
  }
  return spec;
};

/**
 * Inspect the current state of the Object
 * and determine if we have sufficient information
 * to render the chart
 * @return {object} Hash of the draw state + any missing requirements
 */
Cedar.prototype.canDraw = function canDraw () {
  // dataset?
  // dataset.url || dataset.data?
  // dataset.mappings?
  // specification?
  // specification.template?
  // specification.inputs?
  // specification.inputs ~ dataset.mappings?

  return {drawable: true, errs: []};
};

/**
 * Draw the chart into the DOM element
 *
 * @example
 *
 * var chart = new Cedar({
 * "type": "scatter",
 * "dataset":{
 *   "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
 *   "query":{},
 *   "mappings":{
 *     "x": {"field":"POPULATION_ENROLLED_2008","label":"Enrolment 2008"},
 *     "y": {"field":"SQUARE_FOOTAGE","label":"Square Footage"},
 *     "color":{"field":"FACUSE","label":"Facility Type"}
 *   }
 * }
 * });
 *
 * chart.show({
 * elementId: "#chart"
 * });
 *
 * @param{object} options
 * @param {String} options.elementId [required] Id of the Dom element into which the chart will be rendered
 * @param {String} options.renderer "canvas" or "svg" (default: `svg`)
 * @param {Boolean} options.autolabels place axis labels outside any tick labels (default: false)
 * @param {String} options.token Token to be used if the data or spec are on a secured server
 */
Cedar.prototype.show = function show (options, clb) {
  if (this._pendingXhr) {
    // TODO addToMethodQueue
    this._addToMethodQueue('show', [options, clb]);
  } else {
    var err;
    // ensure we got an elementId
    if (!options.elementId) {
      err = 'Cedar.show requires options.elementId';
    }
    // Check if element exists in the page
    if (d3.select(options.elementId)[0][0] === null) {
      err = "Element " + (options.elementId) + " is not present in the DOM";
    }

    // hold onto the id
    this._elementId = options.elementId;
    this._renderer = options.renderer || 'svg'; // default to svg
    this.width = options.width || this.height;
    this.height = options.height || this.height;
    if (options.autolabels !== undefined && options.autolabels !== null) {
      this.autolabels = options.autolabels;
    }

    if (options.maxLabelLength) {
      // check if truncate label length has been passed in
      this.maxLabelLength = options.maxLabelLength;
    }

    // hold onto the token
    if (options.token) {
      this._token = options.token;
    }

    if (err) {
      throw new Error(err);
    }

    var chk = this.canDraw();

    if (chk.drawable) {
      this.update(clb);
    } else {
      // report the issues
      var errs = chk.issues.join(',');
      throw new Error(("Chart can not be drawn because: " + errs));
    }
  }
};

/**
 * Draw the chart based on any changes to data or specifications
 * Should be called after a user modifies
 * the dataset, query, mappings, chart specification or element size
 *
 * @example
 * dataset = {"url": "...", "mappings": {"x": {"field": "STATE"}, "y": {"field": "POPULATION"}}};
 * chart = new Cedar({ "type": "bar", "dataset": dataset });
 * chart.show({elementId: "#chart"});
 * chart.dataset.query.where = "POPULATION>30000";
 * chart.update();
 */
Cedar.prototype.update = function update (clb) {
    var this$1 = this;

  if (this._view) {
    this.emit('update-start');
  }

  if (this._pendingXhr) {
    this._addToMethodQueue('update');
  } else {
    if (this._view) {
      // remove handlers
      // TODO Remove existing handlers
      this._remove(this._view);
    }

    try {
      // Creates the HTML Div and styling if not already created
      if (this._definition.tooltip) {
        this._createTooltip(this._definition.tooltip.id);
      }

      if (this._definition.datasets && this._definition.series) {
        this._definition.dataset = specUtils.convertDatasetsToDataset(this._definition.datasets, this._definition.series, this._chartType, this._definition.dataset);
      }
      // Ensure we have required inputs or defaults
      var compiledMappings = specUtils.applyDefaultsToMappings(this._definition.dataset.mappings, this._definition.specification.inputs);

      var queryFromSpec = utils.mixin({}, this._definition.specification.query, this._definition.dataset.query);
      queryFromSpec = JSON.parse(utils.supplant(JSON.stringify(queryFromSpec), compiledMappings));

      // allow binding to query properties
      compiledMappings.query = queryFromSpec;

      // compile the template + mappings --> vega spec
      var spec = JSON.parse(utils.supplant(JSON.stringify(this._definition.specification.template), compiledMappings));

      // merge in user specified style overrides
      spec = utils.mergeRecursive(spec, this._definition.override);

      // if the spec has a url in the data node, delete it TODO: need to readress this.
      if (spec.data[0].url) {
        delete spec.data[0].url;
      }

      if (this._definition.dataset.data) {
        // create the data node using the passed in data
        spec.data[0].values = this._definition.dataset.data; // TODO: only works on first spec, need to address for multiple datasets.

        // Send to vega
        this._renderSpec(spec, clb);
      } else {
        // We need to fetch the data so....
        var url = requestUtils.createFeatureServiceRequest(this._definition.dataset, queryFromSpec);

        // create a callback closure to carry the spec
        var cb = function (err, data) {
          // Normalize error response
          if (!err && !!data.error) {
            err = new Error(data.error.message || data.error.details[0]);
          }
          // if no errors then continue...
          if (!err) {
            if (this$1._transform && typeof this$1._transform === 'function') {
              data = this$1._transform(data, this$1._definition.dataset);
            }
            // TODO add error handlers for xhr and AGS errors.
            spec.data[0].values = data;
            // send to vega
            this$1._renderSpec(spec, clb);
          } else {
            // optional callback
            if (!!clb && typeof clb === 'function') {
              clb(err, data);
            }
          }
        };

        // fetch the data from the service
        requestUtils.getJson(url, cb, this._timeout);
      }
    } catch (ex) {
      throw (ex);
    }
  }
};

/**
 * RENDER CHART FUNCTIONS
 *
 *
 * Render a compiled Vega specification using vega runtime
 */

Cedar.prototype._renderSpec = function _renderSpec (spec, clb) {
    var this$1 = this;

  if (this.autolabels === true) {
    spec = this._placeLabels(spec);
    spec = this._placeaAxisTicks(spec);
  }
  // Use vega to parse the spec
  // It will handle the spec as an object or url
  vg.parse.spec(spec, function (err, chartCtor) {
    // create the view
    this$1._view = chartCtor({
      el: this$1._elementId,
      renderer: this$1._renderer
    });

    var width = this$1.width || parseInt(d3.select(this$1._elementId).style('width'), 10) || 500;
    var height = this$1.height || parseInt(d3.select(this$1._elementId).style('height'), 10) || 500;

    // render into the element
    this$1._view.width(width).height(height).update();

    // attach event proxies
    this$1._attach(this$1._view);

    if (this$1._view) {
      this$1.emit('update-end');
    }

    // expose errors
    if (!!clb && typeof clb === 'function') {
      clb(err, spec);
    }
  });
};

/**
 * AXIS TICK FUNCTIONS START HERE
 *
 *
 * Automatically determines axis title placement
 *
 * Calculates the maximum length of a tick label and adds padding
 */

Cedar.prototype._placeLabels = function _placeLabels (spec) {
    var this$1 = this;

  try {
    var fields = {};
    var lengths = {};
    var inputs = [];
    // Get all inputs that may be axes
    for (var input in this._definition.dataset.mappings) {
      // check also if property is not inherited from prototype
      if (this$1._definition.dataset.mappings.hasOwnProperty(input)) {
        var field = this$1._definition.dataset.mappings[input].field;
        if (field) {
          inputs.push(input);
          fields[input] = field;
          lengths[input] = 0;
        }
      }
    }
    var length = 0;

    // find the max length value for each axis
    spec.data[0].values.features.forEach(function (feature) {
      inputs.forEach(function (axis) {
        length = (feature.attributes[fields[axis]] || '').toString().length;
        if (this$1.maxLabelLength) {
          // Need to make sure that the gap between title and labels isn't ridiculous
          length = length < (this$1.maxLabelLength + 1) ? length : this$1.maxLabelLength;
        }
        if (length > lengths[axis]) {
          lengths[axis] = length;
        }
      });
    });

    // Change each axis title offset based on longest value
    inputs.forEach(function (axis, index) {
      var angle = 0;
      if (!!spec.axes && !!spec.axes[index]) {
        if (spec.axes[index].properties.labels.angle) {
          angle = spec.axes[index].properties.labels.angle.value;
        }
        if (spec.axes[index].type === 'y') {
          angle = 100 - angle;
        }
        if (this$1.maxLabelLength) {
          // Set max length of axes titles
          spec.axes[index].properties.labels.text = {'template': ("{{ datum.data | truncate:\"" + (this$1.maxLabelLength) + "\"}}")};
        }
        // set title offset
        spec.axes[index].titleOffset = Math.abs(lengths[axis] * angle / 100 * 8) + 35;
      }
    });
    return spec;
  } catch (ex) {
    throw (ex);
  }
};

  /**
 * Automatically determines number of axis tick marks
 *
 * Calculates the maximum length of a tick label and adds padding
 * TODO: remove expectation that there are both x,y axes
 */

Cedar.prototype._placeaAxisTicks = function _placeaAxisTicks (spec) {
  if (spec.axes) {
    try {
      var width = this.width || parseInt(d3.select(this._elementId).style('width'), 10) || 500;
      var height = this.height || parseInt(d3.select(this._elementId).style('height'), 10) || 500;

      spec.axes[0].ticks = width / 100;
      if (spec.axes[1]) {
        spec.axes[1].ticks = height / 30;
      }
    } catch (ex) {
      throw (ex);
    }
  }
  return spec;
};

/**
 * TOOLTIP LOGIC HERE
 *
 * Instantiates the tooltip element and styling
 * @access private
 */
Cedar.prototype._createTooltip = function _createTooltip (elem) {
    var this$1 = this;

  var tooltipDiv = document.getElementById(elem);

  // Check if tooltip has been created or not...
  if (tooltipDiv) {
    return tooltipDiv;
  }

  // TODO: remove inline CSS
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.cedar-tooltip {background-color: white; padding: 3px 10px; color: #333; margin: -30px 0 0 20px; position: absolute; z-index: 2000; font-size: 10px; border: 1px solid #BBB;} .cedar-tooltip .title {font-size: 13pt; font-weight: bold; } .cedar-tooltip .content {font-size: 10pt; } ';
  document.getElementsByTagName('head')[0].appendChild(style);

  tooltipDiv = document.createElement('div');
  tooltipDiv.className = 'cedar-tooltip';
  tooltipDiv.id = elem;
  tooltipDiv.cssText = 'display: none';
  // We need tooltip at the top of the page
  document.body.insertBefore(tooltipDiv, document.body.firstChild);

  this.on('mouseout', function (event, data) {
    this$1._updateTooltip(event, null);
  });
  this.on('mousemove', function (event, data) {
    this$1._updateTooltip(event, data);
  });
  return tooltipDiv;
};

/**
 * Places the tooltipe and fills in content
 *
 * @access private
 */
Cedar.prototype._updateTooltip = function _updateTooltip (event, data) {
  var cedartip = document.getElementById(this._definition.tooltip.id);
  if (!data) {
    cedartip.style.display = 'none';
    return;
  }
  cedartip.style.top = (event.pageY) + "px";
  cedartip.style.left = (event.pageX) + "px";
  cedartip.style.display = 'block';

  var content = "<span class='title'>" + (this._definition.tooltip.title) + "</span><br />";
  content += "<p class='content'>" + (this._definition.tooltip.content) + "</p>";

  cedartip.innerHTML = content.replace(/\{(\w+)\}/g, function (match, $1) {
    return data[$1];
  });
};

 /**
  * EVENT LOGIC HERE
  *
  *
  * Add a handler for the named event.
  * Events:
  *- mouseover
  *- mouseout
  *- click
  *- update-start
  *- update-end
  *
  *
  *
  * Callback from Cedar events
  *- callback Cedar~eventCallback
  *- param {Object} event - event response such as mouse location
  *- param {Object} data - chart data object
  *
  * @example
  * var chart = new Cedar({ ... });
  * chart.on('mouseover', function(event, data) {
  * console.log("Mouse Location:", [event.offsetX, event.offsetY]);
  * console.log("Data value:", data[Object.keys(data)[0]]);
  * });
  *
  * @param {String} eventName name of the event that invokes callback
  * @param {Cedar~eventCallback} callback - The callback that handles the event.
  */
Cedar.prototype.on = function on (evtName, callback) {
  this._events.push({type: evtName, callback: callback});
};
/**
 * Remove a hanlder for the named event
 */
Cedar.prototype.off = function off (evtName, callback) {
  this._events.forEach(function (registeredEvent, index, object) {
    if (registeredEvent.type === evtName && registeredEvent.callback === callback) {
      object.splice(index, 1);
    }
  });
};

/**
 * Trigger a callback
 * @param {string} eventName - ["mouseover","mouseout","click","update-start","update-end"]
 */
Cedar.prototype.emit = function emit (eventName) {
  if (!!this._view._handler._handlers[ eventName ] && !!this._view._handler._handlers[ eventName ][0]) {
    this._view._handler._handlers[ eventName ][0].handler();
  }
};

/**
 * Attach the generic proxy hanlders to the chart view
 * @access private
 */
Cedar.prototype._attach = function _attach (view) {
  view.on('mouseover', this._handler('mouseover'));
  view.on('mouseout', this._handler('mouseout'));
  view.on('mousemove', this._handler('mousemove'));
  view.on('click', this._handler('click'));
  view.on('update-start', this._handler('update-start'));
  view.on('update-end', this._handler('update-end'));
};

/**
 * Remove all event handlers from the view
 * @access private
 */
Cedar.prototype._remove = function _remove (view) {
  view.off('mouseover');
  view.off('mouseout');
  view.off('mousemove');
  view.off('click');
  view.off('update-start');
  view.off('update-end');
};

/**
 * Creates an entry in the method queue, executed
 * once a pending xhr is completed
 * @access private
 */
Cedar.prototype._addToMethodQueue = function _addToMethodQueue (name$$1, args) {
  this._methodQueue.push({ method: name$$1, args: args });
};

/**
 * empties the method queue by calling the queued methods
 * This helps build a more syncronous api, while still
 * doing async things in the code
 * @access private
 */
Cedar.prototype._purgeMethodQueue = function _purgeMethodQueue () {
    var this$1 = this;

  if (this._methodQueue.length > 0) {
    this._methodQueue.forEach(function (action, index) {
      this$1[action.method].apply(this$1, action.args);
    });
  }
};

/**
 * Generic event handler proxy
 * @access private
 */
Cedar.prototype._handler = function _handler (evtName) {
    var this$1 = this;

  // return a handler function w/ the events hash closed over
  var handler = function (evt, item) {
    this$1._events.forEach(function (registeredHandler) {
      if (registeredHandler.type === evtName) {
        // invoke the callback with the data
        if (item) {
          registeredHandler.callback(evt, item.datum.attributes);
        } else {
          registeredHandler.callback(evt, null);
        }
      }
    });
  };
  return handler;
};

/**
 * SELECT LOGIC STARTS HERE
 *
 * Highlight marker based on attribute value
 *
 * @example
 * chart = new Cedar({...});
 * chart.select({key: 'ZIP_CODE', value: '20002'});
 *
 * @param {object} options - Object(key, value) to match. Calls hover on work
 * @returns {Array} items - array of chart objects that match the criteria
 */

Cedar.prototype.select = function select (options) {
    var this$1 = this;

  var view = this._view;
  var items = view.model().scene().items[0].items[0].items;

  items.forEach(function (item) {
    if (item.datum.attributes[options.key] === options.value) {
      if (item.hasPropertySet('hover')) {
        this$1._view.update({props: 'hover', items: item});
      }
    }
  });

  return items;
};

 /**
  * Removes highlighted chart items
  *
  * If "options" are used, only clear specific items, otherwise clears all highlights.
  * @param {Object} options - Object(key, value) to match. Calls hover on mark
  * @returns {Array} items - array of chart objects that match the criteria, or null if all items.
  */

Cedar.prototype.clearSelection = function clearSelection (options) {
    var this$1 = this;

  var view = this._view;

  if (!!options && !!options.key) {
    var items = view.model().scene().items[0].items[0].items;
    items.forEach(function (item) {
      if (item.datum.attributes[options.key] === options.value) {
        this$1._view.update({props: 'update', items: item});
      }
    });
    return items;
  } else {
    // clear all
    this._view.update();
    return null;
  }
};

Cedar.getJson = function getJson (url, callback, timeout) {
  return requestUtils.getJson(url, callback, timeout);
};

/**
 * Other now exposed utils!
 */
Cedar._validateMappings = function _validateMappings (inputs, mappings) {
  return utils.validateMappings(inputs, mappings);
};
Cedar._validateData = function _validateData (data, mappings) {
  return utils.validateData(data, mappings);
};
Cedar._createFeatureServiceRequest = function _createFeatureServiceRequest (dataset, queryFromSpec) {
  return requestUtils.createFeatureServiceRequest(dataset, queryFromSpec);
};
Cedar._getMappingFieldName = function _getMappingFieldName (mappingName, fieldName) {
  return utils.getMappingFieldName(mappingName, fieldName);
};
// TODO: remove once we have a better way to unit test
Cedar._convertDatasetsToDataset = function _convertDatasetsToDataset (datasets, dataset, chartType) {
  return specUtils.convertDatasetsToDataset(datasets, dataset, chartType);
};

Object.defineProperties( Cedar.prototype, prototypeAccessors );

return Cedar;

})));
//# sourceMappingURL=cedar.js.map
