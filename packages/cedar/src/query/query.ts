import {
  decodeValues,
  IDecodeValuesOptions,
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
  queryFeatures
} from '@esri/arcgis-rest-feature-layer'
import { IDataset } from '../common'
import config from '../config'
import { createQueryParams } from './url'

export function queryDatasets(datasets: IDataset[]) {
  const names = []
  const requests = []

  if (datasets) {
      datasets.forEach((dataset, i) => {
      // only query datasets that don't have inline data
      if (dataset.url) {
        const { url, name, query, requestOptions } = dataset
        // TODO: make name required on datasets, or required if > 1 dataset?
        names.push(name || `dataset${i}`)

        const params = { ...(requestOptions && requestOptions.params), ...createQueryParams(query) }
        const options: IQueryFeaturesOptions = {
          ...requestOptions,
          url,
          params,
        }
        if (config.fetch && typeof config.fetch === 'function') {
          // we are configured to use a custom fetch implementation
          // send that along to rest-js
          options.fetch = config.fetch
        }
        requests.push(
          queryFeatures(options)
            .then((queryResponse: IQueryFeaturesResponse) => {
              const { domains } = dataset
              const fields: any[] = domains && Object.keys(domains).map((name) => ({ name, domain: domains[name]}))
              // for now, we only decode CVDs when an array of fields is passed describing codes and names
              if (fields && fields.length > 0) {
                const decodeOptions: IDecodeValuesOptions = {
                  url: options.url,
                  queryResponse,
                  // TODO: decodeValues() should take `domains?: IDomains` as an alternative to `fields?: IField[]`
                  fields,
                  fetch: config.fetch
                }
                return decodeValues(decodeOptions)
              } else {
                return queryResponse
              }
            })
        )
      }
    })
  }
  return Promise.all(requests)
  .then((responses) => {
    // turn the array of responses into a hash keyed off the dataset names
    const responseHash = responses.reduce((hash, response, i) => {
      hash[names[i]] = response
      return hash
    }, {})
    return Promise.resolve(responseHash)
  })
}
