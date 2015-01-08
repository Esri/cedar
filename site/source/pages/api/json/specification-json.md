---
title: Chart Specification Json
layout: documentation.hbs
---

# Chart Specifications

Charts are defined by JSON documents (`specification`) which are then linked to a data source. The specification used in Cedar has two main components: an inputs hash and a template.

## Specification Format

```json
{
  "inputs": [ 
    { 
      "name": "<string>", 
      "type": ["<string>"], 
      "required": <boolean>
    } 
  ],
  "template": {
    "height": <integer (pixels)>,
    "width": <integer (pixels)>,
    "padding": {
      "bottom": <integer (pixels)>, 
      "left": <integer (pixels)>, 
      "right": <integer (pixels)>, 
      "top": <integer (pixels)> 
    },
    "data":  [ ],
    "axes":  [ ],
    "scales": [ ],
    "marks": [ ]
  }
}
```


## Inputs
The inputs array specifies the parameters required by the template, in order to generate a complete vega specification. The `dataset.mappings` hash must contain entries for all the `required:true` inputs.

### Inputs Example
```
{
  "inputs": [
    {"name": "count", "type": ["numeric","string"], "required": true},
    {"name": "group", "type": ["string"], "required": false}
  ]
}
```



## Template
The template is an extension of the [Vega](https://github.com/trifacta/vega/wiki) visualization grammar, and in most respects is identical. The primary differece it that the template has some properties specified as `{tokens}`.

The Cedar library takes the `dataset.mappings` object and uses that to interpolate the tokens in the template, to produce a valid vega specification, which is then used to generate the chart.

### Example Cedar Spec for a bar chart


````json
{
  "inputs": [
    {"name": "count", "type": ["numeric","string"], "required": true},
    {"name": "group", "type": ["string"], "required": false}
  ],
  "template":{
    "axes": [
      {
        "type": "x",
        "scale": "x",
        "title": "X-Axis"
      }
    ],
    "data": [
      {
        "name": "table",
        "url": "{data}",
        "format": {
          "property": "features"
        }
      }
    ],
    "height": 600,
    "marks": [
      {
        "from": {
          "data": "table"
        },
        "properties": {
          "enter": {
            "width": {
              "band": true,
              "offset": -1,
              "scale": "x"
            },
            "x": {
              "field": "data.attributes.{group}",
              "scale": "x"
            },
            "y": {
              "field": "data.attributes.{count}_SUM",
              "scale": "y"
            },
            "y2": {
              "scale": "y",
              "value": 0
            }
          },
          "hover": {
            "fill": {
              "value": "red"
            }
          },
          "update": {
            "fill": {
              "value": "steelblue"
            }
          }
        },
        "type": "rect"
      }
    ],
    "padding": {
      "bottom": 20,
      "left": 80,
      "right": 10,
      "top": 10
    },
    "scales": [
      {
        "domain": {
          "data": "table",
          "field": "data.attributes.{group}"
        },
        "name": "x",
        "range": "width",
        "type": "ordinal"
      },
      {
        "domain": {
          "data": "table",
          "field": "data.attributes.{count}_SUM"
        },
        "name": "y",
        "nice": true,
        "range": "height"
      }
    ],
    "width": 600
  }
}
```