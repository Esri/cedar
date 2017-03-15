---
  title: Chart Series Json
  layout: documentation.hbs
---

# Series Json
The series is the means by which the data and the visual elements of a chart are linked together.

## Series format
Series is an array of series objects. This is in preparation for multiseries/multi dataset charts (NOTE: currently multiseries/multidataset is not supported).

```json
[
  {
    "category": {
      "field": "<field name>",
      "label": "<label for chart>"
    },
    "value": {
      "field": "<field name>",
      "label": "<label for chart>"
    }
  }
]
```
