---
title: Chart Specs
layout: documentation.hbs
---

# Specifications

Charts are defined by JSON documents (`specification`) which are then linked to a data source. The specification used in Cedar are an extension of the [Vega](https://github.com/trifacta/vega/wiki) visualization grammar, and in most respects are identical. Cedar extends this with adds an array of `inputs` that developers use for `dataset.mappings` or so that user interfaces can be built dynamically.


## Format

```json
{
  "inputs": [ {"name": "<string>", "type": ["<string>"], "reuqired": <boolean>} ],
  "template": {
    "height": <integer (pixels)>,
    "width": <integer (pixels)>,
    "padding": {"bottom": <integer (pixels)>, "left": <integer (pixels)>, "right": <integer (pixels)>, "top": <integer (pixels)> },
    "data":  [ ],
    "axes":  [ ],
    "scales": [ ],
    "marks": [ ]
  }
}
```

### Example Spec for a bar chart


````json
{
  "inputs": [
    {"name": "count", "type": ["numeric","string"], "required": true},
    {"name": "group", "type": ["string"], "required": false}
  ],
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

```