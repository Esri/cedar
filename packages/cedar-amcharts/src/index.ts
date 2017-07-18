import * as utils from 'cedar-utils'
import flatten from './flatten/flatten'
import render from './render/render'

function cedarAmcharts(elementId: string, spec: any, data: any) {
  if ((!elementId || !spec || !data) && (spec.type && spec.type !== 'custom')) {
    const err = new Error('Element Id, specification, and data are all required.')
    throw err
  }

  if (spec.type && spec.type === 'custom') {
    return render(elementId, spec)
  }

  const flattenedData = flatten(data)
  return render(elementId, spec, flattenedData)
}

export default cedarAmcharts
