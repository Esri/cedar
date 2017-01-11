import * as d3 from 'd3';
/**
 * Merges n objects
 * @param  {object} source Empty object that other objects will be merged into
 * @return {Object}        Merged objects
 */
export function mixin (source) {
  const args = [...arguments];
  for (let i = 1; i < args.length; i++) {
    d3.entries(args[i]).forEach((p) => {
      source[p.key] = p.value;
    });
  }
  return source;
}

/**
 * Recursively merge properties of two objects
 */
export function mergeRecursive (obj1, obj2) {
  for (let p in obj2) {
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
export function supplant (template, params) {
  const t = template.replace(/{([^{}]*)}/g,
    (a, b) => {
      const r = getTokenValue(params, b);

      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
  return t.replace(/"{([^{}]*)}"/g,
    (a, b) => {
      let r = getTokenValue(params, b);
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
export function getTokenValue (tokens, tokenName) {
  let tmpTokens = tokens;
  let tokenNameParts = tokenName.split('.');
  for (let i = 0; i < tokenNameParts.length; i++) {
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
export function validateMappings (inputs, mappings) {
  return inputs.filter((input) => {
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
export function validateData (data, mappings) {
  const missingInputs = [];
  if (!data.features || !Array.isArray(data.features)) {
    throw new Error('Data is expected to have features array!');
  }
  const firstRow = data.features[0].attributes;
  for (let key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      let fld = getMappingFieldName(key, mappings[key].field);
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
export function getMappingFieldName (mappingName, fieldName) {
  // this function why?

  let name = fieldName;
   // if(mappingName.toLowerCase() === 'count'){
   //  name = fieldName + '_SUM';
   // }
  return name;
}

const utils = {
  mixin,
  supplant,
  mergeRecursive,
  getTokenValue,
  validateMappings,
  validateData,
  getMappingFieldName
};

export default utils;
