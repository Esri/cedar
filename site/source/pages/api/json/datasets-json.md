---
  title: Chart Datasets Json
  layout: documentation.hbs
---

# Datasets Json
Datasets are the means by which we specify datasets and queries to fetch data that will be charted.

## Datasets Format
Datasets is an array of dataset objects. This is in preparation for multiseries/multi dataset charts (NOTE: currently multiseries/multidataset is not supported).

```json
[
  {
    "url": "<url to geoservices end point>",
    "query": {},
    "data": []
  }
]
```

### url
Url to a feature service or map service layer.
Can also be a url to a static json file, but it should be noted that the `query` property will have no effect in that case.

### query
Query is optional, but it is also a very useful parameter, as it allows the developer to specify additional Geoservices query parameters, such as a where clause, or bounding box.

All properties of the query object will be converted into query parameters in the calls to fetch the data from the service. Thus, most geoservices [query parameters](https://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) are supported.

As a convenience, Cedar will add the correct `geometry` and `spatialRel`  parameters if a bbox is provided. Other geometric relations can be handled by manually configuring the parameters on the query object.

Cedar also handles the necessary aggregation via outStatistics

Example query
```
...
  "query":{
    "where":"ZIP_CODE = 20007 AND YEAR_BUILT > 1900"
  }
...

```


### data

Optional array of data objects in format...

```
[
  {
    "attributes":{
      "field_name":"field_value",
      "field_name":"field_value"
    },
    "geometry":{
      //optional and ignored by cedar
    }
  }
]

```
