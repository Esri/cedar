import { queryFeatures } from '@esri/arcgis-rest-feature-service'
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
        requests.push(queryFeatures({
          url: dataset.url,
          params: queryParams
        }))
      }
    })
  }
  return Promise.all(requests)
  .then((responses) => {
    // turn the array of responses into a hash keyed off the dataset names
    const responseHash = responses.reduce((hash, response, i) => {
      hash[names[i]] = responses[i]
      return hash
    }, {})
    return Promise.resolve(responseHash)
  })
}
