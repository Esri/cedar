# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
- Add tabindex properties to fillInSpec

## 1.0.0-rc.1

### Added
- style.colors accepts an array of colors that map to chart colors

## 1.0.0-beta.6
### Changed
- Defaults for bar charts with legends now specify legend valueAlign and spacing

## 1.0.0-beta.5
### Added
- One can now add a `style` property which contains `padding` and `pie` properties to `definition`
### changed
- popup text for pie charts has a new format

## 1.0.0-beta.4
### Changed
- treat arcgis libraries as external

## 1.0.0-beta.3
### Added
- legend.position determines the location (top, bottom, right, left) of a chart legend
### Changed
- legend.enable is now legend.visible
- Text colors have been changed to pass color contrast ratio on white backgrounds
- Pie charts default to legend off and inner radius 0
- updated tests and added mocks for 100% code coverage
- using yarn workspaces for monorepo
### Fixed
- Specifications that are passed in are actually supported

## 1.0.0-beta.1
### Added
- cedar definition legend property hides/shows chart legend

## 1.0.0-beta.0
### Changed
- install amcharts from npm instead of git
- added fillInSpec() tests for more chart types (including v0.9 definitions)

## 1.0.0-alpha.7
### Changed
- Horizontal bar charts renamed from horizontal to bar-horizontal
- Time and bubble types convert to timeline and scatter and prompt a console.warn
- Grouped type converts to bar
- Multi series bar charts group by default instead of stack
- Single series charts (excluding pie/radar) now have x,y axis titles turned on by default and legend turned off by default
- Timeline charts now look like line charts with parseDates
### Fixed
- scatter/bubble tooltips no longer show 'undefined' at the top

## 1.0.0-alpha.5
### Changed
- Font color for axis and legend updated to match old cedar

## 1.0.0-alpha.4
### Fixed
- allow overriding properties of graphs
### Changed
- bundling deepmerge instead of defining a deepMerge function

## 1.0.0-alpha.2
### Changed
- bar chart doesn't show cursor (value) on x-axis by default
- don't show labels by default on series

## 1.0.0-alpha.1
### Fixed
- Fixed issue with deepMerge where it would iterate over ember specific props

## 1.0.0-alpha
### Added
- initial release
