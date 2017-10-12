import { cedarAmCharts, deepMerge } from '@esri/cedar-amcharts'
import { flattenFeatures } from './flatten/flatten'
import { getData } from './query/query'
import { createFeatureServiceRequest } from './query/url'

function clone(json) {
  return JSON.parse(JSON.stringify(json))
}

export default class Chart {
  private _series: any[]
  private _datasets: any[]
  private _chartSpecification: any
  private _cedarSpecification: any
  private _data: any[]
  private _overrides: any
  private _container: string

  constructor(container, options: any = {}) {
    if (!container) {
      throw new Error('A container is required')
    }
    this._container = container

    // If there are datasets...
    if (options.datasets) {
      this.datasets = options.datasets
    }
    // If there are series...
    if (options.series) {
      this.series = options.series
    }

    if (options) {
      this.cedarSpecification = options
    }
  }

  // Setters and getters

  // Datasets
  public get datasets(): any[] {
    return this._datasets
  }
  public set datasets(val: any[]) {
    // TODO: type any[] can't be a function, why is this code checking for that
    if (typeof val !== 'function' && (val instanceof Array)) {
      this._datasets = clone(val)
    }
  }

  // Series
  public get series(): any[] {
    return this._series
  }
  public set series(val: any[]) {
    // TODO: type any[] can't be a function, why is this code checking for that
    if (typeof val !== 'function' && (val instanceof Array)) {
      this._series = deepMerge([], val)
    }
  }

  // Data
  public get data(): any[] {
    return this._data
  }

  // Chart Specification
  public get chartSpecification(): any {
    return this._chartSpecification
  }
  public set chartSpecification(chartSpec: any) {
    this._chartSpecification = clone(chartSpec)
  }

  // Cedar Spec
  public get cedarSpecification(): any {
    return this._cedarSpecification
  }
  public set cedarSpecification(spec: any) {
    // NOTE: we can only use clone here if spec is JSON
    this._cedarSpecification = clone(spec)
  }

  public queryData() {
    const names = []
    const requests = []
    const responseHash = {}

    if (this.datasets) {
      this.datasets.forEach((dataset, i) => {
        // only query datasets that don't have inline data
        if (!dataset.data) {
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

  public updateData(datasetsData: {}) {
    const featureSets = []
    const joinKeys = []
    // TODO: remove transformFucntions here and from flattenFeatures
    const transformFunctions = []

    // get array of featureSets from datasets data or datasetsData
    this.datasets.forEach((dataset, i) => {
      // TODO: make name required on datasets, or required if > 1 dataset?
      const name = dataset.name || `dataset${i}`
      // if dataset doesn't have inline data use data that was passed in
      const featureSet = dataset.data || datasetsData[name]
      if (featureSet) {
        featureSets.push(featureSet)
      }
      // TODO: this is broken, there is not a 1:1 relationship between datasets/series
      if (!dataset.merge) {
        joinKeys.push(this.series[i].category.field)
      }
    })

    this._data = flattenFeatures(featureSets, joinKeys, transformFunctions)
    return this
  }

  public render() {
    cedarAmCharts(this._container, this.cedarSpecification, this.data)
    return this
  }

  public show() {
    return this.queryData()
    .then((response) => {
      return this.updateData(response).render()
    })
  }
}
