/**
 * Merges n objects
 * @param  {object} source Empty object that other objects will be merged into
 * @return {object}        Merged objects
 */
export function deepMerge(source: any, ...args) {
  const arrOfObjs = [...args]
  arrOfObjs.forEach((obj) => {
    entries(obj).forEach((p) => {
      if (Array.isArray(source)) {
        source.push(_arrOrObj(p.value))
      } else {
        source[p.key] = _arrOrObj(p.value)
      }
    })
  })
  return source
}

function _arrOrObj(val: any) {
  return Array.isArray(val)
    ? deepMerge([], val)
    : typeof val === 'object'
    ? deepMerge({}, val)
    : val
}

/**
 * Iterates over an object and produces an array of key/val pairs
 * @param  {object} obj Object to iterate over
 * @return {array}     Array of key, val pairs.
 */
export function entries(obj: object) {
  const pairs = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      pairs.push({ key, value: obj[key] })
    }
  }
  return pairs
}

export const helpers = {
  entries,
  deepMerge
}

export default helpers
