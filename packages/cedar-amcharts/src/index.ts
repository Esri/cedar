import Cedar from 'cedar'
import render from './render/render'

function cedarAmCharts(elementId: string, spec: any, data?: any[]) {
  if ((!elementId || !spec || !data) && (spec.type && spec.type !== 'custom')) {
    const err = new Error('Element Id, specification, and data are all required.')
    throw err
  }

  if (spec.type && spec.type === 'custom') {
    return render.renderChart(elementId, spec)
  }

  return render.renderChart(elementId, spec, data)
}

// make this function available to cedar by appendting to cedar's global namespace
// TODO: better name
Cedar.cedarAmCharts = cedarAmCharts
