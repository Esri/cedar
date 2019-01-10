import { version } from '../package.json';
import utils from './utils/utils';
import requestUtils from './utils/request';
import specUtils from './utils/spec';
// import specTemplates from './charts/specs';
import * as d3 from 'd3';
import * as vg from 'vega';

// get cedar root URL for loading chart specs
const baseUrl = (function () {
  var cdnProtocol = 'http:';
  var cdnUrl = '//unpkg.com/arcgis-cedar/dist/';
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

export default class Cedar {
  /**
   * Creates a new Chart object.
   *
   * @example
   *  var chart = new Cedar({
   *    "type": "bar"
   *    "dataset":
   *      "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
   *      "query": {
   *        "groupByFieldsForStatistics": "FACUSE",
   *        "outStatistics": [{
   *          "statisticType": "sum",
   *          "onStatisticField": "TOTAL_STUD",
   *          "outStatisticFieldName": "TOTAL_STUD_SUM"
   *        }]
   *      },
   *      "mappings":{
   *        "sort": "TOTAL_STUD_SUM DESC",
   *        "x": {"field":"FACUSE","label":"Facility Use"},
   *        "y": {"field":"TOTAL_STUD_SUM","label":"Total Students"}
   *      }
   *    }
   *  });
   *
   * @param {Object} options
   * @param {String} options.type - Chart type as a chartType ("bar") or a URL to a Cedar specification
   * @param {Object} options.dataset - Dataset definition including Source and Style mappings
   * @param {String} options.dataset.url - GeoService Layer URL
   *
   * "url":"http://.../rest/services/DATA/Education/MapServer/5"
   * @param {Object} options.dataset.query - GeoServices Layer query parameters (where, bbox, outStatistics) [optional]
   *
   * "query": {
   *   "groupByFieldsForStatistics": "FACUSE",
   *   "outStatistics": [{
   *     "statisticType": "sum",
   *     "onStatisticField": "TOTAL_STUD",
   *     "outStatisticFieldName": "TOTAL_STUD_SUM" }] }
   * @param {Object} options.dataset.data - Inline feature collection, alternative to data from a URL
   *
   * "data": {"features":[{"attributes":{"ZIP_CODE":20005,"TOTAL_STUD_SUM":327}}]}
   * @param {Object} options.dataset.mappings - Relates data items to the chart style definition
   * @param {Object} options.override - Changes to the "options.type" chart specification
   * @param {Object} options.tooltip - Optional on-hover tooltip. Element has class="cedar-tooltip" for styling.
   * @param {String} options.tooltip.id - Optional HTML element to use for tooltip. (default: unique id created)
   * @param {String} options.tooltip.title - Templated tooltip heading. Uses "{Variable} template format"
   * @param {String} options.tooltip.content - Templated tooltip body text. Uses "{Variable} template format"
   * @return {Object} new Cedar chart object
   */
  constructor (options) {
    this.version = version;
    // Pull templates in
    // this.chartTypes = specTemplates;

    let opts = options || {};

    let spec;

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
        requestUtils.getJson(opts.definition, (err, data) => {
          if (err) {
            throw new Error('Error fetching definition object', err);
          }
          this._pendingXhr = false;
          this._definition = data;
          this._purgeMethodQueue();
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
        requestUtils.getJson(spec, (err, data) => {
          if (err) {
            throw new Error('Error fetching template object', err);
          }
          this._pendingXhr = false;
          this._definition.specification = data;
          this._purgeMethodQueue();
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
      const inputs = [];
      for (let input in this._definition.dataset.mappings) {
        if (this._definition.dataset.mappings.hasOwnProperty(input)) {
          const field = this._definition.dataset.mappings[input].field;
          if (field !== undefined && field !== null) {
            inputs.push(field);
          }
        }
      }
      if (inputs.length >= 2) {
        this.tooltip = {
          'title': `{${inputs[0]}}`,
          'content': `{${inputs[1]}}`
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
  }

  /**
   * Properties
   */
  // Dataset - old api
  get dataset () {
    return this._definition.dataset;
  }
  set dataset (val) {
    this._definition.dataset = val;
  }

  // Datasets - new api
  get datasets () {
    return this._definition.datasets;
  }
  set datasets (val) {
    this._definition.datasets = val;
  }

  // Series - new api
  get series () {
    return this._definition.series;
  }
  set series (val) {
    this._definition.series = val;
  }

  // Specification
  get specification () {
    return this._definition.specification;
  }
  set specification (val) {
    this._definition.specification = val;
  }

  // override
  get override () {
    return this._definition.override;
  }
  set override (val) {
    this._definition.override = val;
    // return this.update(); // TODO is this the best way?
  }

  // Tooltip
  get tooltip () {
    return this._definition.tooltip;
  }
  set tooltip (val) {
    this._definition.tooltip = val;
    if (this._definition.tooltip.id === undefined || this._definition.tooltip.id === null) {
      this._definition.tooltip.id = `cedar-${Date.now()}`;
    }
  }

  // transform
  get transform () {
    return this._transform;
  }
  set transform (val) {
    this._transform = val;
  }

  _getSpecificationUrl (spec) {
    if (this.chartTypes.indexOf(spec) !== -1) {
      spec = `${this.baseUrl}/charts/${this.chartTypes[this.chartTypes.indexOf(spec)]}.json`;
    }
    return spec;
  }

  /**
   * Inspect the current state of the Object
   * and determine if we have sufficient information
   * to render the chart
   * @return {object} Hash of the draw state + any missing requirements
   */
  canDraw () {
    // dataset?
    // dataset.url || dataset.data?
    // dataset.mappings?
    // specification?
    // specification.template?
    // specification.inputs?
    // specification.inputs ~ dataset.mappings?

    return {drawable: true, errs: []};
  }

  /**
   * Draw the chart into the DOM element
   *
   * @example
   *
   * var chart = new Cedar({
   *   "type": "scatter",
   *   "dataset":{
   *     "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
   *     "query":{},
   *     "mappings":{
   *       "x": {"field":"POPULATION_ENROLLED_2008","label":"Enrolment 2008"},
   *       "y": {"field":"SQUARE_FOOTAGE","label":"Square Footage"},
   *       "color":{"field":"FACUSE","label":"Facility Type"}
   *     }
   *   }
   * });
   *
   * chart.show({
   *   elementId: "#chart"
   * });
   *
   * @param  {object} options
   * @param {String} options.elementId [required] Id of the Dom element into which the chart will be rendered
   * @param {String} options.renderer "canvas" or "svg" (default: `svg`)
   * @param {Boolean} options.autolabels place axis labels outside any tick labels (default: false)
   * @param {String} options.token Token to be used if the data or spec are on a secured server
   */
  show (options, clb) {
    if (this._pendingXhr) {
      // TODO addToMethodQueue
      this._addToMethodQueue('show', [options, clb]);
    } else {
      let err;
      // ensure we got an elementId
      if (!options.elementId) {
        err = 'Cedar.show requires options.elementId';
      }
      // Check if element exists in the page
      if (d3.select(options.elementId)[0][0] === null) {
        err = `Element ${options.elementId} is not present in the DOM`;
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
        const errs = chk.issues.join(',');
        throw new Error(`Chart can not be drawn because: ${errs}`);
      }
    }
  }

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
  update (clb) {
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
        if (this._definition.datasets && this._definition.series) {
          this._definition.dataset = specUtils.convertDatasetsToDataset(this._definition.datasets, this._definition.series, this._chartType, this._definition.dataset);
          if (!this._definition.tooltip) {
            this.tooltip = {
              'title': `{${this._definition.series[0].category.field}}`,
              'content': `{${this._definition.series[0].value.field}}`
            };
          }
        }

        // Creates the HTML Div and styling if not already created
        if (this._definition.tooltip) {
          this._createTooltip(this._definition.tooltip.id);
        }
        // Ensure we have required inputs or defaults
        let compiledMappings = specUtils.applyDefaultsToMappings(this._definition.dataset.mappings, this._definition.specification.inputs);

        let queryFromSpec = utils.mixin({}, this._definition.specification.query, this._definition.dataset.query);
        queryFromSpec = JSON.parse(utils.supplant(JSON.stringify(queryFromSpec), compiledMappings));

        // allow binding to query properties
        compiledMappings.query = queryFromSpec;

        // compile the template + mappings --> vega spec
        let spec = JSON.parse(utils.supplant(JSON.stringify(this._definition.specification.template), compiledMappings));

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
          const url = requestUtils.createFeatureServiceRequest(this._definition.dataset, queryFromSpec);

          // create a callback closure to carry the spec
          const cb = (err, data) => {
            // Normalize error response
            if (!err && !!data.error) {
              err = new Error(data.error.message || data.error.details[0]);
            }
            // if no errors then continue...
            if (!err) {
              if (this._transform && typeof this._transform === 'function') {
                data = this._transform(data, this._definition.dataset);
              }
              // TODO add error handlers for xhr and AGS errors.
              spec.data[0].values = data;
              // send to vega
              this._renderSpec(spec, clb);
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
  }

  /**
   * RENDER CHART FUNCTIONS
   *
   *
   * Render a compiled Vega specification using vega runtime
   */

  _renderSpec (spec, clb) {
    if (this.autolabels === true) {
      spec = this._placeLabels(spec);
      spec = this._placeaAxisTicks(spec);
    }
    // Use vega to parse the spec
    // It will handle the spec as an object or url
    vg.parse.spec(spec, (err, chartCtor) => {
      // create the view
      this._view = chartCtor({
        el: this._elementId,
        renderer: this._renderer
      });

      const width = this.width || parseInt(d3.select(this._elementId).style('width'), 10) || 500;
      const height = this.height || parseInt(d3.select(this._elementId).style('height'), 10) || 500;

      // render into the element
      this._view.width(width).height(height).update();

      // attach event proxies
      this._attach(this._view);

      if (this._view) {
        this.emit('update-end');
      }

      // expose errors
      if (!!clb && typeof clb === 'function') {
        clb(err, spec);
      }
    });
  }

  /**
   * AXIS TICK FUNCTIONS START HERE
   *
   *
   * Automatically determines axis title placement
   *
   * Calculates the maximum length of a tick label and adds padding
   */

  _placeLabels (spec) {
    try {
      const fields = {};
      const lengths = {};
      const inputs = [];
      // Get all inputs that may be axes
      for (let input in this._definition.dataset.mappings) {
        // check also if property is not inherited from prototype
        if (this._definition.dataset.mappings.hasOwnProperty(input)) {
          const field = this._definition.dataset.mappings[input].field;
          if (field) {
            inputs.push(input);
            fields[input] = field;
            lengths[input] = 0;
          }
        }
      }
      let length = 0;

      // find the max length value for each axis
      spec.data[0].values.features.forEach((feature) => {
        inputs.forEach((axis) => {
          length = (feature.attributes[fields[axis]] || '').toString().length;
          if (this.maxLabelLength) {
            // Need to make sure that the gap between title and labels isn't ridiculous
            length = length < (this.maxLabelLength + 1) ? length : this.maxLabelLength;
          }
          if (length > lengths[axis]) {
            lengths[axis] = length;
          }
        });
      });

      // Change each axis title offset based on longest value
      inputs.forEach((axis, index) => {
        let angle = 0;
        if (!!spec.axes && !!spec.axes[index]) {
          if (spec.axes[index].properties.labels.angle) {
            angle = spec.axes[index].properties.labels.angle.value;
          }
          if (spec.axes[index].type === 'y') {
            angle = 100 - angle;
          }
          if (this.maxLabelLength) {
            // Set max length of axes titles
            spec.axes[index].properties.labels.text = {'template': `{{ datum.data | truncate:${this.maxLabelLength}}}`};
          }
          // set title offset
          spec.axes[index].titleOffset = Math.abs(lengths[axis] * angle / 100 * 8) + 35;
        }
      });
      return spec;
    } catch (ex) {
      throw (ex);
    }
  }

  /**
   * Automatically determines number of axis tick marks
   *
   * Calculates the maximum length of a tick label and adds padding
   * TODO: remove expectation that there are both x,y axes
   */

  _placeaAxisTicks (spec) {
    if (spec.axes) {
      try {
        const width = this.width || parseInt(d3.select(this._elementId).style('width'), 10) || 500;
        const height = this.height || parseInt(d3.select(this._elementId).style('height'), 10) || 500;

        spec.axes[0].ticks = width / 100;
        if (spec.axes[1]) {
          spec.axes[1].ticks = height / 30;
        }
      } catch (ex) {
        throw (ex);
      }
    }
    return spec;
  }

  /**
   * TOOLTIP LOGIC HERE
   *
   * Instantiates the tooltip element and styling
   * @access private
   */
  _createTooltip (elem) {
    let tooltipDiv = document.getElementById(elem);

    // Check if tooltip has been created or not...
    if (tooltipDiv) {
      return tooltipDiv;
    }

    // TODO: remove inline CSS
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.cedar-tooltip {background-color: white; padding: 3px 10px; color: #333; margin: -30px 0 0 20px; position: absolute; z-index: 2000; font-size: 10px; border: 1px solid #BBB;} .cedar-tooltip .title {font-size: 13pt; font-weight: bold; } .cedar-tooltip .content {font-size: 10pt; } ';
    document.getElementsByTagName('head')[0].appendChild(style);

    tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'cedar-tooltip';
    tooltipDiv.id = elem;
    tooltipDiv.cssText = 'display: none';
    // We need tooltip at the top of the page
    document.body.insertBefore(tooltipDiv, document.body.firstChild);

    this.on('mouseout', (event, data) => {
      this._updateTooltip(event, null);
    });
    this.on('mousemove', (event, data) => {
      this._updateTooltip(event, data);
    });
    return tooltipDiv;
  }

  /**
   * Places the tooltipe and fills in content
   *
   * @access private
   */
  _updateTooltip (event, data) {
    let cedartip = document.getElementById(this._definition.tooltip.id);
    if (!data) {
      cedartip.style.display = 'none';
      return;
    }
    cedartip.style.top = `${event.pageY}px`;
    cedartip.style.left = `${event.pageX}px`;
    cedartip.style.display = 'block';

    let content = `<span class='title'>${this._definition.tooltip.title}</span><br />`;
    content += `<p class='content'>${this._definition.tooltip.content}</p>`;

    cedartip.innerHTML = content.replace(/\{(\w+)\}/g, (match, $1) => {
      return data[$1];
    });
  }

   /**
    * EVENT LOGIC HERE
    *
    *
    * Add a handler for the named event.
    * Events:
    *  - mouseover
    *  - mouseout
    *  - click
    *  - update-start
    *  - update-end
    *
    *
    *
    * Callback from Cedar events
    *  - callback Cedar~eventCallback
    *  - param {Object} event - event response such as mouse location
    *  - param {Object} data - chart data object
    *
    * @example
    * var chart = new Cedar({ ... });
    * chart.on('mouseover', function(event, data) {
    *   console.log("Mouse Location:", [event.offsetX, event.offsetY]);
    *   console.log("Data value:", data[Object.keys(data)[0]]);
    * });
    *
    * @param {String} eventName name of the event that invokes callback
    * @param {Cedar~eventCallback} callback - The callback that handles the event.
    */
  on (evtName, callback) {
    this._events.push({type: evtName, callback});
  }
  /**
   * Remove a hanlder for the named event
   */
  off (evtName, callback) {
    this._events.forEach((registeredEvent, index, object) => {
      if (registeredEvent.type === evtName && registeredEvent.callback === callback) {
        object.splice(index, 1);
      }
    });
  }

  /**
   * Trigger a callback
   * @param {string} eventName - ["mouseover","mouseout","click","update-start","update-end"]
   */
  emit (eventName) {
    if (!!this._view._handler._handlers[ eventName ] && !!this._view._handler._handlers[ eventName ][0]) {
      this._view._handler._handlers[ eventName ][0].handler();
    }
  }

  /**
   * Attach the generic proxy hanlders to the chart view
   * @access private
   */
  _attach (view) {
    view.on('mouseover', this._handler('mouseover'));
    view.on('mouseout', this._handler('mouseout'));
    view.on('mousemove', this._handler('mousemove'));
    view.on('click', this._handler('click'));
    view.on('update-start', this._handler('update-start'));
    view.on('update-end', this._handler('update-end'));
  }

  /**
   * Remove all event handlers from the view
   * @access private
   */
  _remove (view) {
    view.off('mouseover');
    view.off('mouseout');
    view.off('mousemove');
    view.off('click');
    view.off('update-start');
    view.off('update-end');
  }

  /**
   * Creates an entry in the method queue, executed
   * once a pending xhr is completed
   * @access private
   */
  _addToMethodQueue (name, args) {
    this._methodQueue.push({ method: name, args: args });
  }

  /**
   * empties the method queue by calling the queued methods
   * This helps build a more syncronous api, while still
   * doing async things in the code
   * @access private
   */
  _purgeMethodQueue () {
    if (this._methodQueue.length > 0) {
      this._methodQueue.forEach((action, index) => {
        this[action.method].apply(this, action.args);
      });
    }
  }

  /**
   * Generic event handler proxy
   * @access private
   */
  _handler (evtName) {
    // return a handler function w/ the events hash closed over
    const handler = (evt, item) => {
      this._events.forEach((registeredHandler) => {
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
  }

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

  select (options) {
    let view = this._view;
    let items = view.model().scene().items[0].items[0].items;

    items.forEach((item) => {
      if (item.datum.attributes[options.key] === options.value) {
        if (item.hasPropertySet('hover')) {
          this._view.update({props: 'hover', items: item});
        }
      }
    });

    return items;
  }

   /**
    * Removes highlighted chart items
    *
    * If "options" are used, only clear specific items, otherwise clears all highlights.
    * @param {Object} options - Object(key, value) to match. Calls hover on mark
    * @returns {Array} items - array of chart objects that match the criteria, or null if all items.
    */

  clearSelection (options) {
    let view = this._view;

    if (!!options && !!options.key) {
      let items = view.model().scene().items[0].items[0].items;
      items.forEach((item) => {
        if (item.datum.attributes[options.key] === options.value) {
          this._view.update({props: 'update', items: item});
        }
      });
      return items;
    } else {
      // clear all
      this._view.update();
      return null;
    }
  }

  static getJson (url, callback, timeout) {
    return requestUtils.getJson(url, callback, timeout);
  }

  /**
   * Other now exposed utils!
   */
  static _validateMappings (inputs, mappings) {
    return utils.validateMappings(inputs, mappings);
  }
  static _validateData (data, mappings) {
    return utils.validateData(data, mappings);
  }
  static _createFeatureServiceRequest (dataset, queryFromSpec) {
    return requestUtils.createFeatureServiceRequest(dataset, queryFromSpec);
  }
  static _getMappingFieldName (mappingName, fieldName) {
    return utils.getMappingFieldName(mappingName, fieldName);
  }
  // TODO: remove once we have a better way to unit test
  static _convertDatasetsToDataset (datasets, dataset, chartType) {
    return specUtils.convertDatasetsToDataset(datasets, dataset, chartType);
  }
}
