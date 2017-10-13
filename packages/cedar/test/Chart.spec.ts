import {} from 'jest'
import Chart from '../src/Chart'
import expectedChartData from './data/chartData'
import featureServiceResponse from './data/featureServiceResponse'
/* tslint:disable */
const barDefinition = {
  "type": "bar",
  "datasets": [
    {
      "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
      "name": "Number_of_SUM",
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
      "value": {"field": "Number_of_SUM", "label": "Number of Students"},
      "source": "Number_of_SUM"
    }
  ],
  "overrides": {
    "categoryAxis": {
      "labelRotation": -45
    }
  }
}
/* tslint:enable */

describe('new Chart w/o definition', () => {
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
  test('setSeries should set the definition.series', () => {
    expect(chart.setSeries(barDefinition.series).getSeries()).toEqual(barDefinition.series)
  })
  test('setType should set the definition.type', () => {
    expect(chart.setType(barDefinition.type).getType()).toEqual(barDefinition.type)
  })
  test('setOverrides should set the definition.overrides', () => {
    expect(chart.setOverrides(barDefinition.overrides).getOverrides()).toEqual(barDefinition.overrides)
  })
})

describe('when updating data', () => {
  let chart
  beforeEach(() => {
    chart = new Chart('chart', barDefinition)
  })
  test('it should update _data', () => {
    const queryDataResponse = {
      Number_of_SUM: featureServiceResponse
    }
    expect(chart.updateData(queryDataResponse).data()).toEqual(expectedChartData.barSingleDataset)
  })
})

describe('new Chart w/ definition', () => {
  let chart
  let definition
  beforeAll(() => {
    /* tslint:disable */
    definition = {
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
          }
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
          }
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
          }
        }
      ],
      "series": [
        {
          "category": {"field": "Type", "label": "Type"},
          "group": true,
          "value": { "field": "Number_of_SUM", "label": "Jordan Students"},
          "source": "Jordan"
        },
        {
          "category": {"field": "Type", "label": "Type"},
          "group": true,
          "value": { "field": "Number_of_SUM", "label": "Dewitt Students"},
          "source": "Dewitt"
        },
        {
          "category": {"field": "Type", "label": "Type"},
          "group": true,
          "value": { "field": "Number_of_SUM", "label": "Fayetteville Students"},
          "source": "Fayetteville"
        }
      ]
    }
    /* tslint:enable */
    chart = new Chart('chart', definition)
  })
  test('definition should return definition', () => {
    expect(chart.definition()).toEqual(definition)
  })
  test('datasets should equal definition.datasets', () => {
    expect(chart.datasets()).toEqual(definition.datasets)
  })
  test('getSeries should equal definition.series', () => {
    expect(chart.getSeries()).toEqual(definition.series)
  })
  test('getType should equal definition.type', () => {
    expect(chart.getType()).toEqual(definition.type)
  })
  test('getSpecification should equal definition.specification', () => {
    expect(chart.getSpecification()).toEqual(definition.specification)
  })
})
