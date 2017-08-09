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
  // Grab the graphSpec from the spec
  const graphSpec = spec.graphs.pop()

  // create a graph for each series
  config.series.forEach((series, s) => {
    const graph = deepMerge({}, graphSpec)

    // Set graph title
    graph.title = series.value.label

    // TODO: Look at all fields ()
    graph.valueField = `${series.value.field}`
    graph.balloonText = `${graph.title} [[${spec.categoryField}]]: <b>[[${graph.valueField}]]</b>`

    spec.titleField = 'categoryField'
    spec.valueField = graph.valueField

    // Group vs. stack
    if (!!series.group) {
      graph.newStack = true
    }

    // Only clone scatterplots
    if (!!graphSpec.xField && !!series.category && !!series.value) {
      graph.xField = series.category.field
      graph.yField = series.value.field

      graph.balloonText = `${series.name} [[${series.label}]] <br/>
      ${series.category.label}: [[${series.category.field}]],
      ${series.value.label}: [[${series.value.field}]]`

      graph.labelText = ''
    }

    // Bubble charts
    if (!!graphSpec.valueField && !!series.size) {
      graphSpec.valueField = series.size.field
      graph.balloonText = `${graph.balloonText} <br/> ${series.size.label}: [[${graph.valueField}]]`
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
