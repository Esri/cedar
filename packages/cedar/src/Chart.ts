import { cedarAmCharts } from '@esri/cedar-amcharts'
import { IDataset, ISeries } from './common'
import { getChartData } from './dataset'
import { queryDatasets } from './query/query'

// TODO: where should these interfaces live?

/**
 * Properties to control the visibility and position of the chart's legend
 */
export interface ILegend {
  visible?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Properties specific to pie charts
 */
export interface IPie {
  /**
   * How much of the center of the chart should be cut out to create a donut chart?
   */
  innerRadius?: number | string
  /**
   * Should slices expand outward when clicked?
   */
  expand?: number | string
}

/**
 * Padding around the chart (in pixels)
 */
export interface IPadding {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

/**
 * Additional properties to define how a chart is rendered
 */
export interface IStyle {
  pie?: IPie
  padding?: IPadding,
  /**
   * An array of colors that will be applied to the chart series
   */
  colors?: string[]
}

/**
 * Defines where a chart gets it's data from and how the data is rendered in the chart
 */
export interface IDefinition {
  /**
   * Where the chart's data comes from
   */
  datasets?: IDataset[]
  /**
   * How that data is bound to plots (bars, lines, points, etc) on the chart
   */
  series?: ISeries[]
  /**
   * A string representing one of the pre-defined (bar, line, pie, etc) chart specifications
   */
  type?: string
  /**
   * An specification for custom chart type (used instead of `type`)
   */
  specification?: {}
  /**
   * Overrides of specification properties
   */
  overrides?: {}
  /**
   * Properties to control the visibility and position of the chart's legend
   */
  legend?: ILegend
  /**
   * Additional properties to define how a chart is rendered
   */
  style?: IStyle
}

/**
 * An instance of a cedar chart that will be rendered at a given DOM node (container) based on a [definition](../interfaces/idefinition.html).
 * ```js
 *   // initialize the chart
 *   var chart = new Chart(elementId, definition);
 *   // fetch chart data and render the chart
 *   chart.show();
 * ```
 */
export class Chart {
  private _container: string
  private _definition: IDefinition
  private _data: any[]

  /**
   *
   * @param container The DOM node where the chart will be rendered
   * @param definition Defines how the data will be rendered in the chart
   */
  constructor(container, definition?: IDefinition) {
    if (!container) {
      throw new Error('A container is required')
    }
    this._container = container

    if (definition) {
      // set the definition
      this.definition(definition)
    }
  }

  // Setters and getters

  /**
   *
   * Set the definition
   * @param newDefinition
   */
  public definition(newDefinition: IDefinition): Chart
  /**
   * Get the definition
   */
  public definition(): IDefinition
  public definition(newDefinition?: any): any {
    if (newDefinition === undefined) {
      return this._definition
    } else {
      this._definition = newDefinition
      return this
    }
  }

  /**
   *
   * Set the chart's datasets
   * @param newDatasets Array of datasets
   */
  public datasets(newDatasets: IDataset[]): Chart
  /**
   * Get the chart's datasets
   */
  public datasets(): IDataset[]
  public datasets(newDatasets?: any): any {
    return this._definitionAccessor('datasets', newDatasets)
  }

  /**
   * Set the chart's series
   * @param newSeries
   */
  public series(newSeries: ISeries[]): Chart
  /**
   * Get the chart's series
   */
  public series(): ISeries[]
  public series(newSeries?: any): any {
    return this._definitionAccessor('series', newSeries)
  }

  /**
   * Set the chart type
   * @param newType
   */
  public type(newType: string): Chart
  /**
   * Get the chart type
   */
  public type(): string
  public type(newType?: any): any {
    return this._definitionAccessor('type', newType)
  }

  /**
   * Set the chart's specification
   * @param newSpecification
   */
  public specification(newSpecification: {}): Chart
  /**
   * Get the chart's specification
   */
  public specification(): {}
  public specification(newSpecification?: any): any {
    return this._definitionAccessor('specification', newSpecification)
  }

  /**
   * Override specification properties
   * @param newOverrides
   */
  public overrides(newOverrides: {}): Chart
  /**
   * Get the specification overrides
   */
  public overrides(): {}
  public overrides(newOverrides?: any): any {
    return this._definitionAccessor('overrides', newOverrides)
  }

  /**
   * Set the chart's legend properties
   * @param newLegend
   */
  public legend(newLegend: ILegend): Chart
  /**
   * Get the chart legend settings
   */
  public legend(): ILegend
  public legend(newLegend?: any): any {
    return this._definitionAccessor('legend', newLegend)
  }

  /**
   * Set the chart's styles
   * @param newStyle
   */
  public style(newStyle: IStyle): Chart
  public style(): IStyle
  /**
   * Get the chart's styles
   */
  public style(newStyle?: any): any {
    return this._definitionAccessor('style', newStyle)
  }

  /**
   * Get the internal copy of the data used to render the chart
   */
  public data() {
    return this._data
  }

  /**
   * Get a dataset from the definition by name
   * @param datasetName The name of the dataset to get
   */
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

  /**
   * Query data for all non-inline datasets
   */
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

  /**
   * Re-draw the chart based on the current data and definition
   */
  public render() {
    cedarAmCharts(this._container, this.definition(), this.data())
    return this
  }

  /**
   * Execute the query(), updateData(), and render() functions
   */
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
