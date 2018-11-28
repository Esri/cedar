/* tslint:disable quotemark object-literal-key-quotes */
export const bar = {
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
      },
      "domains": {
        "sheltstat": {
          "type": "codedValue",
          "name": "ShelterCode",
          "description": "Shelter Codes",
          "codedValues": [
            {
              "name": "Open",
              "code": 1
            },
            {
              "name": "Closed",
              "code": 2
            },
            {
              "name": "Full",
              "code": 3
            }
          ]
        }
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
  },
  "legend": {
    "visible": true,
    "position": "right"
  },
  "style": {
    "pie": {
      "expand": 0,
      "innerRadius": "50%"
    },
    "padding": {
      "top": 10,
      "bottom": 10,
      "left": 10,
      "right": 10
    }
  }
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
