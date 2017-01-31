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
  console.log('Datasets and dataset are:', datasets, dataset);
  // Mappings held here
  const mappings = {};
  // Queries held here
  const queries = [];
  // Urls held here
  const urls = [];

  datasets.forEach((dtst) => {
    // Push queries and urls first
    queries.push(dtst.query);
    urls.push(dtst.url);
    // Construct mappings
    // Grouped bar chart here
    if (chartType === 'grouped') {
      if (!mappings.group) {
        mappings.group = {
          field: dtst.mappings.category,
          label: dtst.mappings.category
        };
      }
      if (!mappings.x) {
        mappings.x = {
          field: [],
          label: dtst.mappings.category
        };
      }
      // TODO figure out labels
      mappings.x.field.push(`attributes.${dtst.mappings.series[0].field}`);

      // Bubble Chart starts here
    } else if (chartType === 'bubble') {
      mappings.x = {
        field: dtst.mappings.category,
        label: dtst.mappings.category
      };
      mappings.y = {
        field: dtst.mappings.series[0].field,
        label: dtst.mappings.series[0].label
      };
      mappings.size = {
        field: dtst.mappings.series[0].field,
        label: dtst.mappings.series[0].label
      };

      // Pie Chart starts here
    } else if (chartType === 'pie') {
      mappings.label = {
        field: dtst.mappings.category,
        label: dtst.mappings.category
      };
      mappings.y = {
        field: dtst.mappings.series[0].field,
        label: dtst.mappings.series[0].label
      };

      // X Y only charts here
    } else {
      mappings.x = {
        field: dtst.mappings.category,
        label: dtst.mappings.category
      };
      mappings.y = {
        field: dtst.mappings.series[0].field,
        label: dtst.mappings.series[0].label
      };
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
  return queries[0];
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
