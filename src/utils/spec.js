/**
 * Return a default definition Object
 * @return {Object} Default definition
 */
export function defaultDefinition () {
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
export function defaultQuery () {
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
export function applyDefaultsToMappings (mappings, inputs) {
  const errs = [];
  // iterate over inputs
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

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
    throw new Error(`Required Mappings Missing: ${errs.join(',')}`);
  } else {
    return mappings;
  }
}

/**
 * Convert datasets to dataset
 */
export function convertDatasetsToDataset (datasets, series, chartType, dataset) {
  // console.log('Datasets and dataset are:', datasets, dataset);
  if (!dataset) {
    dataset = {
      query: this.defaultQuery()
    };
  }
  // Mappings held here
  const mappings = {};
  // Queries held here
  const queries = [];
  // Urls held here
  const urls = [];
  // Data held here
  const data = [];

  datasets.forEach((dtst) => {
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
        series.forEach((attr) => {
          mappings.x.field.push(`attributes.${attr.value.field}`);
        });
      } else {
        mappings.x.field.push(`attributes.${series[0].value.field}`);
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

    // sort
    // TODO: handle multiple sorts?
    if (series[0].sort) {
      var sort = series[0].sort;
      if (sort.field && sort.order) {
        mappings.sort = `${sort.field} ${sort.order}`;
      } else {
        mappings.sort = sort.field;
      }
    }
  });

  const builtDataset = {
    query: convertQueries(queries, dataset.query),
    mappings
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

const specUtils = {
  defaultDefinition,
  defaultQuery,
  applyDefaultsToMappings,
  convertDatasetsToDataset
};

export default specUtils;
