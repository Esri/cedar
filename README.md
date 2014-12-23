# Cedar

Cedar is a library for crafting, sharing and data visualizations powered by ArcGIS Services. Built with D3 and the Vega graphics grammar, Cedar extends them with bindings for making templated chart graphics that can be re-used with different datasets. 

At the highest level, Cedar provides a simple chart API. Beyond that it is possible to create new and unique chart types that can be loaded and customized through interactions and styling depending on your needs.

**Currently Esri Cedar is in development and should be thought of as a beta or preview.**

### Demos
There are is a [simple user interface](http://dbouwman.github.com/cypress] and [a few demos](http://esridc.github.io/cedar/) showing the basic concepts of Cedar.

### Example
Here is a quick example to get you started. Just change the paths to point to the proper libraries and go.

![App](https://raw.github.com/Esri/esri-leaflet/master/esri-leaflet.png)

```html
<h2>DC Schools</h2>
<div id="dc_capacity"></div>
<div id="dc_use"></div>

<h2>Utah Planning</h2>
<div id="bar"></div>
<div id="word"></div>

<script type="text/javascript" src="http://square.github.io/crossfilter/d3.v3.min.js"></script>
<script type="text/javascript" src="http://trifacta.github.io/vega/vega.js"></script>
<script type="text/javascript" src="chart.js"></script>
<script type="text/javascript" src="cedar.js"></script>

<script type="text/javascript">
  // DC
  Cedar.chart({el: "#dc_capacity", style: "scatter", data: "/schools.json", x: "CAPACITY", y: "POPULATION_ENROLLED_2008", color: "FACUSE"})
  Cedar.chart({el: "#dc_use", style: "bar", data: "/schools_use_count.json", count: "POPULATION_ENROLLED_2008", group: "FACUSE"})
  // Utah
  Cedar.chart({el: "#bar", style: "bar", data: "/utah.json", count: "PROJECT_VALUE", group: "PRIMARY_CONCEPT"})
  // Cedar.chart({el: "#word", style: "word", data: "/data.json", value: "PROJECT_VALUE", text: "PRIMARY_CONCEPT"})
    
```


### Development Instructions

Make Sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. `cd` into the `cedar` folder
1. Install the dependencies with `npm install`
1. Install additional dependencies with `bower install`
1. Run `grunt docs` from the command line. This will start the web server locally at [http://localhost:8001](http://localhost:8001) and start watching the source files and running linting and testing commands.
1. Push your changes using `grunt docs:build` which pushes to your `origin/gh-pages`
1. Create a [pull request](https://help.github.com/articles/creating-a-pull-request) to `esridc/cedar/gh-pages`

### Dependencies

* [D3](http://d3js.org/) version 3 or higher is required but the latest version is recommended.

### Versioning
 
For transparency into the release cycle and in striving to maintain backward compatibility, Cedar is maintained under the Semantic Versioning guidelines and will adhere to these rules whenever possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility **bumps the major** while resetting minor and patch
* New additions without breaking backward compatibility **bumps the minor** while resetting the patch
* Bug fixes and misc changes **bumps only the patch**

For more information on SemVer, please visit <http://semver.org/>.

### Issues

Find a bug or want to request a new feature?  Please let us know by submitting an [issue](https://github.com/esridc/cedar/issues).

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet/blob/master/CONTRIBUTING.md).

### Credit

`L.esri.Layers.DynamicMapLayer` originally used code from https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js

### Licensing
Copyright 2014 Esri

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

[](Esri Tags: ArcGIS Web Mapping Leaflet)
[](Esri Language: JavaScript)
