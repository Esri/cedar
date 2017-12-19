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
  const firstDataset = definition.datasets[0]

  // category field
  // will be hardcoded to 'categoryField' in the case of joined datasets
  // otherwise try to get it from the dataset
  spec.categoryField = isJoined ? 'categoryField' : firstDataset.category && firstDataset.category.field

  // single series charts
  if (definition.series.length === 1) {
    const singleSeries = definition.series[0]

    if (!spec.categoryField) {
      // probably the interim definition JSON format that spans cedar v0.x and v1.x
      // try getting category from series instead of dataset
      spec.categoryField = singleSeries.category && singleSeries.category.field
    }

    if (definition.type !== 'pie' && definition.type !== 'radar') {
      // don't show legend by default for single series charts
      if (!spec.legend) { spec.legend = {} }
      spec.legend.enabled = false

      // get default axis labels from dataset/series
      const categoryAxisTitle = firstDataset.category ? firstDataset.category.label : singleSeries.category && singleSeries.category.label
      const valueAxisTitle = singleSeries.value.label
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
        spec.valueAxes[0].title = valueAxisTitle
        spec.valueAxes[0].position = 'left'

        if (!spec.categoryAxis) { spec.categoryAxis = {} }
        spec.categoryAxis.title = categoryAxisTitle
      }
    }
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
        // if (spec.type === 'xy' && !!series.category && !!series.value) {
        if (spec.type === 'xy') {
          const category = firstDataset.category || series.category
          graph.xField = category.field
          graph.yField = series.value.field

          graph.balloonText = `<div>${category.label}: [[${category.field}]]</div><div>${series.value.label}: [[${series.value.field}]]</div>`

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
