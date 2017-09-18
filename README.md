# Cedar

[![Build Status](https://travis-ci.org/Esri/cedar.svg?branch=master)](https://travis-ci.org/Esri/cedar)

Cedar is a library for crafting, sharing and data visualizations powered by ArcGIS Services.

At the highest level, Cedar provides a simple chart API. Beyond that it is possible to create new and unique chart types that can be loaded and customized through interactions and styling depending on your needs.

**Currently Esri Cedar is in development and should be thought of as a beta or preview.**

## Types of Charts

While Cedar provides a set of commonly used chart types including `bar`, `line`, `scatterplot`, and `pie`, it is possible for developers to create unique and custom charts that can be used by other developers with new data sources.

When starting with Cedar, we suggest that you begin by exploring the simple charts using your own data services. As you experiment with the interactions with Maps and more complex interaction you can also customize these charts with new capabilities such as legends, size scaling or labeling. Finally, you can fork and create completely custom chart templates that you then provide for other developers to use through Cedar.

## Getting Started

### Installing Cedar

You can install Cedar and it's dependencies from npm:
```bash
yarn add arcgis-cedar
```

Alternatively, you can get Cedar from the [unpkg.com](https://unpkg.com/) CDN as shown below.

### Loading Cedar

TODO: update for amCharts

You can load Cedar and its dependencies by including script tags that point to the CDN or your locally installed versions of these libraries. This will make the `Cedar` global available to your application.

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vega/2.6.1/vega.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/arcgis-cedar@0.9.1/dist/cedar.min.js"></script>
<script>
  var chart = new Cedar({"type": "bar"});
  ...
</script>
```

If you're using Cedar with the [ArcGIS API for JavaScript](developers.arcgis.com/javascript/), you can declare packages for Cedar and its dependencies so that they can be loaded by Dojo's AMD loader:

```html
<link rel="stylesheet" href="https://js.arcgis.com/3.19/esri/css/esri.css">
<script>
  window.dojoConfig = {
    async: true,
    packages: [
      {
        name: 'd3',
        location: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6',
        main: 'd3.min'
      }, {
        name: 'vega',
        location: 'https://cdnjs.cloudflare.com/ajax/libs/vega/2.6.1',
        main: 'vega.min'
      }, {
        name: 'cedar',
        location: 'https://unpkg.com/arcgis-cedar@0.7.0/dist',
        main: 'cedar.min'
      }
    ]
  };
</script>
<script src="https://js.arcgis.com/3.19/"></script>
<script>
  require('cedar', function(Cedar) {
    var chart = new Cedar({"type": "bar"});
    ...
  });
</script>
```

If you're using the Dojo build tool, you may also need to install and configure a package for the vega dependency [topojson](https://github.com/topojson/topojson).

### Using Cedar

Once Cedar is loaded you can create and show the chart at a designated element as follows:

```js
  //create a cedar chart using the known 'bar' type
  // this is the same as passing {"specification": "path/to/cedar/charts/bar.json"}
  var chart = new Cedar({"type": "bar"});

  //create the dataset w/ mappings
  var dataset = {
    "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
    "query": {
      "groupByFieldsForStatistics": "ZIP_CODE",
      "outStatistics": [{
        "statisticType": "sum",
        "onStatisticField": "TOTAL_STUD",
        "outStatisticFieldName": "TOTAL_STUD_SUM"
      }]
    },
    "mappings":{
      "sort": "TOTAL_STUD_SUM DESC",
      "x": {"field":"ZIP_CODE","label":"ZIP Code"},
      "y": {"field":"TOTAL_STUD_SUM","label":"Total Students"}
    }
  };

  //assign to the chart
  chart.dataset = dataset;

  //show the chart
  chart.show({
    elementId: "#chart"
  });
```

See the [tutorial](http://esri.github.io/cedar/tutorial) to learn more.

## Demos

Here is are [an extensive set of demos](http://esri.github.io/cedar/examples) showing the concepts of Cedar.

## Components of a Cedar Chart

Cedar charts are defined by the following ingredients:

TODO: update to current API

- a `Specification` is a JSON document which includes,
 - `inputs` that declare the variables of the chart such as category or value to be summarized
 - `template` is a declarative syntax for chart design using the [Vega](http://trifacta.github.io/vega/) visualization grammar.
- a `dataset`
 - either `url` link to the ArcGIS Feature Layer;
 - ...or `values` can be an array of inline features
 - `mappings` bind the Feature Layer attributes to the `Specification inputs`
- and `overrides` are specific modifications to the `Specification template`

See the [API documentation](http://esri.github.io/cedar/api) for further details.

### Development Instructions

1. Fork this repository and clone 'cedar' locally
1. `cd` into the `cedar` folder
1. Install the dependencies with `yarn && lerna bootstrap`
1. TODO: how to run docs site locally? for now cd into utils package and run `yarn test`
1. Create a [pull request](https://help.github.com/articles/creating-a-pull-request)


### Tests

`lerna run test`

### Dependencies

TODO: amCharts

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, Cedar is maintained under the Semantic Versioning guidelines and will adhere to these rules whenever possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility **bumps the major** while resetting minor and patch
* New additions without breaking backward compatibility **bumps the minor** while resetting the patch
* Bug fixes and misc changes **bumps only the patch**

For more information on SemVer, please visit <http://semver.org/>.


### Licensing
Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.

[](Esri Tags: Visualization)
[](Esri Language: JavaScript)