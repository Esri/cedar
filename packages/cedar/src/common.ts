import { IFeatureSet } from '@esri/arcgis-rest-common-types'

export interface IField {
  field: string,
  label?: string
}

// TODO: move this and IDomain(s) to rest-js
export interface ICodedValue {
  name: string,
  code: string | number
}

export interface IDomain {
  type: string,
  name: string,
  description?: string,
  codedValues?: ICodedValue[]
}

export interface IDomains {
  [index: string]: IDomain
}

/**
 * A source of data for the chart. Can be a query, or inline data (i.e. feature set, or an array of POJOs).
 */
export interface IDataset {
  /**
   * Used to identify which series get their data from this dataset
   */
  name: string,
  /**
   * URL where data will be queried from for non-inline datasets
   */
  url?: string,
  /**
   * Inline data, either a FeatureSet or an array of POJOs.
   */
  data?: IFeatureSet | Array<{}>,
  /**
   * Query params to apply when fetching data (does not apply to inline data)
   */
  query?: {},
  /**
   * The field to be used when joining datasets. All datasets with a join field specified will be joined into a single "table" before passing to the chart rendering engine.
   */
  join?: string,
  /**
   * Values in these fields will be decoded using the coded value domain specified.
   */
  domains?: IDomains
}

export interface ISeries {
  source: string,
  category?: IField,
  value?: IField
}
