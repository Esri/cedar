# Cedar

Cedar is a library for crafting, sharing and data visualizations powered by ArcGIS Services. Built with D3 and the Vega graphics grammar, Cedar extends them with bindings for making templated chart graphics that can be re-used with different datasets.

At the highest level, Cedar provides a simple chart API. Beyond that it is possible to create new and unique chart types that can be loaded and customized through interactions and styling depending on your needs.

**Currently Esri Cedar is in development and should be thought of as a beta or preview.**

## Components of a Cedar Chart

Cedar charts are defined by the following ingredients:

- a `Specification` is a JSON document which includes,
 - `inputs` that declare the variables of the chart such as category or value to be summarized
 - `template` is a declarative syntax for chart design using the [Vega](http://trifacta.github.io/vega/) visualization grammar.
- a `dataset`
 - either `url` link to the ArcGIS Feature Layer;
 - ...or `values` can be an array of inline features
 - `mappings` bind the Feature Layer attributes to the `Specification inputs`
- and `overrides` are specific modifications to the `Specification template`

## Types of Charts

While Cedar provides a set of commonly used chart types including `Bar`, `Line`, `Scatterplot`, and `Pyramid` through use of the Vega grammar it is possible for developers to create unique and custom charts that can be used by other developers with new data sources.

When starting with Cedar, we suggest that you begin by exploring the simple charts using your own data services. As you experiment with the interactions with Maps and more complex interaction you can also customize these charts with new capabilities such as legends, size scaling or labeling. Finally, you can fork and create completely custom chart templates that you then provide for other developers to use through Cedar.

## Example

```json
  var barChart = new Cedar({"specification": "bar.json"});

  var schools = {
    "url": "http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
    "mappings":{
      "group": { "field": "ZIP_CODE" },
      "count": { "field": "TOTAL_STUD" }
    }
  };

  barChart.dataset = schools;

  barChart.show({
    "elementId": "#bar"
  });
```

and it is simple to add more charts re-using the same `dataset` definition:


```json
  var pieChart = new Cedar({"specification": "pie.json", "dataset": schools});

  pieChart.show({
    "elementId": "#pie"
  });
```


## Demos

Here is a [simple user interface](http://dbouwman.github.com/cypress) and [a few demos](http://esridc.github.io/cedar/) showing the basic concepts of Cedar.

### Development Instructions

Make sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. `cd` into the `cedar` folder
1. Install the dependencies with `npm install`
1. Install additional dependencies with `bower install` (if you encounter an error connecting to github take a look at [this thread](https://github.com/angular/angular-phonecat/issues/141) for a possible fix).
1. Run `grunt docs` from the command line. This will start the web server locally at [http://localhost:8081](http://localhost:8081) and start watching the source files and running linting and testing commands.
1. Push your changes using `grunt docs:deploy` which pushes to your `origin/gh-pages`
1. Create a [pull request](https://help.github.com/articles/creating-a-pull-request) to `esridc/cedar/master`

### Dependencies

* [D3](http://d3js.org/) version 3 or higher is required but the latest version is recommended.
* [Vega](http://trifacta.github.io/vega/)

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
