import { deepMerge } from '../helpers/helpers'
import specs from '../specs/specs'

// TODO: move this to a separate file
AmCharts.themes.calcite = {

  themeName: 'calcite',

  AmChart: {
    color: '#000000', backgroundColor: '#FFFFFF'
  },

  AmCoordinateChart: {
    // colors: ["#67b7dc", "#fdd400", "#84b761", "#cc4748", "#cd82ad", "#2f4074", "#448e4d", "#b7b83f", "#b9783f", "#b93e3d", "#913167"],
    colors: ['#0079c1', '#e4d154', '#5a9359', '#de2900', '#9081bc', '#005e95', '#338033', '#d9bf2b', '#a57946', '#ab3c16', '#7461a8'],
    startDuration: 0,
    startEffect: 'easeInSine'
  },

  AmStockChart: {
    // colors: ["#67b7dc", "#fdd400", "#84b761", "#cc4748", "#cd82ad", "#2f4074", "#448e4d", "#b7b83f", "#b9783f", "#b93e3d", "#913167"]
    colors: ['#0079c1', '#e4d154', '#5a9359', '#de2900', '#9081bc', '#005e95', '#338033', '#d9bf2b', '#a57946', '#ab3c16', '#7461a8']
  },

  AmSlicedChart: {
    // colors: ["#67b7dc", "#fdd400", "#84b761", "#cc4748", "#cd82ad", "#2f4074", "#448e4d", "#b7b83f", "#b9783f", "#b93e3d", "#913167"],
    colors: ['#0079c1', '#e4d154', '#5a9359', '#de2900', '#9081bc', '#005e95', '#338033', '#d9bf2b', '#a57946', '#ab3c16', '#7461a8'],
    outlineAlpha: 1,
    outlineThickness: 2,
    labelTickColor: '#000000',
    labelTickAlpha: 0.3
  },

  AmRectangularChart: {
    zoomOutButtonColor: '#000000',
    zoomOutButtonRollOverAlpha: 0.15,
    zoomOutButtonImage: 'lens'
  },

  AxisBase: {
    autoWrap: true,      // calcite
    autoRotateAngle: 45, // calcite
    autoRotateCount: 5, // calcite
    axisColor: '#000000',
    axisAlpha: 0.3,
    gridAlpha: 0,
    gridColor: '#000000',
    tickLength: 0,
    labelOffset: 5
  },

  ChartScrollbar: {
    backgroundColor: '#000000',
    backgroundAlpha: 0.12,
    graphFillAlpha: 0.5,
    graphLineAlpha: 0,
    selectedBackgroundColor: '#FFFFFF',
    selectedBackgroundAlpha: 0.4,
    gridAlpha: 0.15
  },

  ChartCursor: {
    cursorColor: '#000000',
    color: '#FFFFFF',
    cursorAlpha: 0
  },

  AmLegend: {
    color: '#000000',
  },

  AmGraph: {
    fillAlphas: 0.9,  // calcite
    lineAlpha: 0.9
  },
  GaugeArrow: {
    color: '#000000',
    alpha: 0.8,
    nailAlpha: 0,
    innerRadius: '40%',
    nailRadius: 15,
    startWidth: 15,
    borderAlpha: 0.8,
    nailBorderAlpha: 0
  },

  GaugeAxis: {
    tickColor: '#000000',
    tickAlpha: 1,
    tickLength: 15,
    minorTickLength: 8,
    axisThickness: 3,
    axisColor: '#000000',
    axisAlpha: 1,
    bandAlpha: 0.8
  },

  TrendLine: {
    lineColor: '#c03246',
    lineAlpha: 0.8
  },

  // ammap
  AreasSettings: {
    alpha: 0.8,
    color: '#67b7dc',
    colorSolid: '#003767',
    unlistedAreasAlpha: 0.4,
    unlistedAreasColor: '#000000',
    outlineColor: '#FFFFFF',
    outlineAlpha: 0.5,
    outlineThickness: 0.5,
    rollOverColor: '#3c5bdc',
    rollOverOutlineColor: '#FFFFFF',
    selectedOutlineColor: '#FFFFFF',
    selectedColor: '#f15135',
    unlistedAreasOutlineColor: '#FFFFFF',
    unlistedAreasOutlineAlpha: 0.5
  },

  LinesSettings: {
    color: '#000000',
    alpha: 0.8
  },

  ImagesSettings: {
    alpha: 0.8,
    labelColor: '#000000',
    color: '#000000',
    labelRollOverColor: '#3c5bdc'
  },

  ZoomControl: {
    buttonFillAlpha: 0.7,
    buttonIconColor: '#a7a7a7'
  },

  SmallMap: {
    mapColor: '#000000',
    rectangleColor: '#f15135',
    backgroundColor: '#FFFFFF',
    backgroundAlpha: 0.7,
    borderThickness: 1,
    borderAlpha: 0.8
  },

  // the defaults below are set using CSS syntax, you can use any existing css property
  // if you don't use Stock chart, you can delete lines below
  PeriodSelector: {
    color: '#000000'
  },

  PeriodButton: {
    color: '#000000',
    background: 'transparent',
    opacity: 0.7,
    border: '1px solid rgba(0, 0, 0, .3)',
    MozBorderRadius: '5px',
    borderRadius: '5px',
    margin: '1px',
    outline: 'none',
    boxSizing: 'border-box'
  },

  PeriodButtonSelected: {
    color: '#000000',
    backgroundColor: '#b9cdf5',
    border: '1px solid rgba(0, 0, 0, .3)',
    MozBorderRadius: '5px',
    borderRadius: '5px',
    margin: '1px',
    outline: 'none',
    opacity: 1,
    boxSizing: 'border-box'
  },

  PeriodInputField: {
    color: '#000000',
    background: 'transparent',
    border: '1px solid rgba(0, 0, 0, .3)',
    outline: 'none'
  },

  DataSetSelector: {

    color: '#000000',
    selectedBackgroundColor: '#b9cdf5',
    rollOverBackgroundColor: '#a8b0e4'
  },

  DataSetCompareList: {
    color: '#000000',
    lineHeight: '100%',
    boxSizing: 'initial',
    webkitBoxSizing: 'initial',
    border: '1px solid rgba(0, 0, 0, .3)'
  },

  DataSetSelect: {
    border: '1px solid rgba(0, 0, 0, .3)',
    outline: 'none'
  }

}

