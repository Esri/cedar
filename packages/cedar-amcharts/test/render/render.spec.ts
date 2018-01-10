import 'amcharts3/amcharts/amcharts'
import 'amcharts3/amcharts/serial'
import { } from 'jest'
import render from '../../src/render/render'
import bar from '../../src/specs/bar'
import pie from '../../src/specs/pie'
import scatter from '../../src/specs/scatter'
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

describe('when filling in a bar spec', () => {
  test('it should get filled in properly', () => {
    const spec = (bar as any)
    spec.dataProvider = barSpec.realData
    const result = render.fillInSpec(spec, barSpec.spec)
    expect(result).toEqual(builtBarSpec)
  })
})

describe('when filling in a scatter spec', () => {
  let result
  beforeAll(() => {
    const spec = (scatter as any)
    /* tslint:disable */
    const definition = {
      "type": "scatter",
      "datasets": [ {
        "url": "https://services1.arcgis.com/bqfNVPUK3HOnCFmA/arcgis/rest/services/Demographics_(Median_Household_Income)/FeatureServer/0"
      }],
      "series": [
        {
          "category": {"field": "TotalPop2015", "label": "Population"},
          "value": {"field": "MedianHHIncome2015", "label": "Median Median Household Income"}
        }
      ]
    }
    /* tslint:enable */
    result = render.fillInSpec(spec, definition)
  })
  test('it should set the graph xField field', () => {
    expect(result.graphs[0].xField).toEqual('TotalPop2015')
  })
  test('it should set the graph yField field', () => {
    expect(result.graphs[0].yField).toEqual('MedianHHIncome2015')
  })
  test('should set x axis title', () => {
    const xAxis = result.valueAxes[0]
    expect(xAxis.title).toEqual('Population')
    expect(xAxis.position).toEqual('bottom')
  })
  test('should set y axis title', () => {
    const yAxis = result.valueAxes[1]
    expect(yAxis.title).toEqual('Median Median Household Income')
    expect(yAxis.position).toEqual('left')
  })
})

describe('when filling in a stacked bar spec', () => {
  let result
  beforeAll(() => {
    const spec = (bar as any)
    /* tslint:disable */
    const definition = {
      "type": "bar",
      "datasets": [
        {
          "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
          "name": "Jordan",
          "query": {
            "where": "City='Jordan'",
            "orderByFields": "Number_of_SUM DESC",
            "groupByFieldsForStatistics": "Type",
            "outStatistics": [{
              "statisticType": "sum",
              "onStatisticField": "Number_of",
              "outStatisticFieldName": "Number_of_SUM"
            }]
          },
          "join": "Type"
        },
        {
          "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
          "name": "Dewitt",
          "query": {
            "where": "City='Dewitt'",
            "orderByFields": "Number_of_SUM DESC",
            "groupByFieldsForStatistics": "Type",
            "outStatistics": [{
              "statisticType": "sum",
              "onStatisticField": "Number_of",
              "outStatisticFieldName": "Number_of_SUM"
            }]
          },
          "join": "Type"
        },
        {
          "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
          "name": "Fayetteville",
          "query": {
            "where": "City='Fayetteville'",
            "orderByFields": "Number_of_SUM DESC",
            "groupByFieldsForStatistics": "Type",
            "outStatistics": [{
              "statisticType": "sum",
              "onStatisticField": "Number_of",
              "outStatisticFieldName": "Number_of_SUM"
            }]
          },
          "join": "Type"
        }
      ],
      "series": [
        {
          "category": {"field": "Type", "label": "Type"},
          "value": { "field": "Number_of_SUM", "label": "Jordan Students"},
          "source": "Jordan",
          "stack": true
        },
        {
          "category": {"field": "Type", "label": "Type"},
          "value": { "field": "Number_of_SUM", "label": "Dewitt Students"},
          "source": "Dewitt",
          "stack": true
        },
        {
          "category": {"field": "Type", "label": "Type"},
          "value": { "field": "Number_of_SUM", "label": "Fayetteville Students"},
          "source": "Fayetteville",
          "stack": true
        }
      ],
      "legend": {
        "enable": false
      },
    }
    /* tslint:enable */
    result = render.fillInSpec(spec, definition)
  })
  test('it should set category field', () => {
    expect(result.categoryField).toEqual('categoryField')
  })
  test('it should set graph stack and value field properties', () => {
    expect(result.graphs.length).toEqual(3)
    result.graphs.forEach((graph, i) => {
      expect(graph.newStack).toBe(false)
      expect(graph.valueField).toEqual(`Number_of_SUM_${i}`)
    })
  })
  test('it should disable legend if passed in by definition', () => {
    expect(result.legend.enabled).toBe(false)
  })
})

