# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Changed
- added CORS support to docs site
- install amcharts from npm instead of git
- get category field from dataset or series

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
