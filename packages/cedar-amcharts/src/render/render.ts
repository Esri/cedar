/* globals AmCharts:false */
import deepmerge from 'deepmerge'
import specs from '../specs/specs'

// TODO: how to have access to IDefinition
export function renderChart(elementId: string, definition: any, data?: any) {
  if (definition.type === 'custom') {
    const chart = AmCharts.makeChart(elementId, definition.specification)

    return
  }

  // Clone/copy spec and data
  // Longer than normal conditional so setting as its own const
  const hasSpecAndIsntString = definition.specification && typeof definition.specification !== 'string'
  // ternary checking to see if there is a def.spec and that it is NOT a string (url)
  // if true than return def.spec. If not true than fetch a premade spec
  let spec = hasSpecAndIsntString ? clone(definition.specification) : fetchSpec(definition.type)
  const copyData = clone(data)

  // Set the spec's data
  spec.dataProvider = copyData

  // Apply the series
  if (!!definition.datasets) {
    spec = fillInSpec(spec, definition)
  }

  // Apply overrides
  if (definition.overrides) {
    // NOTE: this counts on using deepmerge < 2.x
    // see: https://github.com/KyleAMathews/deepmerge#arraymerge
    spec = deepmerge(spec, definition.overrides, { clone: true })
  }

  const chart = AmCharts.makeChart(elementId, spec)
  return
}

export function fillInSpec(spec: any, definition: any) {
  // Grab the graphSpec from the spec
  const graphSpec = spec.graphs.pop()
  const isJoined = definition.datasets.length > 1

  // category field will be 'categoryField' in the case of joined datasets
  // otherwise get it from the first series
  spec.categoryField = isJoined ? 'categoryField' : definition.series[0].category.field

  // Add a legend in case it's not on the spec
  if (!spec.legend) { spec.legend = {} }
  // TODO This is needed as 'legend.enable' has been renamed 'legend.visible'. We are only introducing
  // breaking changes on major releases.
  // Remove the line below on next breaking change
  if (definition.legend && definition.legend.hasOwnProperty('enable')) { definition.legend.visible = definition.legend.enable }

  // adjust legend and axis labels for single series charts
  if (definition.series.length === 1 && (definition.type !== 'pie' && definition.type !== 'radar')) {

    // don't show legend by default for single series charts
    spec.legend.enabled = false

    // get default axis labels from series
    const categoryAxisTitle = definition.series[0].category.label
    const valueAxisTitle = definition.series[0].value.label

    if (spec.type === 'xy' && Array.isArray(spec.valueAxes)) {
      // for xy charts we treat the x axis as the category axis
      // and the y axis as the value axis
      spec.valueAxes.forEach((axis) => {
        if (axis.position === 'bottom') {
          axis.title = categoryAxisTitle
        } else if (axis.position === 'left') {
          axis.title = valueAxisTitle
        }
      })
    } else {
      if (!spec.valueAxes) { spec.valueAxes = [{}] }
      spec.valueAxes[0].title = definition.series[0].value.label
      spec.valueAxes[0].position = 'left'

      if (!spec.categoryAxis) { spec.categoryAxis = {} }
      spec.categoryAxis.title = categoryAxisTitle
    }
  }

  // Handle Legend in case.
  if (definition.legend) {
    const legend = definition.legend
    const supportedLegendPositions: string[] = ['top', 'bottom', 'left', 'right']
    if (legend.hasOwnProperty('visible')) {
      spec.legend.enabled = legend.visible
    }
    if (legend.position && supportedLegendPositions.indexOf(legend.position) > -1) {
      spec.legend.position = legend.position
    }
  }

  // Iterate over datasets
  definition.datasets.forEach((dataset, d) => {
    const datasetName = dataset.name
    // For each dataset iterate over series
    definition.series.forEach((series, s) => {
      if (dataset.name === series.source) {
        const graph = clone(graphSpec)

        // use the value field label for the graph's title
        graph.title = series.value.label
        // value field will contain dataset name if joined
        graph.valueField = isJoined ? `${datasetName}_${series.value.field}` : series.value.field
        // TODO: map other fields besides value like color, size, etc
        // tooltip
        graph.balloonText = `${graph.title} [[${spec.categoryField}]]: <b>[[${graph.valueField}]]</b>`

        // Group vs. stack
        if (!!series.stack && graph.newStack) {
          graph.newStack = false
        }

        // special props for pie charts
        if (definition.type === 'pie') {
          spec.titleField = spec.categoryField
          spec.valueField = graph.valueField
        }

        // special props for x/y types (scatter, bubble)
        if (spec.type === 'xy' && !!series.category && !!series.value) {
          graph.xField = series.category.field
          graph.yField = series.value.field

          graph.balloonText = `<div>${series.category.label}: [[${series.category.field}]]</div><div>${series.value.label}: [[${series.value.field}]]</div>`

          // bubble
          if (spec.type === 'xy' && series.size) {
            graph.valueField = series.size.field
            graph.balloonText = `${graph.balloonText}<div>${series.size.label}: [[${graph.valueField}]]</div>`
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
  let spec = type
  if (spec === 'time') {
    console.warn(`'time' is no longer a supported type. Please use 'timeline' instead`)
    spec = 'timeline'
  } else if (spec === 'bubble') {
    console.warn(`'bubble' is no longer a supported type. Please use 'scatter' instead`)
    spec = 'scatter'
  } else if (spec === 'grouped') {
    console.warn(`'grouped' is no longer a supported type. Please use 'bar' instead`)
    spec = 'bar'
  }
  return clone(specs[spec])
}

function clone(json) {
  return JSON.parse(JSON.stringify(json))
}

// TODO: remove
const render = {
  renderChart,
  fillInSpec,
  fetchSpec
}

export default render
