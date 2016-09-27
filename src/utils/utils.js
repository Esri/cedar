
/**
 * Merges n objects
 * @param  {object} source Empty object that other objects will be merged into
 * @return {Object}        Merged objects
 */
export function mixin(source) {
  const args = [...arguments];
  for (let i = 1; i < args.length; i++) {
    for ( const key of Object.keys(args[i])) {
      source[key] = args[i][key];
    }
  }
  return source;
}

/**
 * Recursively merge properties of two objects
 */
export function mergeRecursive(obj1, obj2) {
  for (let p in obj2) {
    if (obj2.hasOwnProperty(p)) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor === Object || obj2[p].constructor === Array ) {
          obj1[p] = mergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
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
export function supplant(template, params) {
  const t = template.replace(/{([^{}]*)}/g,
    (a, b) => {
      const r = getTokenValue(params, b);

      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
  return t.replace(/"{([^{}]*)}"/g,
    (a, b) => {
      let r = getTokenValue(params, b);
      return r.constructor === Array ? r = JSON.stringify(r) : a;
    });
}

/**
 * Get the value of a token from a hash
 */
 export function getTokenValue(tokens, tokenName) {
   let tempTokens = tokens;
   const tokenNameParts = tokenName.split('.');
   for (let key in tokenNameParts) {
     if (tempTokens.hasOwnProperty(tokenNameParts[key])) {
       tempTokens = tempTokens[tokenNameParts[key]];
     } else {
       return null;
     }
   }
   return tempTokens;
 }

const utils = {
  mixin,
  supplant,
  mergeRecursive,
  getTokenValue
};

export default utils;
