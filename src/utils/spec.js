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
export function convertDatasetsToDataset (datasets, dataset, chartType) {
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

  datasets.forEach((dtst) => {
    const category = dtst.mappings.category;
    const categoryObj = (typeof category === 'string') ? { field: category, label: category } : category;
    const series = dtst.mappings.series;

    // Push queries and urls first
    queries.push(dtst.query);
    urls.push(dtst.url);
    // Construct mappings
    // Grouped bar chart here
    if (chartType === 'grouped') {
      if (!mappings.group) {
        mappings.group = categoryObj;
      }
      if (!mappings.x) {
        mappings.x = {
          field: [],
          label: series[0].label
        };
      }
      if (series.length > 1) {
        series.forEach((attr) => {
          mappings.x.field.push(`attributes.${attr.field}`);
        });
      } else {
        mappings.x.field.push(`attributes.${series[0].field}`);
      }

      // Bubble Chart starts here
    } else if (chartType === 'bubble') {
      mappings.x = categoryObj;
      mappings.y = series[0];
      mappings.size = series[0];

      // Scatter plot starts here
    } else if (chartType === 'scatter') {
      mappings.x = categoryObj;
      mappings.y = series[0];
      mappings.color = series[1];

      // Pie Chart starts here
    } else if (chartType === 'pie') {
      mappings.label = categoryObj;
      mappings.y = series[0];
    } else if (chartType === 'bar-horizontal') {
      mappings.y = categoryObj;
      mappings.x = series[0];

    // X Y only charts here
    } else {
      mappings.x = categoryObj;
      mappings.y = series[0];
    }

    // sort
    // TODO: handle multiple sorts?
    if (dtst.mappings.sort) {
      mappings.sort = dtst.mappings.sort;
    }
  });

  return {
    url: convertUrls(urls),
    query: convertQueries(queries, dataset.query),
    mappings
  };
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
