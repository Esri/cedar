/* tslint:disable quotemark object-literal-key-quotes */
export const bar = {
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
    },
    graphs: [{
      balloonText: `[[categoryField]]: <b>[[Number_of_SUM]]</b>`
    }]
  }
}

export const line = {
  "type": "line",
  "datasets": [
    {
      "url": "https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/DC_Crashes/FeatureServer/0",
      "query": {
        "where": "REPORTDATE > '2007-01-01' AND REPORTDATE < '2018-01-01'",
        "groupByFieldsForStatistics": "EXTRACT(YEAR from REPORTDATE)",
        "outStatistics": [
          {
            "statisticType": "sum",
            "onStatisticField": "MINORINJURIES",
            "outStatisticFieldName": "MINORINJURIES_SUM"
          }
        ],
        "orderByFields": "EXTRACT(YEAR from REPORTDATE) ASC",
        "sqlFormat": "standard"
      }
    }
  ],
  "series": [
    {
      "category": {"field": "EXPR_1", "label": "Year"},
      "value": {
        "field": "MINORINJURIES_SUM",
        "label": "Minor Injuries"
      },
      "group": true
    }
  ]
}

export const pie = {
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
      "category": { "field": "Type", "label": "Type" },
      "value": {
        "field": "Number_of_SUM",
        "label": "Number of Students"
      }
    }
  ]
}

export const pieMissingLabels = {
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
      "category": { "field": "Type" },
      "value": {
        "field": "Number_of_SUM"
      }
    }
  ]
}

export const barJoined = {
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
      "category": { "field": "Type", "label": "Type" },
      "value": { "field": "Number_of_SUM", "label": "Jordan Students" },
      "source": "Jordan",
      "stack": true
    },
    {
      "category": { "field": "Type", "label": "Type" },
      "value": { "field": "Number_of_SUM", "label": "Dewitt Students" },
      "source": "Dewitt",
      "stack": true
    },
    {
      "category": { "field": "Type", "label": "Type" },
      "value": { "field": "Number_of_SUM", "label": "Fayetteville Students" },
      "source": "Fayetteville",
      "stack": true
    }
  ],
  "legend": {
    "visible": false
  },
}

export const scatter = {
  "type": "scatter",
  "datasets": [{
    "url": "https://services1.arcgis.com/bqfNVPUK3HOnCFmA/arcgis/rest/services/Demographics_(Median_Household_Income)/FeatureServer/0"
  }],
  "series": [
    {
      "category": { "field": "TotalPop2015", "label": "Population" },
      "value": { "field": "MedianHHIncome2015", "label": "Median Median Household Income" }
    }
  ]
}

export const scatterInterim = {
  "type": "scatter",
  "datasets": [
    {
      "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0"
    }
  ],
  "series": [
    {
      "category": { "field": "Number_of", "label": "Student Enrollment (2008)" },
      "value": { "field": "F_of_teach", "label": "Fraction of Teachers" },
      "color": { "field": "Type", "label": "Facility Type" }
    }
  ]
}

// TODO: how is this any different that v1.x bar?
export const barInterim = {
  "type": "bar",
  "datasets": [{
    "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
    "query": {
      "groupByFieldsForStatistics": "Type",
      "orderByFields": "Number_of_SUM DESC",
      "outStatistics": [{
          "statisticType": "sum",
          "onStatisticField": "Number_of", "outStatisticFieldName": "Number_of_SUM"
        }]
    }
  }],
  "series": [{
    "category": { "field": "Type", "label": "Facility Use" },
    "value": { "field": "Number_of_SUM", "label": "Total Students" }
  }]
}

export const specification = {
  "specification": {
    "type": "serial",
    "categoryField": "country",
    "graphs": [{
      "valueField": "visits",
      "type": "column"
    }]
  }
}

export const custom = {
  "type": "custom",
  "specification": {
    "type": "serial",
    "dataProvider": [],
    "categoryField": "country",
    "graphs": [{
      "valueField": "visits",
      "type": "column"
    }]
  }
}
