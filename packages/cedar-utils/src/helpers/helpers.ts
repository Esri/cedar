/**
 * Merges n objects
 * @param  {object} source Empty object that other objects will be merged into
 * @return {object}        Merged objects
 */
export function deepMerge( source: any, ...args ) {
  const arrOfObjs = [...args]
  for (const i in arrOfObjs) {
    if (i) {
      entries(arrOfObjs[i]).forEach((p) => {
        if (Array.isArray(source)) {
          source.push(_arrOrObj(p.value))
        } else {
          source[p.key] = _arrOrObj(p.value)
        }
      })
    }
  }
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
function entries(obj: object) {
  const ents = []
  for (const key in obj) {
    if (key) {
      ents.push({ key, value: obj[key] })
    }
  }
  return ents
}

const helpers = {
  entries,
  deepMerge
}

export default helpers
