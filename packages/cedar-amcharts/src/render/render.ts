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

  if (definition.series.length === 1 && (definition.type !== 'pie' || definition.type !== 'radar')) {
    if (!spec.valueAxes) { spec.valueAxes = [{}] }
    spec.valueAxes[0].title = definition.series[0].value.label
    spec.valueAxes[0].position = 'left'

    if (!spec.legend) { spec.legend = {} }
    spec.legend.enabled = false

    if (!spec.categoryAxis) { spec.categoryAxis = {} }
    spec.categoryAxis.title = definition.series[0].category.label
  }

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

        spec.titleField = 'categoryField'
        spec.valueField = graph.valueField

        // Group vs. stack
        if (!!series.stack && graph.newStack) {
          graph.newStack = false
        }

        // x/y types, scatter, bubble
        if (spec.type === 'xy' && !!series.category && !!series.value) {
          graph.xField = series.category.field
          graph.yField = series.value.field

          graph.balloonText = `${series.name} [[${series.label}]] <br/>
          ${series.category.label}: [[${series.category.field}]],
          ${series.value.label}: [[${series.value.field}]]`

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

export function templateGraph(): any {
  return {
    title: '{{series.label}}',
    valueField: '{{series.field}}',
    balloonText: '{{graph.title}} [[{{spec.categoryField}}]]: <b>[[{{graph.valueField}}]]</b>'
  }
}

// TODO: remove
const render = {
  renderChart,
  fillInSpec,
  fetchSpec
}

export default render
