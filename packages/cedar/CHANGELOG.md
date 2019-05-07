# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Fixed
- make @esri/arcis-rest-* `peerDependencies` of @esri/cedar
### Changed
- update README and CHANGELOG for v1.0.0 release

## [1.0.0]

### Changed
- Bumped @esri/arcgis-rest-request dependency to 2.0.0 and now depend on @esri/arcgis-rest-feature-layer instead of @esri/arcgis-rest-feature-service

## [1.0.0-rc.1]

### Fixed
- @esri/arcgis-rest-request and @esri/arcgis-rest-feature-service are no longer bundled inside the package.

### Added
- when dataset.domains is provided, Cedar will convert coded value domain codes to names internally.

### Changed
- _everything_ is now exported in the ES6 build of the libary.

## [1.0.0-beta.9]
### Added
- enable passing a custom fetch implementation into queryFeatures()
### Changed
- bump @esri/arcgis-rest-js dependencies to 1.7.1
- update dev dependencies
- use jest mocks to inspect queryFeatures options

## [1.0.0-beta.8]
### Added
- style.colors accepts an array of colors that map to chart colors
### Changed
- Balloon Text for pie, and bar chart families has been updated to a more understandable format

## [1.0.0-beta.7]
### Changed
- bumped arcgis-rest-js packages to 1.2.1 to support on premise (enterprise)

## [1.0.0-beta.6]
### Changed
- Defaults for bar charts with legends now specify legend valueAlign and spacing

## [1.0.0-beta.5]
### Added
- One can now add a `style` property which contains `padding` and `pie` properties to `definition`
### Changed
- popup text for pie charts has a new format

## [1.0.0-beta.4]
### Changed
- treat arcgis libraries as external

## [1.0.0-beta.3]
### Added
- One can now inline data as an array of attributes or array of objects
### Changed
- use @esri/arcgis-rest-feature-service and remove query functions
- updated tests and added mocks for 100% code coverage
- using yarn workspaces for monorepo
- added links for codepens for working with maps, etc to README
### Fixed
- remove extraneous dependency on amcharts in @esri/cedar
- Specifications that are passed in are actually supported
- fixed join logic so that records weren't getting assigned to wrong category
- fixed Using Cedar instructions in the README

