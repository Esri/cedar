import 'amcharts3/amcharts/amcharts'
import 'amcharts3/amcharts/serial'
import {} from 'jest'
import render from '../../src/render/render'
import bar from '../../src/specs/bar'
import timeline from '../../src/specs/timeline'
import barSpec from '../data/barSpec'
import builtBarSpec from '../data/builtBarSpec'

describe('Spec gets fetched properly', () => {
  test('fetch spec properly gets spec...', () => {
    const grabbedSpec = render.fetchSpec('bar')
    expect(grabbedSpec).toEqual(bar)
  })
  test('time is properly converted to line', () => {
    const convertedSpec = render.fetchSpec('time')
    expect(convertedSpec).toEqual(timeline)
  })
})

describe('Spec gets filled in properly', () => {
  test('A simple spec gets filled in properly', () => {
    const spec = (bar as any)
    spec.dataProvider = barSpec.realData
    const result = render.fillInSpec(spec, barSpec.spec)
    expect(result.theme).toBe('calcite')
    expect(result).toEqual(builtBarSpec)
  })
})

// NOTE: renderChart calls dependencies like amcharts and deepmerge
// this suite used to run and presumeably actually rendered a chart somewhere
// however, after introducing deepmerge, in order to run this in jest
// I had to modify the deepmerge import statement to:
// import * as deepmerge from 'deepmerge' - maybe due to ts-jest?
// it _did_ run and pass once I did that, but that broke the rollup build
// so skipping this suite until we can...
// TODO: ...figure out how to stub deepmerge/amcharts dependencies
xdescribe('Rnder properly renders charts...', () => {
  test('Bar chart', () => {
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
