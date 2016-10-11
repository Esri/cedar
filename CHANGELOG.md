# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Changed
- source converted to ES2015 and compiled with rollup/buble
- tooling updated to favor npm scripts instead of grunt
- test pages and specs moved under test folder
- clean up of unused grunt tasks, dependencies, and misc files

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

[0.6.1]: https://github.com/Esri/cedar/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/Esri/cedar/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Esri/cedar/compare/v0.4.4...v0.5.0
[0.4.4]: https://github.com/Esri/cedar/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/Esri/cedar/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/Esri/cedar/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/Esri/cedar/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Esri/cedar/compare/v0.3...v0.4.0
[0.3]: https://github.com/Esri/cedar/compare/v0.2...v0.3
[0.2]: https://github.com/Esri/cedar/compare/v0.1...v0.2
[0.1]: https://github.com/Esri/cedar/releases/tag/v0.1