describe('when filling in a pie spec', () => {
  let result
  beforeAll(() => {
    const spec = (pie as any)
    /* tslint:disable */
    const definition = {
      "type": "pie",
      "datasets": [
        {
          "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
          "query": {
            "orderByFields": "Number_of_SUM DESC",
            "groupByFieldsForStatistics": "Type",
            "outStatistics": [
              {
                "statisticType": "sum",
                "onStatisticField": "Number_of",
                "outStatisticFieldName": "Number_of_SUM"
              }
            ]
          }
        }
      ],
      "series": [
        {
          "category": {"field": "Type", "label": "Type"},
          "value": {
            "field": "Number_of_SUM",
            "label": "Number of Students"
          }
        }
      ]
    }
    /* tslint:enable */
    result = render.fillInSpec(spec, definition)
  })
  test('it should set title field', () => {
    expect(result.titleField).toEqual('Type')
  })
  test('it should set title field', () => {
    expect(result.valueField).toEqual('Number_of_SUM')
  })
})

describe('when passed an interim (v0.9.x) bar definition', () => {
  let result
  beforeAll(() => {
    const spec = (bar as any)
    /* tslint:disable */
    const definition = {
      "type": "bar", "datasets": [{
        "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
        "query": {
          "groupByFieldsForStatistics": "Type", "orderByFields":
            "Number_of_SUM DESC", "outStatistics": [{
              "statisticType": "sum",
              "onStatisticField": "Number_of", "outStatisticFieldName": "Number_of_SUM"
            }]
        }
      }], "series": [{
        "category": { "field": "Type", "label": "Facility Use" },
        "value": { "field": "Number_of_SUM", "label": "Total Students" }
      }]
    }
    /* tslint:enable */
    result = render.fillInSpec(spec, definition)
  })
  test('should use series category field ', () => {
    expect(result.categoryField).toEqual('Type')
  })
  test('should disable legend', () => {
    expect(result.legend.enabled).toEqual(false)
  })
  test('should set x axis', () => {
    expect(result.categoryAxis.title).toEqual('Facility Use')
  })
  test('should set y axis', () => {
    const yAxis = result.valueAxes[0]
    expect(yAxis.title).toEqual('Total Students')
    expect(yAxis.position).toEqual('left')
  })
})

describe('when passed an interim (v0.9.x) scatter definition', () => {
  let result
  beforeAll(() => {
    const spec = (scatter as any)
    /* tslint:disable */
    const definition = {
      "type":"scatter",
      "datasets": [
        {
          "url":"https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0"
        }
      ],
      "series": [
        {
          "category": { "field": "Number_of", "label": "Student Enrollment (2008)" },
          "value": { "field":"F_of_teach", "label": "Fraction of Teachers" },
          "color": { "field":"Type", "label":"Facility Type" }
        }
      ]
    }
    /* tslint:enable */
    result = render.fillInSpec(spec, definition)
  })
  test('should use series category field ', () => {
    expect(result.categoryField).toEqual('Number_of')
  })
  test('should disable legend', () => {
    expect(result.legend.enabled).toEqual(false)
  })
  test('should set x axis', () => {
    const xAxis = result.valueAxes[0]
    expect(xAxis.position).toEqual('bottom')
    expect(xAxis.title).toEqual('Student Enrollment (2008)')
  })
  test('should set y axis', () => {
    const yAxis = result.valueAxes[1]
    expect(yAxis.position).toEqual('left')
    expect(yAxis.title).toEqual('Fraction of Teachers')
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
          category: { field: 'Type', label: 'Type' },
          value: { field: 'Number_of_SUM', label: 'Number of Students' }
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
