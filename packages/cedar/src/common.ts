import { IFeatureSet } from '@esri/arcgis-rest-common-types'

export interface IField {
  /**
   * The name of the filed in the soruce dataset
   */
  field: string,
  /**
   * The label used for the field in the chart's axes and/or tooltip
   */
  label?: string
}

// TODO: move this and IDomain(s) to rest-js
/**
 * A code and the value (name) it represents
 */
export interface ICodedValue {
  /**
   * The value represented by the code
   */
  name: string,
  /**
   * A code representing the value
   */
  code: string | number
}
/**
 * [Domain information about a field](https://developers.arcgis.com/documentation/common-data-types/domain-objects.htm), used to decode coded value domains.
 */
export interface IDomain {
  type: string,
  name: string,
  description?: string,
  codedValues?: ICodedValue[]
}

/**
 * A collection of domains
 */
export interface IDomains {
  [index: string]: IDomain
}

/**
 * A source of data for the chart. Can be _either_:
 * - a `url` to an ArcGIS feature layer along with optional [query parameters](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm)
 * - _or_ inline `data`, which can be a [FeatureSet](https://esri.github.io/arcgis-rest-js/api/common-types/IFeatureSet/), or an array of [features](https://esri.github.io/arcgis-rest-js/api/common-types/IFeature/) or [POJO](http://blog.dreasgrech.com/2012/02/creating-pojos-in-javascript.html)s
 */
export interface IDataset {
  /**
   * Used to identify which series get their data from this dataset
   */
  name: string,
  /**
   * Feature layer URL where data will be queried from for non-inline datasets
   */
  url?: string,
  /**
   * Inline data, either a [FeatureSet](https://esri.github.io/arcgis-rest-js/api/common-types/IFeatureSet/), or an array of [features](https://esri.github.io/arcgis-rest-js/api/common-types/IFeature/) or [POJO](http://blog.dreasgrech.com/2012/02/creating-pojos-in-javascript.html)s
   */
  data?: IFeatureSet | Array<{}>,
  /**
   * [Query parameters](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) to apply when fetching data (does not apply to inline data)
   */
  query?: {},
  /**
   * The field to be used when joining multiple datasets. All datasets with a join field will be joined into a single "table" before passing to the chart rendering engine.
   */
  join?: string,
  /**
   * Values in these fields will be decoded using the coded value domain specified.
   */
  domains?: IDomains
}

/**
 * Used to relate dataset fields to plots (bars, lines, points, etc) on the chart
 */
export interface ISeries {
  /**
   * The name of the dataset from which the category and value fields come from
   */
  source: string,
  /**
   * The category field, typically shown on the X axis of a chart
   */
  category?: IField,
  /**
   * The value field, typically shown on the Y axis of a chart
   */
  value?: IField
}
