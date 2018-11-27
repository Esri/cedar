import {
  IQueryFeaturesRequestOptions,
  queryFeatures,
  decodeValues,
  IQueryFeaturesResponse,
  IDecodeValuesRequestOptions
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
        names.push({
          // TODO: make name required on datasets, or required if > 1 dataset?
          name: dataset.name || `dataset${i}`,
          url: dataset.url
        })
        const queryParams = createQueryParams(dataset.query)
        const options: IQueryFeaturesRequestOptions = {
          url: dataset.url,
          params: queryParams
        }
        if (config.fetch && typeof config.fetch === 'function') {
          // we are configured to use a custom fetch implementation
          // send that along to rest-js
          options.fetch = config.fetch;
        }
        requests.push(
          queryFeatures(options)
            .then((queryResponse:IQueryFeaturesResponse) => {
              // for now, we only decode CVDs when an array of fields is passed describing codes and names
              if (dataset.fields && dataset.fields.length > 0) {
                return decodeValues({
                  url: options.url,
                  queryResponse,
                  fields: dataset.fields,
                  fetch: config.fetch
                } as IDecodeValuesRequestOptions)
              } else {
                return queryResponse;
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
      hash[names[i].name] = response;
      return hash;
    }, {})
    return Promise.resolve(responseHash);
  })
}
