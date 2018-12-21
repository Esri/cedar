import { IFeature, IFeatureSet } from '@esri/arcgis-rest-common-types'
import { IDataset, ISeries } from './common'

export interface IGetChartDataOptions {
  datasetsData?: {},
  series?: ISeries[]
}

// if it's a feature set, return the array of features
// otherwise just return the array of objects that was passed in
function getFeatures(data: IFeatureSet | Array<{}>) {
  return (data as IFeatureSet).features ? (data as IFeatureSet).features : data as Array<{}>
}

// if it's a feature, return the attributes
// otherwise return the entire object that was passed in
function getAttributes(row: IFeature | {}) {
  /* istanbul ignore else since that only happens when features are mixed with rows */
  if ((row as IFeature).attributes) {
    return (row as IFeature).attributes
  } else {
    return row
  }
}

// get an array of value field names from a dataset's series
function getDatasetValueFields(datasetName, series: ISeries[]) {
  return series.reduce((fields, s) => {
    if (s.source === datasetName && s.value) {
      fields.push(s.value.field)
    }
    return fields
  }, [])
}

// get a unique field (property) name for a dataset/value field
function getDatasetValueFieldName(datasetName, valueField) {
  return `${datasetName}_${valueField}`
}

function getDatasetData(dataset, datasetsData, name?) {
  const datasetName = dataset.name || name
  return dataset.data || datasetsData[datasetName]
}

// if data is a feature set or array of features
// return only the attributes for each feature
function flattenData(data) {
  const features = getFeatures(data)
  if (features.length > 0 && (features[0] as IFeature).attributes) {
    // these really are features, flatten them before
    return features.map(getAttributes)
  } else {
    // assume this is an array of objects and don't
    return features
  }
}

// join data from multiple datasets into a single table
function joinData(datasets: IDataset[], series: ISeries[], datasetsData?: {}): any[] {
  // first build a hash whose keys for each of the
  // unique values in the join columns of the datasets
  // and the value of each is a row with the joined values
  const hashTable = datasets.reduce((index, dataset, i) => {
    // get the attribute that this dataset will be joined on
    const joinKey = dataset.join
    // TODO: what if no joinKey, throw error? skip this dataset?
    // if dataset doesn't have inline data use data that was passed in
    const datasetData = getDatasetData(dataset, datasetsData)
    // TODO: what if no datasetData, throw error? skip this dataset?
    // get the value fields for this dataset from it's series
    const datasetName = dataset.name
    const valueFields = getDatasetValueFields(datasetName, series)
    // TODO: what if no valueFields, throw error? skip this dataset?
    getFeatures(datasetData).forEach((feature) => {
      // get the value of the column that this dataset should be joined on
      const attrs = getAttributes(feature)
      const joinValue = attrs[joinKey]
      // start a new row for this value if there isn't one already
      if (index[joinValue] === undefined) {
        // use this value for the categoryField
        index[joinValue] = { categoryField: joinValue }
      }
      // get the remaining values for this row
      valueFields.reduce((row, valueField) => {
        // add a property to the row for this dataset and value field
        row[getDatasetValueFieldName(datasetName, valueField)] = attrs[valueField]
        // valueFields.splice(i, 1)
        return row
      }, index[joinValue])
    })
    return index
  }, {})
  // return the rows of joined values from the hash table
  return Object.keys(hashTable).map((key) => hashTable[key])
}

// flatten data from all datasets into a single table
export function getChartData(datasets: IDataset[], options?: IGetChartDataOptions) {
  if (!datasets) {
    return
  }
  if (datasets.length < 1) {
    return []
  }
  const datasetsData = options && options.datasetsData
  if (datasets.length > 1) {
    // TODO: what if no series? throw error?
    const series = options && options.series
    // TODO: support other ways of merging (append, etc), but for now just
    // join the feature sets into a single table
    return joinData(datasets, series, datasetsData)
  }
  // just flatten the feature set into a table
  // TODO: make name required on datasets, or required if > 1 dataset?
  const datasetData = getDatasetData(datasets[0], datasetsData, 'dataset0')
  return flattenData(datasetData)
}
