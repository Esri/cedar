import render from './render/render'
export { deepMerge } from './helpers/helpers'

export function cedarAmCharts(elementId: string, spec: any, data?: any[]) {
  if ((!elementId || !spec || !data) && (spec.type && spec.type !== 'custom')) {
    const err = new Error('Element Id, specification, and data are all required.')
    throw err
  }

  if (spec.type && spec.type === 'custom') {
    return render.renderChart(elementId, spec)
  }

  return render.renderChart(elementId, spec, data)
}

export default cedarAmCharts
