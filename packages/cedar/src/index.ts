// TODO: need to set up cedar-utils prepublish and .npmignore
// so that we are pulling in built code, not source, something like:
// import { deepMerge } from 'cedar-utils/helpers'
import cedarAmCharts from 'cedar-amcharts'
import { deepMerge } from 'cedar-utils'
import { flattenFeatures } from './flatten/flatten'
import { getData } from './query/query'
import { createFeatureServiceRequest } from './query/url'

export default class Cedar {
  private _series: any[]
  private _datasets: any[]
  private _chartSpecification: any
  private _cedarSpecification: any
  private _data: any[]
  private _overrides: any

  constructor(options: any) {
    // Clone options
    const opts: any = deepMerge({}, options) || {}

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
    if (typeof val !== 'function' && (val instanceof Array)) {
      this._datasets = deepMerge([], val)
    }
  }

  // Series
  public get series(): any[] {
    return this._series
  }
  public set series(val: any[]) {
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
    this._chartSpecification = deepMerge({}, chartSpec)
  }

  // Cedar Spec
  public get cedarSpecification(): any {
    return this._cedarSpecification
  }
  public set cedarSpecification(spec: any) {
    this._cedarSpecification = deepMerge({}, spec)
  }

  // NOTE: this is just psudo code to demonstrate we got the monorepo wired up
  public show(domNode: string, options?: any) {
    const opts = deepMerge({}, options)
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
