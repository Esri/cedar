import * as utils from 'cedar-utils'
import flatten from './flatten/flatten'

function cedarAmcharts(elementId: string, spec: any, data: any) {
  if ((!elementId || !spec || !data) && (spec.type && spec.type !== 'custom')) {
    const err = new Error('Element Id, specification, and data are all required.')
    throw err
  }

  if (spec.type && spec.type === 'custom') {
    return render(elementId, spec)
  }

  const flattenedData = flatten(data)
  return draw(elementId, spec, flattenedData)
}

export default cedarAmcharts
