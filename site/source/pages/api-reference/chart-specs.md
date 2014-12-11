---
title: Chart Specs
layout: documentation.hbs
---

#Chart Specs

Charts are defined by json documents (specs) which are then linked to a data source. The specs used in Cedar are an extension of the Vega chart spec, and in most respects are identical, cedar simply adds a hash of inputs so that interfaces can adapt dynamically to the spec, and allow a user to link fields of the correct type to the inputs.


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