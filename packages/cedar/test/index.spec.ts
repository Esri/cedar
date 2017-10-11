import {} from 'jest'
import cedar from '../src/index'

describe('Cedar initial test', () => {
  test('Cedar is present', () => {
    const opts = {
      type: 'bar',
      datasets: [
        {
          url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0',
          query: {
            orderByFields: 'Number_of_SUM DESC',
            groupByFieldsForStatistics: 'Type',
            outStatistics: [
              {
                statisticType: 'sum',
                onStatisticField: 'Number_of',
                outStatisticFieldName: 'Number_of_SUM'
              }
            ]
          }
        }
      ],
      series: [
        {
          category: {field: 'Type', label: 'Type'},
          value: {field: 'Number_of_SUM', label: 'Number of Students'}
        }
      ],
      overrides: {
        categoryAxis: {
          labelRotation: -45
        }
      }
    }
    const chart = new cedar.Chart('chart', opts)
  })
})
