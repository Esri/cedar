// import * as utils from 'cedar-utils'
import flattenFeatures from './flatten/flatten'
import render from './render/render'

function cedarAmCharts(elementId: string, spec: any, data?: any[]) {
  if ((!elementId || !spec || !data) && (spec.type && spec.type !== 'custom')) {
    const err = new Error('Element Id, specification, and data are all required.')
    throw err
  }

  if (spec.type && spec.type === 'custom') {
    return render.renderChart(elementId, spec)
  }

  const flattenedData = flattenFeatures(data)
  return render.renderChart(elementId, spec, flattenedData)
}

export default cedarAmCharts
