import { cedarAmCharts } from '@esri/cedar-amcharts'
import { flattenFeatureSet, flattenFeatureSets } from './flatten/flatten'
import { getData } from './query/query'
import { createQueryParams, getQueryUrl } from './query/url'

function clone(json) {
  return JSON.parse(JSON.stringify(json))
}

// flatten data from all datasets into a single table
function getChartData(datasets: IDataset[], datasetsData?: {}) {
  let name
  let featureSet
  if (datasets.length === 1) {
    // if there's only one dataset, just return the flattened features
    const dataset = datasets[0]
    name = dataset.name || `dataset0`
    featureSet = dataset.data || datasetsData[name]
    return flattenFeatureSet(featureSet)
  }

  // if more than one, need to join the feature sets
  const featureSets = []
  const joinKeys = []

  // get array of featureSets from datasets data or datasetsData
  datasets.forEach((dataset, i) => {
    // TODO: make name required on datasets, or required if > 1 dataset?
    name = dataset.name || `dataset${i}`
    // if dataset doesn't have inline data use data that was passed in
    featureSet = dataset.data || datasetsData[name]
    if (featureSet) {
      featureSets.push(featureSet)
    }
    joinKeys.push(dataset.join)
  })
  return flattenFeatureSets(featureSets, joinKeys)
}

// TODO: where should these interfaces live?
export interface IDataset {
  name: string,
  url?: string,
  data?: any[],
  query: {},
  join?: string
}

export interface IField {
  field: string,
  label?: string
}

export interface ISeries {
  source: string,
  category?: IField,
  value?: IField
}

export interface ILegend {
  enable: boolean
}

export interface IDefinition {
  datasets?: IDataset[],
  series?: ISeries[],
  type?: string
  specification?: {}
  overrides?: {},
  legend?: ILegend
}

export default class Chart {
  private _container: string
  private _definition: IDefinition
  private _data: any[]

  constructor(container, definition?) {
    if (!container) {
      throw new Error('A container is required')
    }
    this._container = container

    if (definition) {
      // set the definition
      this.definition(clone(definition))
    }
  }

  // Setters and getters
  public definition(newDefinition: IDefinition): Chart
  public definition(): IDefinition
  public definition(newDefinition?: any): any {
    if (newDefinition === undefined) {
      return this._definition
    } else {
      this._definition = newDefinition
      return this
    }
  }

  public datasets(newDatasets: IDataset[]): Chart
  public datasets(): IDataset[]
  public datasets(newDatasets?: any): any {
    return this._definitionAccessor('datasets', newDatasets)
  }

  public series(newSeries: ISeries[]): Chart
  public series(): ISeries[]
  public series(newSeries?: any): any {
    return this._definitionAccessor('series', newSeries)
  }

  public type(newType: string): Chart
  public type(): string
  public type(newType?: any): any {
    return this._definitionAccessor('type', newType)
  }

  public specification(newSpecification: {}): Chart
  public specification(): {}
  public specification(newSpecification?: any): any {
    return this._definitionAccessor('specification', newSpecification)
  }

  public overrides(newOverrides: {}): Chart
  public overrides(): {}
  public overrides(newOverrides?: any): any {
    return this._definitionAccessor('overrides', newOverrides)
  }

  public legend(newLegend: {}): Chart
  public legend(): {}
  public legend(newLegend?: any): any {
    return this._definitionAccessor('legend', newLegend)
  }

  // data is read only
  public data() {
    return this._data
  }

  // get dataset by name
  public dataset(datasetName: string): IDataset {
    const datasets = this.datasets()
    let match
    if (datasets) {
      datasets.some((dataset) => {
        if (dataset.name === datasetName) {
          match = dataset
          return true
        }
      })
    }
    return match
  }

  // query non-inline datasets
  public query() {
    const names = []
    const requests = []
    const responseHash = {}
    const datasets = this.datasets()

    if (datasets) {
      datasets.forEach((dataset, i) => {
        // only query datasets that don't have inline data
        if (dataset.url) {
          // TODO: make name required on datasets, or required if > 1 dataset?
          names.push(dataset.name || `dataset${i}`)
          const queryUrl = getQueryUrl(dataset)
          const queryParams = createQueryParams(dataset.query)
          requests.push(getData(queryUrl, queryParams))
        }
      })
    }
    return Promise.all(requests)
    .then((responses) => {
      responses.forEach((response, i) => {
        responseHash[names[i]] = responses[i]
      })
      return Promise.resolve(responseHash)
    }, (err) => {
      return Promise.reject(err)
    })
  }

  // update chart from inline data and query responses
  public updateData(datasetsData) {
    const datasets = this.datasets()
    this._data = datasets ? getChartData(datasets, datasetsData) : []
    return this
  }

  // re-draw the chart based on the current state
  public render() {
    cedarAmCharts(this._container, this.definition(), this.data())
    return this
  }

  // rollup the query, update, and render functions
  // useful for showing the chart for the first time
  public show() {
    return this.query()
    .then((response) => {
      return this.updateData(response).render()
    })
  }

  // implementation for all setters/getters for definition properties
  private _definitionAccessor(propertyName: string, newPropertyValue?: any): any {
    const definition = this._definition
    if (newPropertyValue === undefined) {
      return definition ? definition[propertyName] : undefined
    } else {
      if (definition) {
        definition[propertyName] = newPropertyValue
        return this
      } else {
        const newDefinition = {}
        newDefinition[propertyName] = newPropertyValue
        return this.definition(newDefinition)
      }
    }
  }
}
