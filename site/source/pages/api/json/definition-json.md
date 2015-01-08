---
title: Chart Definition Json
layout: documentation.hbs
---

# Definition Json

A definition object is the combintion of a <a href="{{assets}}api/json/dataset-json.html">dataset</a> and a <a href="{{assets}}api/json/specification-json.html">specification</a> into a single object. This streamlines the process of hydrating a chart, as the complete definition can be stored in a file, database, or other location, and the url passed into the cedar constructor. 

This is also the internal structure used by Cedar.

## Specification Format

```json
{
  "specifiction": {...specification object...},
  "dataset":{ ... dataset object... }
}
```
