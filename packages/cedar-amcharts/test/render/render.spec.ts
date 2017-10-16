import 'amcharts3/amcharts/amcharts'
import 'amcharts3/amcharts/serial'
import {} from 'jest'
import render from '../../src/render/render'
import bar from '../../src/specs/bar'
import barSpec from '../data/barSpec'
import builtBarSpec from '../data/builtBarSpec'

describe('Spec gets filled in properly', () => {
  test('fetch spec properly gets spec...', () => {
    const grabbedSpec = render.fetchSpec('bar')
    expect(grabbedSpec).toEqual(bar)
  })

  test('A simple spec gets filled in properly', () => {
    const spec = render.fetchSpec('bar')
    spec.dataProvider = barSpec.realData
    spec.categoryField = 'categoryField'
    const result = render.fillInSpec(spec, barSpec.spec)
    expect(result.theme).toBe('calcite')
    expect(result).toEqual(builtBarSpec)
  })
})

describe('Rnder properly renders charts...', () => {
  test('Bar chart', () => {
    const spec = {
      type: 'bar',
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
      },
      mappings: {
        category: {field: 'Type', label: 'Type'},
        series: [
          {
            field: 'Number_of_SUM',
            label: 'Number of Students'
          }
        ]
      },
      overrides: {
        categoryAxis: {
          labelRotation: -45
        }
      }
    }
    const newSpec = {
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
    const data = [
      {
        categoryField: 'High School',
        Number_of_SUM_0: 13,
        Type_0: 'High School',
        Number_of_SUM_1: 8,
        Type_1: 'High School'
      },
      {
        categoryField: 'Middle School',
        Number_of_SUM_0: 6,
        Type_0: 'Middle School',
        Number_of_SUM_1: 0,
        Type_1: 'Middle School'
      },
      {
        categoryField: 'Elementary School',
        Number_of_SUM_0: 1,
        Type_0: 'Elementary School',
        Number_of_SUM_1: 1,
        Type_1: 'Elementary School',
        Number_of_SUM_2: 1,
        Type_2: 'Elementary School'
      }
    ]
    render.renderChart('blah', newSpec, data)
  })
})
