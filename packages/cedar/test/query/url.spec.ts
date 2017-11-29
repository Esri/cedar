import {} from 'jest'
import { createQueryParams, getQueryUrl } from '../../src/query/url'

describe('getQueryUrl', () => {
  let dataset;
  beforeEach(() => {
    dataset = {
      url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0'
    }
  })
  test('it should append query', () => {
    expect(getQueryUrl(dataset)).toEqual('https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0/query?')
  })
  test('it should append query and token', () => {
    dataset.token = 'notarealtoken';
    expect(getQueryUrl(dataset)).toEqual('https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0/query?token=notarealtoken')
  })
})

describe('createQueryParams', () => {
  test('should return default query params when no query is passed', () => {
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
    expect(createQueryParams()).toEqual(defQuery)
  })

  test('should merge defaults into dataset query params and serialize outStatistics', () => {
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
    const result = {
      where:  '1=1',
      returnGeometry:  false,
      returnDistinctValues:  false,
      returnIdsOnly:  false,
      returnCountOnly:  false,
      outFields:  '*',
      sqlFormat:  'standard',
      f:  'json',
      groupByFieldsForStatistics: 'Type',
      orderByFields: 'Number_of_SUM DESC',
      outStatistics: '[{\"statisticType\":\"sum\",\"onStatisticField\":\"Number_of\",\"outStatisticFieldName\":\"Number_of_SUM\"}]'
    }
    expect(createQueryParams(dataset.query)).toEqual(result)
  })
})
