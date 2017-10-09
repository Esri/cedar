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

  constructor(options: any) {
    // Clone options
    const opts: any = clone(options || {})

    // If there are datasets...
    if (!!opts.datasets) {
      this.datasets = opts.datasets
    }
    // If there are series...
    if (!!opts.series) {
      this.series = opts.series
    }

    if (!!opts) {
      this.cedarSpecification = opts
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
  public set data(data: any[]) {
    this._data = deepMerge([], data)
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

  public show(domNode: string, options: any = {}) {
    const opts = clone(options)
    const requests = []
    const joinKeys = []
    const transformFunctions = []

    if (!!this.datasets && !!this.series) {
      this.datasets.forEach((dataset, i) => {
        requests.push(getData(createFeatureServiceRequest(dataset)))
        if (!dataset.merge) {
          joinKeys.push(this.series[i].category.field)
        }
      })
      //
      // for (const series of this.series) {
      //   joinKeys.push(series.category.field)
      // }
    }
    Promise.all(requests)
      .then((responses) => {
        this.data = flattenFeatures(responses, joinKeys, transformFunctions)
        cedarAmCharts(domNode, this.cedarSpecification, this.data)
      })
  }
}
