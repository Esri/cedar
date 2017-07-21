
/**
 * Convert feature service response to an array
 * @param  {object}    fs Feature service response
 * @return {array}    response object as an array
 */
export function fsToArr(fs: any): any[]  {
  if (fs.features) {
    return fs.features.map((attr) => attr.attributes)
  }
}

/**
 * Convert array of attributes into a fs response
 * @param  {any[]} arr Array of attribute objects
 * @return {object}       FS response
 */
export function arrToFs(arr: any[]): any {
  return {
    features: arr.map((attr) => {
      return {
        attributes: attr
      }
    })
  }
}

/**
 * Handle FS errors && response
 * @param  {object}          response Response from a fetch
 * @return {Promise<any>}          Returns a promise that resolves as JSON
 */
export function checkStatusAndParseJson(response: any): Promise<any> {
  let err
  if (response.status >= 200 && response.status < 300) {
    // check if this is a 200, but really a 400 error
    return response.json().then((json) => {
      if (json.error) {
        err = new Error(json.error.message)
        err.code = json.error.code || 404
        err.response = response
        throw err
      } else {
        return json
      }
    })
  } else {
    // response has a non 200 http code
    err = new Error(`Got ${response.status} ${response.statusText}`)
    throw err
  }
}

/**
 * Fetch data from a feature service
 * @param  {string}       url     URL to fetch against
 * @param  {any}          options Potential options passed into fetch
 * @return {Promise<any>}         FS response as JSON
 */
export function getData(url: string, options: any): Promise<any> {
  const opts = options || {}
  return fetch(url, opts)
    .then((response) => {
      return checkStatusAndParseJson(response)
    })
}

export const query = {
  fsToArr,
  arrToFs,
  getData
}

export default query
