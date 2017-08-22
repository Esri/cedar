import {} from 'jest'
import helpers from '../src/helpers/helpers'
import * as chartUtils from '../src/index'

describe('Ensure that chartUtils has all relevant props', () => {
  test('chartUtils has helpers', () => {
    expect(chartUtils).toHaveProperty('entries')
    expect(chartUtils).toHaveProperty('deepMerge')
    expect(chartUtils).toHaveProperty('helpers')
    expect(chartUtils.helpers).toEqual(helpers)
  })
})
