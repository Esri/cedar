import { cedarAmCharts } from '@esri/cedar-amcharts'
import { getChartData, IDataset, ISeries } from './dataset'
import { queryDatasets } from './query/query'

function clone(json) {
  return JSON.parse(JSON.stringify(json))
}

// TODO: where should these interfaces live?
export interface ILegend {
  visible?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export interface IPie {
  innerRadius?: number | string
  expand?: number | string
}

export interface IPadding {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export interface IStyle {
  pie?: IPie
  padding?: IPadding,
  colors?: string[]
}

export interface IDefinition {
  datasets?: IDataset[]
  series?: ISeries[]
  type?: string
  specification?: {}
  overrides?: {}
  legend?: ILegend
  style?: IStyle
}

export class Chart {
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

  public legend(newLegend: ILegend): Chart
  public legend(): ILegend
  public legend(newLegend?: any): any {
    return this._definitionAccessor('legend', newLegend)
  }

  public style(newStyle: IStyle): Chart
  public style(): IStyle
  public style(newStyle?: any): any {
    return this._definitionAccessor('style', newStyle)
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
    return queryDatasets(this.datasets())
  }

  // update chart from inline data and query responses
  public updateData(datasetsData) {
    const datasets = this.datasets()
    const options = {
      datasetsData,
      series: this.series()
    }
    this._data = getChartData(datasets, options)
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
