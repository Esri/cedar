import {} from 'jest'
import specs from '../../src/specs/specs'

test('Specs are all present', () => {
  expect(specs).toHaveProperty('bar')
  expect(specs).toHaveProperty('area')
  expect(specs).toHaveProperty('line')
  expect(specs).toHaveProperty('pie')
  expect(specs).toHaveProperty('radar')
  expect(specs).toHaveProperty('scatter')
  expect(specs).toHaveProperty('timeline')
})
