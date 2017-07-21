// TODO: need to set up cedar-utils prepublish and .npmignore
// so that we are pulling in built code, not source, something like:
// import { deepMerge } from 'cedar-utils/helpers'
import * as cedarAmCharts from 'cedar-amcharts'
import { deepMerge } from 'cedar-utils'

export default class Cedar {
  public spec: any
  constructor(spec: any) {
    this.spec = spec
  }

  // Setters and getters
  public get datasets(): any[] {
    return this.datasets
  }
  public set datasets(datasets: any[]) {
    this.datasets = deepMerge([], datasets)
  }

  public get series(): any[] {
    return this.series
  }
  public set series(series: any[]) {
    this.series = deepMerge([], series)
  }

  // NOTE: this is just psudo code to demonstrate we got the monorepo wired up
  public show(domNode, options) {
    const defaults = {
      renderer: 'svg',
      autolabels: false
    }
    const opts = deepMerge({}, defaults, options)
  }
}