// TODO: how to have access to IDefinition
export function renderChart(elementId: string, definition: any, data?: any) {
  if (definition.type === 'custom') {
    const chart = AmCharts.makeChart(elementId, definition.specification)

    return
  }

  // Clone/copy spec and data
  let spec = fetchSpec(definition.type)
  const copyData = clone(data)

  // Set the data and defaults
  spec.dataProvider = copyData
  spec.categoryField = 'categoryField'

  // Apply the series
  if (!!definition.datasets) {
    spec = fillInSpec(spec, definition)
  }

  // Apply overrides
  if (!!definition.overrides) {
    spec = deepMerge({}, spec, definition.overrides)
  }

  const chart = AmCharts.makeChart(elementId, spec)
  return
}

export function fillInSpec(spec: any, definition: any) {
  // Grab the graphSpec from the spec
  const graphSpec = spec.graphs.pop()

  // Iterate over datasets
  definition.datasets.forEach((dataset, d) => {
    // For each dataset iterate over series
    definition.series.forEach((series, s) => {
      if (dataset.name === series.source) {
        const graph = clone(graphSpec)

        // Set graph title
        graph.title = series.value.label

        /* tslint:disable prefer-conditional-expression */
        if (definition.datasets.length > 1) {
          // data has been joined use dataset index to look up the value
          // TODO: should this be dataset name?
          // that would mean the names are required and unique
          // why aren't we using a hash for datasets?
          graph.valueField = `${series.value.field}_${d}`
        } else {
          graph.valueField = series.value.field
        }
        /* tslint:enable */
        // TODO: map other fields besides value like color, size, etc

        graph.balloonText = `${graph.title} [[${spec.categoryField}]]: <b>[[${graph.valueField}]]</b>`
        graph.labelText = `[[${series.value.field}]]`

        spec.titleField = 'categoryField'
        spec.valueField = graph.valueField

        // Group vs. stack
        if (!!series.group) {
          graph.newStack = true
        }

        // x/y types, scatter, bubble
        if (spec.type === 'xy' && !!series.category && !!series.value) {
          graph.xField = series.category.field
          graph.yField = series.value.field

          graph.balloonText = `${series.name} [[${series.label}]] <br/>
          ${series.category.label}: [[${series.category.field}]],
          ${series.value.label}: [[${series.value.field}]]`

          graph.labelText = ''

          // bubble
          if (spec.type === 'xy' && series.size) {
            graph.valueField = series.size.field
            graph.balloonText = `${graph.balloonText} <br/> ${series.size.label}: [[${graph.valueField}]]`
          } else {
            delete graph.valueField
          }
        }

        spec.graphs.push(graph)
      }
    })
  })
  return spec
}

export function fetchSpec(type: string): any {
  return clone(specs[type])
}

function clone(json) {
  return JSON.parse(JSON.stringify(json))
}

export function templateGraph(): any {
  return {
    title: '{{series.label}}',
    valueField: '{{series.field}}',
    balloonText: '{{graph.title}} [[{{spec.categoryField}}]]: <b>[[{{graph.valueField}}]]</b>'
  }
}

const render = {
  renderChart,
  fillInSpec,
  fetchSpec
}

export default render
