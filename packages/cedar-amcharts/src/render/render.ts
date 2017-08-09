import { deepMerge } from 'cedar-utils'
import specs from '../specs/specs'

export function renderChart(elementId: string, config: any, data?: any) {
  if (config.type === 'custom') {
    // TODO: should we just return this chart instance?
    const chart = AmCharts.makeChart(elementId, config.specification)
    return
  }

  // Clone/copy spec and data
  let spec = fetchSpec(config.type)
  const copyData = deepMerge([], data)

  // Set the data and defaults
  spec.dataProvider = copyData
  spec.categoryField = 'categoryField'

  // Apply the series
  if (!!config.datasets) {
    spec = fillInSpec(spec, config)
  }

  // Apply overrides
  if (!!config.overrides) {
    spec = deepMerge({}, spec, config.overrides)
  }

  // TODO: should we just return this chart instance?
  const chart = AmCharts.makeChart(elementId, spec)
  return
}

export function fillInSpec(spec: any, config: any) {
  // Grab the default graph from the spec
  const defaultGraph = spec.graphs.pop()

  // create a graph for each series
  config.series.forEach((series, s) => {
    // clone the default graph
    const graph = deepMerge({}, defaultGraph)

    // Set graph title
    graph.title = series.value.label

    // TODO: populate other fields such as color, etc?
    graph.valueField = `${series.value.field}`
    graph.balloonText = `${graph.title} [[${spec.categoryField}]]: <b>[[${graph.valueField}]]</b>`

    // these are used by pie/donut charts
    // TODO: should these statements be gated to if spec.type === 'pie'
    spec.titleField = 'categoryField'
    spec.valueField = graph.valueField

    // Group vs. stack
    if (!!series.group) {
      graph.newStack = true
    }

    // scatterplots
    if (!!defaultGraph.xField && !!series.category && !!series.value) {
      graph.xField = series.category.field
      graph.yField = series.value.field

      graph.balloonText = `${series.name} [[${series.label}]] <br/>
      ${series.category.label}: [[${series.category.field}]],
      ${series.value.label}: [[${series.value.field}]]`

      if (series.size) {
        // bubble chart
        graph.valueField = series.size.field
        graph.balloonText = `${graph.balloonText} <br/> ${series.size.label}: [[${graph.valueField}]]`
      } else {
        delete graph.valueField
      }
    }

    spec.graphs.push(graph)
  })
  return spec
}

// TODO: rename, 'fetch' implies async
export function fetchSpec(type: string): any {
  return deepMerge({}, specs[type])
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
