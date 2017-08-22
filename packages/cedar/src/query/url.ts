import { deepMerge } from 'cedar-utils'

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
  }
}

export function serializeQueryParams(params: any): string {
  const str: string[] = []
  for (const param in params) {
    if (params.hasOwnProperty(param)) {
      let val = params[param]
      if (typeof val !== 'string') {
        val = JSON.stringify(val)
      }
      str.push(`${encodeURIComponent(param)}=${encodeURIComponent(val)}`)
    }
  }
  return str.join('&')
}

export function createFeatureServiceRequest(dataset: any): string {
  const query = deepMerge({}, defaultQuery(), dataset.query)

  // Handle bbox
  if (query.bbox) {
    // make sure a geometry was not also passed in
    if (query.geometry) {
      throw new Error('Dataset.query can not have both a geometry and a bbox specified')
    }
    // Get the bbox (w,s,e,n)
    const bboxArr = query.bbox.split(',')

    // Remove it so it's not serialized as-is
    delete query.bbox

    // cook it into a json string
    query.geometry = JSON.stringify({
      xmin: bboxArr[0],
      ymin: bboxArr[2],
      xmax: bboxArr[1],
      ymax: bboxArr[3]
    })
    // set spatial ref as geographic
    query.inSR = '4326'
  }

  if (!!query.outStatistics && typeof query.outStatistics !== 'string') {
    query.outStatistics = JSON.stringify(query.outStatistics)
  }

  let builtUrl = `${dataset.url}/query?${serializeQueryParams(query)}`

  if (dataset.token) {
    builtUrl = `${builtUrl}&token=${dataset.token}`
  }

  return builtUrl
}

export const url = {
  defaultQuery,
  serializeQueryParams,
  createFeatureServiceRequest
}

export default url
