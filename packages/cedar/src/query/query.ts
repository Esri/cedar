import { request } from '../request/request'
// TODO: once @esri/arcgis-rest-request is released, replace the above w/
// import { request } from '@esri/arcgis-rest-request'

// TODO: remove or at least rename fsToArr and arrToFs
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
 * Fetch data from a feature service
 * @param  {string}       url     URL to fetch against
 * @param  {any}          options Potential options passed into fetch
 * @return {Promise<any>}         FS response as JSON
 */
export function getData(url: string, options?: any): Promise<any> {
  const opts = options || {}
  return request(url, opts)
}

// TODO: remove default export
export const query = {
  fsToArr,
  arrToFs,
  getData
}

export default query
