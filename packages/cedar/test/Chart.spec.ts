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
  test('getDefinition should return undefined', () => {
    expect(chart.getDefinition()).toBeUndefined()
  })
  test('getData should return undefined', () => {
    expect(chart.getData()).toBeUndefined()
  })
  test('getData should return undefined', () => {
    expect(chart.getData()).toBeUndefined()
  })
  test('setDefinition should set the definition', () => {
    expect(chart.setDefinition(barDefinition).getDefinition()).toEqual(barDefinition)
  })
  test('setDatasets should set the definition.dataset', () => {
    expect(chart.setDatasets(barDefinition.datasets).getDatasets()).toEqual(barDefinition.datasets)
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
    expect(chart.updateData(queryDataResponse).getData()).toEqual(expectedChartData.barSingleDataset)
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
  test('getDefinition should return definition', () => {
    expect(chart.getDefinition()).toEqual(definition)
  })
  test('getDatasets should equal definition.datasets', () => {
    expect(chart.getDatasets()).toEqual(definition.datasets)
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
