import {} from 'jest'
import query from '../../src/query/query'
import expectedChartData from '../data/chartData'
import response from '../data/featureServiceResponse'

describe('Feature service to array and array to feature service work', () => {
  let attributeArray
  beforeEach(() => {
    attributeArray = expectedChartData.barSingleDataset.map(row => {
      return {
        Number_of_SUM: row.Number_of_SUM,
        Type: row.Type
      }
    })
  })
  test('fsToArr takes in a feature service response and returns an array of attributes', () => {
    const result = query.fsToArr(response)
    expect(result).toEqual(attributeArray)
  })

  test('arrToFs takes an array and returns a FS response', () => {
    const result = query.arrToFs(attributeArray)
    expect(result.features).toEqual(response.features)
  })
})
