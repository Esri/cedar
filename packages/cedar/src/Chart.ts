import { cedarAmCharts, deepMerge } from '@esri/cedar-amcharts'
// import { append, flatten, join } from './flatten/flatten'
import flattenFeatures from './flatten/flatten'
import { getData } from './query/query'
import { createFeatureServiceRequest } from './query/url'

function clone(json) {
  return JSON.parse(JSON.stringify(json))
}

// TODO: move this to flatten, or?
function getChartData(datasets: IDataset[], series: ISeries[], datasetsData?: {}) {
  const featureSets = []
  const joinKeys = []
  // TODO: remove transformFucntions here and from flattenFeatures
  const transformFunctions = []

  // get array of featureSets from datasets data or datasetsData
  datasets.forEach((dataset, i) => {
    // TODO: make name required on datasets, or required if > 1 dataset?
    const name = dataset.name || `dataset${i}`
    // if dataset doesn't have inline data use data that was passed in
    const featureSet = dataset.data || datasetsData[name]
    if (featureSet) {
      featureSets.push(featureSet)
    }
    // TOOD: later support append, but for now, always do join
    // assuming a 1:1 relationship between datasets and series
    if (!dataset.append) {
      joinKeys.push(series[i].category.field)
    }
  })

  // flatten data from all datasets into a single table
  // if there's only one dataset, just flatten the features
  // if more than one, need to join or append the feature sets
  // return (featureSets.length === 1) ? flatten(featureSets[0]) : (joinKeys.length > 0) ? join(featureSets, joinKeys) : append(featureSets)
  return flattenFeatures(featureSets, joinKeys)
}

// TODO: where should these interfaces live?
export interface IDataset {
  name: string,
  url?: string,
  data?: any[],
  query: {},
  append?: boolean
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

export interface IDefinition {
  datasets?: IDataset[],
  series?: ISeries[],
  type?: string
  specification?: {}
  overrides?: {}
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
    if (newDatasets === undefined) {
      return this._definition ? this._definition.datasets : undefined
    } else {
      if (this._definition) {
        this._definition.datasets = newDatasets
        return this
      } else {
        return this.definition({
          datasets: newDatasets
        })
      }
    }
  }

  public series(newSeries: ISeries[]): Chart
  public series(): ISeries[]
  public series(newSeries?: any): any {
    if (newSeries === undefined) {
      return this._definition ? this._definition.series : undefined
    } else {
      if (this._definition) {
        this._definition.series = newSeries
        return this
      } else {
        return this.definition({
          series: newSeries
        })
      }
    }
  }

  public type(newType: string): Chart
  public type(): string
  public type(newType?: any): any {
    if (newType === undefined) {
      return this._definition ? this._definition.type : undefined
    } else {
      if (this._definition) {
        this._definition.type = newType
        return this
      } else {
        return this.definition({
          type: newType
        })
      }
    }
  }

  public specification(newSpecification: {}): Chart
  public specification(): {}
  public specification(newSpecification?: any): any {
    if (newSpecification === undefined) {
      return this._definition ? this._definition.specification : undefined
    } else {
      if (this._definition) {
        this._definition.specification = newSpecification
        return this
      } else {
        return this.definition({
          specification: newSpecification
        })
      }
    }
  }

  public overrides(newOverrides: {}): Chart
  public overrides(): {}
  public overrides(newOverrides?: any): any {
    if (newOverrides === undefined) {
      return this._definition ? this._definition.overrides : undefined
    } else {
      if (this._definition) {
        this._definition.overrides = newOverrides
        return this
      } else {
        return this.definition({
          overrides: newOverrides
        })
      }
    }
  }

  // chart data
  public data() {
    return this._data
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
          requests.push(getData(createFeatureServiceRequest(dataset)))
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
    const series = this.series()
    this._data = datasets ? getChartData(datasets, series, datasetsData) : []
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
}
