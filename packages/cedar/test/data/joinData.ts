
/* tslint:disable object-literal-key-quotes quotemark */
export const datasets = [
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
]

export const series = [
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
]

export const datasetsData = {
  Jordan: { "objectIdFieldName": "FID", "globalIdFieldName": "", "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 102100, "latestWkid": 3857 }, "fields": [{ "name": "Number_of_SUM", "type": "esriFieldTypeDouble", "alias": "Number_of_SUM", "sqlType": "sqlTypeFloat", "domain": null, "defaultValue": null }, { "name": "Type", "type": "esriFieldTypeString", "alias": "Type", "sqlType": "sqlTypeNVarchar", "length": 254, "domain": null, "defaultValue": null }], "features": [{ "attributes": { "Number_of_SUM": 13, "Type": "High School" } }, { "attributes": { "Number_of_SUM": 6, "Type": "Middle School" } }, { "attributes": { "Number_of_SUM": 1, "Type": "Elementary School" } }] },
  Dewitt: { "objectIdFieldName": "FID", "globalIdFieldName": "", "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 102100, "latestWkid": 3857 }, "fields": [{ "name": "Number_of_SUM", "type": "esriFieldTypeDouble", "alias": "Number_of_SUM", "sqlType": "sqlTypeFloat", "domain": null, "defaultValue": null }, { "name": "Type", "type": "esriFieldTypeString", "alias": "Type", "sqlType": "sqlTypeNVarchar", "length": 254, "domain": null, "defaultValue": null }], "features": [{ "attributes": { "Number_of_SUM": 1, "Type": "Elementary School" } }] },
  Fayetteville: { "objectIdFieldName": "FID", "globalIdFieldName": "", "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 102100, "latestWkid": 3857 }, "fields": [{ "name": "Number_of_SUM", "type": "esriFieldTypeDouble", "alias": "Number_of_SUM", "sqlType": "sqlTypeFloat", "domain": null, "defaultValue": null }, { "name": "Type", "type": "esriFieldTypeString", "alias": "Type", "sqlType": "sqlTypeNVarchar", "length": 254, "domain": null, "defaultValue": null }], "features": [{ "attributes": { "Number_of_SUM": 8, "Type": "High School" } }, { "attributes": { "Number_of_SUM": 1, "Type": "Elementary School" } }, { "attributes": { "Number_of_SUM": 0, "Type": "Middle School" } }] }
}
