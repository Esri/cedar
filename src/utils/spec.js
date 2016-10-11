/**
 * Return a default definition Object
 * @return {Object} Default definition
 */
export function defaultDefinition() {
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
export function defaultQuery() {
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
export function applyDefaultsToMappings(mappings, inputs) {
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

const specUtils = {
  defaultDefinition,
  defaultQuery,
  applyDefaultsToMappings
};

export default specUtils;
