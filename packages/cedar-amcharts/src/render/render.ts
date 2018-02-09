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

  if (definition.legend) {
    spec.legend.enabled = definition.legend.enable
  }
  // If we have styles....
  if (definition.styles) {
    // Snag out styles for brevities sake
    const styles = definition.styles
    // If a backgroundColor..
    if (styles.backgroundColor) { spec.backgroundColor = styles.backgroundColor }
    // If a backgroundAlpha..
    if (styles.backgroundAlpha) { spec.backgroundAlpha = styles.backgroundAlpha }
    // If a textColor
    if (styles.textColor) { spec.color = styles.textColor }
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
        if (isJoined) {
          // use dataset index to look up the value
          // TODO: should this be dataset name?
          // that would mean the names are required and unique
          // why aren't we using a hash for datasets?
          graph.valueField = `${series.value.field}_${d}`
        } else {
          graph.valueField = series.value.field
        }
        /* tslint:enable */
        // TODO: map other fields besides value like color, size, etc

        // handle le color
        if (definition.styles && definition.styles.colors) {
          graph.lineColor = definition.styles.colors[s]
        }

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
