# @esri/cedar

[![Build Status](https://travis-ci.org/Esri/cedar.svg?branch=master)](https://travis-ci.org/Esri/cedar)

Cedar is a library for crafting and sharing data visualizations powered by ArcGIS Services.

> You are looking at the documentation for cedar v1.x, which is currently in alpha. You can also view the [v0.x documentation](../../README.md).

[View live examples of how to use cedar](http://cedar-v1.surge.sh/)

<!--
At the highest level, Cedar provides a simple chart API. Beyond that it is possible to create new and unique chart types that can be loaded and customized through interactions and styling depending on your needs.
-->

**Currently Esri Cedar is in development and should be thought of as a beta or preview.**

## Types of Charts

Cedar currently provides a set of commonly used chart types including `bar`, `line`, `area`, and `pie`, `scatter`, and `bubble`. In the future it will be possible for developers to create unique and custom charts that can be used by other developers with new data sources.
<!--
When starting with Cedar, we suggest that you begin by exploring the simple charts using your own data services. As you experiment with the interactions with Maps and more complex interaction you can also customize these charts with new capabilities such as legends, size scaling or labeling. Finally, you can fork and create completely custom chart templates that you then provide for other developers to use through Cedar.
-->

## Getting Started

### Installing Cedar

You can install cedar and it's [dependencies](#dependencies) from npm:
```bash
npm install @esri/cedar
```

Alternatively, you can get cedar from the [unpkg.com](https://unpkg.com/) CDN as shown below.

### Loading Cedar

You can load Cedar and its dependencies by including script tags that point to the CDN or your locally installed versions of these libraries. This will make the `cedar` global available to your application.

```html
<!-- load the amCharts base library -->
<script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
<!-- in this case, we only need bar charts, so we'll load the appropriate amCharts script -->
<script src="https://www.amcharts.com/lib/3/serial.js"></script>
<!-- optionally load an amcharts theme -->
<script src="https://www.amcharts.com/lib/3/themes/light.js"></script>
<!-- load cedar -->
<script src="https://unpkg.com/@esri/cedar/dist/umd/cedar.js"></script>
<script>
  var chart = new cedar.Chart({"type":"bar"});
</script>
```

If you need to use other chart types, or want to use amCharts plugins, load the appropriate amCharts scripts before loading cedar:

```html
<!-- for pie charts -->
<script src="https://www.amcharts.com/lib/3/pie.js"></script>
<!-- for scatter and bubble charts -->
<script src="https://www.amcharts.com/lib/3/xy.js"></script>
<!-- for radar charts -->
<script src="https://www.amcharts.com/lib/3/radar.js"></script>
<!-- optioinally load the amcharts plugin to export the chart as and image or table -->
<script src="https://www.amcharts.com/lib/3/plugins/export/export.min.js"></script>
<link rel="stylesheet" href="https://www.amcharts.com/lib/3/plugins/export/export.css" type="text/css" media="all" />
```
<!-- TODO: JSAPI example -->
<!--
If you're using cedar with the [ArcGIS API for JavaScript](developers.arcgis.com/javascript/), you can declare packages for Cedar and its dependencies so that they can be loaded by Dojo's AMD loader:

```html
<link rel="stylesheet" href="https://js.arcgis.com/3.19/esri/css/esri.css">
<script>
  window.dojoConfig = {
    async: true,
    packages: [
      {
        name: 'amCharts',
        location: 'https://www.amcharts.com/lib/3',
        main: 'amcharts'
      }, {
        name: 'cedar',
        location: 'https://unpkg.com/@esri/cedar/dist/umd/',
        main: 'cedar'
      }
    ]
  };
</script>
<script src="https://js.arcgis.com/3.22/"></script>
<script>
  require(['amCharts', 'cedar', 'amCharts/serial'], function(AmCharts, cedar) {
    var chart = new cedar.Chart({"type": "bar"});
    ...
  });
</script>
```
-->

### Using Cedar

Once cedar is loaded you can create and show the chart at a designated element as follows:

```js
  //create a cedar chart using the known 'bar' type
  var chart = new cedar.Chart({"type": "bar"});

  // connect to the data
  var datasets = [{
    "url": "https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0",
    "id": 1,
    "query": {
      "orderByFields": "Number_of_SUM DESC",
      "groupByFieldsForStatistics": "Type",
      "outStatistics": [{
        "statisticType": "sum",
        "onStatisticField": "Number_of",
        "outStatisticFieldName": "Number_of_SUM"
      }]
    }
  }];

  // designate a one or more series to show the data on the chart
  var series = [{
    "category": {"field": "Type", "label": "Type"},
    "value": {"field": "Number_of_SUM", "label": "Number of Students"},
    "source": 1
  }];

  // optinally override any of the cart type's default styles
  var overrides = {
    "categoryAxis": {
      "labelRotation": -45
    }
  }

  // render the chart
  var elementId = 'chart';
  chart.show(elementId);
```

<!-- See the [tutorial](http://esri.github.io/cedar/tutorial) to learn more. -->

<!-- TODO: demos -->
<!--
## Demos

Here is are [an extensive set of demos](http://esri.github.io/cedar/examples) showing the concepts of Cedar.
-->

## Components of a Cedar Chart

Cedar charts are defined by the following ingredients:

- an array of `datasets`, each has, either:
 - a `url` to an ArcGIS Feature Layer along with optional `query` parameters;
 - ...or `data` can be an array of inline features
- an array of `series` that bind the Feature Layer attributes to bars, lines, points, etc on the chart
- and `overrides` are specific modifications to the cart type's default styles

<!-- TODO: API docs -->
<!-- See the [API documentation](http://esri.github.io/cedar/api) for further details. -->

### Development Instructions

This repository is a monoreop managed using [lerna](https://github.com/lerna/lerna)

1. Fork this repository and clone 'cedar' locally
1. `cd` into the `cedar` folder
1. Install the dependencies with `npm install`
1. to run the docs site locally, start a web server at the root folder and visit `/docs`
1. to rebuild the script files used by the docs page whenver the source code is updated, run `npm start`
1. Create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Tests

To run tests one time for all packages, run `npm test` from the monorepo root.

To run tests continually for any package as you update it's soruce code, `cd` into that package and run `npm run:watch` to continually run that package's tests as you update the source code

### Dependencies

Cedar currently uses the [amCharts JavaScripts Charts](https://www.amcharts.com/javascript-charts/) library as it's charting engine. You will need to include this along with cedar in your application.

Cedar supports the [same browsers as ArcGIS Online](https://doc.arcgis.com/en/arcgis-online/reference/browsers.htm), however you may need to include polyfills for [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) and [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), if your application has to support browers that don't support [fetch](https://caniuse.com/#search=fetch) or [Promise](https://caniuse.com/#search=promise) (i.e. IE or older versions of Safari/Android).

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
Copyright 2017 Esri

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
