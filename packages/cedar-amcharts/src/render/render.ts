import * as utils from 'cedar-utils'
import specs from '../specs/specs'

export function render(elementId: string, config: any, data: any) {
  if (config.type === 'custom') {
    return AmCharts.makeChart(elementId, config.specification)
  }
}
