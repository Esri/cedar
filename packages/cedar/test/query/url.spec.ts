import {} from 'jest'
import { createQueryParams } from '../../src/query/url'

describe('createQueryParams', () => {
  describe('when no params passed', () => {
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
  })
  describe('when params are passed', () => {
    test('should merge defaults into query params and copy outStatistics', () => {
      const dataset = {
        url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0',
        query: {
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
        }])
      }
      expect(createQueryParams(dataset.query)).toEqual(result)
    })
    test('should merge defaults into query params, convert bbox into geometry', () => {
      const dataset = {
        url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0',
        query: {
          // bbox W,S,E,N
          bbox: '-104,35.6,-94.32,41',
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
    test('should throw w/ both bbox and geom', () => {
      const query = {
        // bbox W,S,E,N
        bbox: '-104,35.6,-94.32,41',
        geometry: {
          xmin: -104,
          ymin: 35.6,
          xmax: -94.32,
          ymax: 41
        }
      }
      expect(() => {
        createQueryParams(query)
      }).toThrow('Dataset.query can not have both a geometry and a bbox specified')
    })
  })
})
