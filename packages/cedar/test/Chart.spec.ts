import {} from 'jest'
import Chart from '../src/Chart'
import * as definitions from './data/definitions'

describe('new Chart w/o definition', () => {
  const barDefinition = definitions.bar
  let chart
  beforeEach(() => {
    chart = new Chart('chart')
  })
  test('definition should return undefined', () => {
    expect(chart.definition()).toBeUndefined()
  })
  test('data should return undefined', () => {
    expect(chart.data()).toBeUndefined()
  })
  test('data should return undefined', () => {
    expect(chart.data()).toBeUndefined()
  })
  test('definition should set the definition', () => {
    expect(chart.definition(barDefinition).definition()).toEqual(barDefinition)
  })
  test('datasets should set the definition.dataset', () => {
    expect(chart.datasets(barDefinition.datasets).datasets()).toEqual(barDefinition.datasets)
  })
  test('series should set the definition.series', () => {
    expect(chart.series(barDefinition.series).series()).toEqual(barDefinition.series)
  })
  test('type should set the definition.type', () => {
    expect(chart.type(barDefinition.type).type()).toEqual(barDefinition.type)
  })
  test('overrides should set the definition.overrides', () => {
    expect(chart.overrides(barDefinition.overrides).overrides()).toEqual(barDefinition.overrides)
  })
  test('legend should set the definition.legend', () => {
    expect(chart.legend(barDefinition.legend).legend()).toEqual(barDefinition.legend)
  })
})

describe('when updating data', () => {
  let chart
  describe('when definition has not been set', () => {
    beforeEach(() => {
      chart = new Chart('chart')
    })
    test('it should set _data to undefined', () => {
      expect(chart.updateData().data()).toBeUndefined()
    })
  })
})

describe('new Chart w/ definition', () => {
  const definition = definitions.barJoined
  let chart
  beforeAll(() => {
    chart = new Chart('chart', definition)
  })
  test('definition should return definition', () => {
    expect(chart.definition()).toEqual(definition)
  })
  test('datasets should equal definition.datasets', () => {
    expect(chart.datasets()).toEqual(definition.datasets)
  })
  test('series should equal definition.series', () => {
    expect(chart.series()).toEqual(definition.series)
  })
  test('type should equal definition.type', () => {
    expect(chart.type()).toEqual(definition.type)
  })
  test('specification should equal definition.specification', () => {
    // which in this case is undefined
    // TODO: add a test where we set the specification
    expect(chart.specification()).toBeUndefined()
  })
  test('should return dataset by name', () => {
    expect(chart.dataset('Dewitt')).toEqual(definition.datasets[1])
  })
})
