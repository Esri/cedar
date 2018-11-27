import {
  decodeValues,
  IDecodeValuesRequestOptions,
  IQueryFeaturesRequestOptions,
  IQueryFeaturesResponse,
  queryFeatures
} from '@esri/arcgis-rest-feature-service'
import config from '../config'
import { IDataset } from '../dataset'
import { createQueryParams } from './url'

export function queryDatasets(datasets: IDataset[]) {
  const names = []
  const requests = []

  if (datasets) {
      datasets.forEach((dataset, i) => {
      // only query datasets that don't have inline data
      if (dataset.url) {
        // TODO: make name required on datasets, or required if > 1 dataset?
        names.push(dataset.name || `dataset${i}`)

        const queryParams = createQueryParams(dataset.query)
        const options: IQueryFeaturesRequestOptions = {
          url: dataset.url,
          params: queryParams
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
                const decodeOptions: IDecodeValuesRequestOptions = {
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
