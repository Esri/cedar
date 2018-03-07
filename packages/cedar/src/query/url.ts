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
  // start w/ default query params
  const queryParams = defaultQuery()

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
      xmin: Number(bboxArr[0]),
      ymin: Number(bboxArr[1]),
      xmax: Number(bboxArr[2]),
      ymax: Number(bboxArr[3])
    })
    // set spatial ref as geographic
    query.inSR = '4326'
  }

  // override w/ params that were passed in
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const param = query[key]
      queryParams[key] = typeof param === 'object' ? JSON.stringify(param) : param
    }
  }

  return queryParams
}
