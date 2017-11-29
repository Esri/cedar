import { deepMerge } from '@esri/cedar-amcharts'

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

export function createQueryParams(query: any = {}): any {
  // merge in default query params
  const queryParams = Object.assign(defaultQuery(), query)

  // Handle bbox
  if (queryParams.bbox) {
    // make sure a geometry was not also passed in
    if (queryParams.geometry) {
      throw new Error('Dataset.query can not have both a geometry and a bbox specified')
    }
    // Get the bbox (w,s,e,n)
    const bboxArr = queryParams.bbox.split(',')

    // Remove it so it's not serialized as-is
    delete queryParams.bbox

    // cook it into a json string
    queryParams.geometry = JSON.stringify({
      xmin: bboxArr[0],
      ymin: bboxArr[2],
      xmax: bboxArr[1],
      ymax: bboxArr[3]
    })
    // set spatial ref as geographic
    queryParams.inSR = '4326'
  }

  if (!!queryParams.outStatistics && typeof queryParams.outStatistics !== 'string') {
    queryParams.outStatistics = JSON.stringify(queryParams.outStatistics)
  }
  return queryParams
}

export function getQueryUrl(dataset: any): string {
  let builtUrl = `${dataset.url}/query?`

  if (dataset.token) {
    builtUrl = `${builtUrl}token=${dataset.token}`
  }

  return builtUrl
}
