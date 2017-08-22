import {} from 'jest'
import url from '../../src/query/url'

describe('defaultQuery should match a basic default query', () => {
  test('default query is...', () => {
    const defQuery = {
      where:  '1=1',
      returnGeometry:  false,
      returnDistinctValues:  false,
      returnIdsOnly:  false,
      returnCountOnly:  false,
      outFields:  '*',
      sqlFormat:  'standard',
      f:  'json'
    }
    const q = url.defaultQuery()
    expect(q).toEqual(defQuery)
  })
})

describe('createFeatureServiceRequest creates a proper url string', () => {
  test('A basic url is created', () => {
    const dataset = {
      url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0'
    }
    const result = 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&sqlFormat=standard&f=json'
    expect(url.createFeatureServiceRequest(dataset)).toEqual(result)
  })

  test('A query is properly constructed', () => {
    const dataset = {
      url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0',
      query: {
        groupByFieldsForStatistics: 'Type',
        orderByFields: 'Number_of_SUM DESC',
        outStatistics: [{
          statisticType: 'sum',
          onStatisticField: 'Number_of',
          outStatisticFieldName: 'Number_of_SUM'
        }]
      }
    }
    const result = 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0/query?where=1%3D1&returnGeometry=false&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&outFields=*&sqlFormat=standard&f=json&groupByFieldsForStatistics=Type&orderByFields=Number_of_SUM%20DESC&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Number_of%22%2C%22outStatisticFieldName%22%3A%22Number_of_SUM%22%7D%5D'
    expect(url.createFeatureServiceRequest(dataset)).toEqual(result)
  })
})
