---
title: Chart Dataset Json
layout: documentation.hbs
---

# Dataset Json
The dataset is the means of informing Cedar about the data to be charted.

## Dataset Format

```json
{
  "url":"<url to geoservices end-point>",
  "query":{},
  "mappings":{
    "<input.name>": {
      "field":"<field name>",
      "label":"<label for chart>"
    },
  }
}
```


### dataset.url
Url to a feature service or map service layer. 
Can also be a url to a static json file, but it should be noted that the `query` property will have no effect in that case.


### dataset.mappings
The mappings object contains properties that match up to the `specification.inputs` array. For example, for this inputs array
```
...
  "inputs": [
    {"name": "count", "type": ["numeric","string"], "required": true},
    {"name": "group", "type": ["string"], "required": false}
  ]
...
```
The mappings must contain a `count` property specifying the field name and label.
```
...
 "mappings":{
    "count": {"field":"POPULATION_ENROLLED_2008","label":"Enrolment 2008"}
  }
...
```
Since the inputs contain an optional parameter (`group`), the mappings can also contain an entry for that

```
...
 "mappings":{
    "count": {"field":"POPULATION_ENROLLED_2008","label":"Enrolment 2008"},
    "group":{"field":"FACUSE", "label":"School Type"}
  }
...
```

### dataset.query
Query is optional, but it is also a very useful parameter, as it allows the developer to specify additional Geoservices query parameters, such as a where clause, or bounding box.

All properties of the query object will be converted into query parameters in the calls to fetch the data from the service. Thus, most geoservices [query parameters](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) are supported. 

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


### dataset.data
*NOT IMPLEMENTED YET*

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


## Full Example


```
TODO: Add Example
```