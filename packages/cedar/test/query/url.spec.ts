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

  test('should merge defaults into query params, convert bbox into geometry, and copy outStatistics', () => {
    const dataset = {
      url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0',
      query: {
        // bbox W,S,E,N
        bbox: '-104,35.6,-94.32,41',
        groupByFieldsForStatistics: 'Type',
        orderByFields: 'Number_of_SUM DESC',
        outStatistics: [{
          statisticType: 'sum',
          onStatisticField: 'Number_of',
          outStatisticFieldName: 'Number_of_SUM'
        }],
        where:  'Type=\'High School\''
      }
    }
    const result = {
      where:  'Type=\'High School\'',
      returnGeometry:  false,
      returnDistinctValues:  false,
      returnIdsOnly:  false,
      returnCountOnly:  false,
      outFields:  '*',
      sqlFormat:  'standard',
      f:  'json',
      groupByFieldsForStatistics: 'Type',
      orderByFields: 'Number_of_SUM DESC',
      outStatistics: JSON.stringify([{
        statisticType: 'sum',
        onStatisticField: 'Number_of',
        outStatisticFieldName: 'Number_of_SUM'
      }]),
      geometry: JSON.stringify({
        xmin: -104,
        ymin: 35.6,
        xmax: -94.32,
        ymax: 41
      }),
      inSR: '4326'
  }
    expect(createQueryParams(dataset.query)).toEqual(result)
  })
})
