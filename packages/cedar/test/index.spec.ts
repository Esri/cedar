import {} from 'jest'
import cedar from '../src/index'

describe('cedar namespace', () => {
  test('Chart is present', () => {
    expect(cedar.Chart).not.toBeUndefined()
  })
})