## [1.0.0-beta.2]
### Fixed
- fix fatal errors in IE11 [#386](https://github.com/Esri/cedar/issues/386)
### Changed
- add fetch polyfill to docs site if accessed by IE11

## [1.0.0-beta.1]
### Changed
- release script copies root README to packages/cedar before publishi
ng
- docs page doesn't look like it was beat by ugly stick
- arcgis-rest-request is no longer included in Cedar, instead it is npm installed
- legend is now a prop that can be passed in through the definition or off of the chart object directly

## [1.0.0-beta.0]
### Fixed
- add dataset.join instead of assuming 1:1 datasets:series
### Changed
- added CORS support to docs site
- install amcharts from npm instead of git
- only inject categoryField into chart._data when joining
- docs: fix line/area examples; sort by year
- add v0.9 example JSON under docs (for now)

## [1.0.0-alpha.7]
### Changed
- Horizontal bar charts renamed from horizontal to bar-horizontal
- Time and bubble types convert to timeline and scatter and prompt a console.warn
- Grouped type converts to bar
- Multi series bar charts group by default instead of stack
- Single series charts (excluding pie/radar) now have x,y axis titles turned on by default and legend turned off by default
- Timeline charts now look like line charts with parseDates
### Fixed
- don't send multipart form data if not needed
- scatter/bubble tooltips no longer show 'undefined' at the top

## [1.0.0-alpha.6]
### Fixed
- dateTime field parse error resolved by not coercing all values to strings
### Changed
- Font color for axis and legend updated to match old cedar

## [1.0.0-alpha.5]
### Fixed
- '@esri/arcgis-rest-request' is not in the npm registry error
### Changed
- inline code from @esri/arcgis-rest-request instead of depending on private pacakge

## [1.0.0-alpha.4]
### Fixed
- allow overriding properties of graphs
### Changed
- bundling deepmerge instead of defining a deepMerge function

## [1.0.0-alpha.3]
### Changed
- refactored to use arcgis-rest-request for queries (copied code until it is released)
### Fixed
- query bbox to geometry conversion and added tests


## [1.0.0-alpha.2]
### Fixed
- if categoryField is null, amCharts shows [Object object] as label

## [1.0.0-alpha.1]
### Fixed
- Fixed issue with deepMerge where it would iterate over ember specific props

## [1.0.0-alpha]
### BREAKING CHANGES
- use [amCharts](https://www.amcharts.com/javascript-charts/) as the charting library
- support multiple datasets by joining them
- support multi-series charts
- expose a new `cedar` namespace instead of `Cedar()` constructor as global
- chart constructor (instead of `.show()`)establishes relationship to DOM node
- async operations like `.show()` return promises instead of taking callbacks
- remove `.transform()` in favor of using promises to manipulate query responses as needed
- new fluent API for chaining definition property setters and function calls

## [0.9.2]
### Support
- Timeline charts now have x/y axis titles
- Resolved issue with axis label truncation where it would truncate the entire label

## [0.9.1]
### Added
- Chart tooltips added for new json spec charts where tooltip is not specified.

## [0.9.0]
### Changed
- Introduced new public JSON api as the first step towards multiple series

## [0.8.2]
### Support
- getTokenValue now uses a for loop as it was previously erroneously using a for...in loop

## [0.8.1]
### Support
- Tom didn't push the dist folder

## [0.8.0]
### Added
- add transform property to modify query results before rendering
### Support
- better pie chart example w/ SQL query expression
- update dependency urls and add jsfiddle to tutorial page

## [0.7.0] - 2015-11-30
### Changed
- source converted to ES2015 and compiled with rollup/buble
- tooling updated to favor npm scripts instead of grunt
- test pages and specs moved under test folder
- clean up of unused grunt tasks, dependencies, and misc files
- Semistandard for linting

## [0.6.1] - 2016-08-15
### Changed
- Updated dependencies to most recent version of vega to avoid dependencies issues.
- Updated API docs to reflect recent changes.

## [0.6.0] - 2016-08-11
### Added
- Timeout can be added to the Cedar() constructor to set a timeout on fetching data
- maxLabelLength can be set via .show() It will truncate axis labels that exceed a set length
### Changed
- Optional callback drills down into renderSpec to catch errors from Vega

## [0.5.0] - 2016-08-09
### Added
- Optional callback on Cedar.show to catch errors from ago / ags server

## [0.4.4] - 2016-08-09
### Changed
- Errors from AGO / AGS Server will properly throw errors

## [0.4.3] - 2016-08-05
### Changed
- Default query adds `"sqlFormat": "standard"`

### Support
- Docs should only build on merging a PR
- PRs from forks should not break Travis
- Prism 1.5.0 added to include syntax highlighting on docs
- Added example for time aggregation with hosted services
- Fixed specs to accept &sqlFormat=standard
- Added missing peer dependencies as dev dependencies for npm3 users
- use node-sass so ruby is not required to run docs site
- fix bug where `npm start` causes machine to freeze
- remove unused grunt tasks/plugins

## [0.4.2] - 2016-05-04
### Support
- Exclude gh-release and gh-pages from travis build

## [0.4.1] - 2016-05-04
### Support
- Removed bower_components as a dev dependency
- Added Release script
- Npm and bower release

## [0.4.0] - 2016-04-28
### Added
- Added grouped bar charts

### Changed
- Show dynamic negative values
- Fix pie chart labels

### Support
- Dashboard examples
- Map chart example
- Deploy runs tests in Travis
- Update tooling
- Fix leaflet map location

## [0.3] - 2015-08-04
### Added
- Option for automatic tick marks based on chart size
- Added Tooltips API
- Added default Tooltip
- Added Event.off

### Changed
- X-Axis labels rotated counter-clockwise (to use Y-Axis space)
- Changed 'autolabels' default to true
- Changed 'renderer' default to 'svg'

### Support
- Added example demo links to JSFiddle

## [0.2] - 2015-07-14

### Added
- Sparkline chart type
- JSDoc documentation

### Changed
- Upgraded to Vega2
- Tooltip demo improvements
- Homepage improvements

## [0.1] - 2015-07-08
Baseline version.

### Added
- Types: Bar, Horizontal, Pie, Scatter, Bubble, Time line
- Basic interaction events: on, off, clicked
- Map to Chart interaction demos

[Unreleased]: https://github.com/Esri/cedar/compare/v1.0.0...master
[1.0.0]: https://github.com/Esri/cedar/compare/v1.0.0-rc.1...v1.0.0
[1.0.0-rc.1]: https://github.com/Esri/cedar/compare/v1.0.0-beta.9...v1.0.0-rc.1
[1.0.0-beta.9]: https://github.com/Esri/cedar/compare/v1.0.0-beta.8...v1.0.0-beta.9
[1.0.0-beta.8]: https://github.com/Esri/cedar/compare/v1.0.0-beta.7...v1.0.0-beta.8
[1.0.0-beta.7: https://github.com/Esri/cedar/compare/v1.0.0-beta.6...v1.0.0-beta.7
[1.0.0-beta.6]: https://github.com/Esri/cedar/compare/v1.0.0-beta.5...v1.0.0-beta.6
[1.0.0-beta.5]: https://github.com/Esri/cedar/compare/v1.0.0-beta.4...v1.0.0-beta.5
[1.0.0-beta.4]: https://github.com/Esri/cedar/compare/v1.0.0-beta.3...v1.0.0-beta.4
[1.0.0-beta.3]: https://github.com/Esri/cedar/compare/v1.0.0-beta.2...v1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/Esri/cedar/compare/v1.0.0-beta.1...v1.0.0-beta.2
[1.0.0-beta.1]: https://github.com/Esri/cedar/compare/v1.0.0-beta.0...v1.0.0-beta.1
[1.0.0-beta.0]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.7...v1.0.0-beta.0
[1.0.0-alpha.7]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.6...v1.0.0-alpha.7
[1.0.0-alpha.6]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.5...v1.0.0-alpha.6
[1.0.0-alpha.5]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.4...v1.0.0-alpha.5
[1.0.0-alpha.4]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.3...v1.0.0-alpha.4
[1.0.0-alpha.3]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.2...v1.0.0-alpha.3
[1.0.0-alpha.2]: https://github.com/Esri/cedar/compare/v1.0.0-alpha.1...v1.0.0-alpha.2
[0.2]: https://github.com/Esri/cedar/compare/v0.1...v0.2
[1.0.0-alpha.1]: https://github.com/Esri/cedar/compare/v1.0.0-alpha...v1.0.0-alpha.1
[1.0.0-alpha]: https://github.com/Esri/cedar/compare/v0.9.2...v1.0.0-alpha
[0.9.2]: https://github.com/Esri/cedar/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/Esri/cedar/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/Esri/cedar/compare/v0.8.2...v0.9.0
[0.8.2]: https://github.com/Esri/cedar/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/Esri/cedar/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/Esri/cedar/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/Esri/cedar/compare/v0.6.1...v0.7.0
[0.6.1]: https://github.com/Esri/cedar/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/Esri/cedar/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Esri/cedar/compare/v0.4.4...v0.5.0
[0.4.4]: https://github.com/Esri/cedar/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/Esri/cedar/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/Esri/cedar/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/Esri/cedar/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Esri/cedar/compare/v0.3...v0.4.0
[0.3]: https://github.com/Esri/cedar/compare/v0.2...v0.3
[0.1]: https://github.com/Esri/cedar/releases/tag/v0.1
