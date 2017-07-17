import {} from 'jest'
import helpers from '../src/helpers/helpers'
import * as chartUtils from '../src/index'
import query from '../src/query/query'
import url from '../src/query/url'

describe('Ensure that chartUtils has all relevant props', () => {
  test('chartUtils has helpers', () => {
    expect(chartUtils).toHaveProperty('helpers')
    expect(chartUtils.helpers).toEqual(helpers)
  })
  test('chartUtils has query', () => {
    expect(chartUtils).toHaveProperty('query')
    expect(chartUtils.query).toEqual(query)
  })
  test('chartUtils has url', () => {
    expect(chartUtils).toHaveProperty('url')
    expect(chartUtils.url).toEqual(url)
  })
})
