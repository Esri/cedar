export interface IFeature {
  attributes: {}
}

export interface IFeatureSet {
  features: IFeature[]
}

function flattenFeature(feature: IFeature, categoryField?: string) {
  const attributes = feature.attributes
  if (categoryField) {
    // render function expects a property named 'categoryField'
    // TODO: what if attributes already has a 'categoryField' property
    attributes['categoryField'] = attributes[categoryField] || ''
  }
  return feature.attributes
}

// just return an array of flattened features
export function flatten(featureSet: IFeatureSet, categoryField?) {
  return featureSet.features.map((feature) => (flattenFeature(feature, categoryField)))
}

// TODO: don't export this once we're sure we've got the logic right
export function buildIndex(joinKeys: string[], featureSets: any[]) {
  const index = {}
  featureSets.forEach((featureSet, i) => {
    featureSet.features.forEach((feature) => {
      // the column that this dataset should be joined on
      const joinKey = joinKeys[i]
      const joinValue = feature.attributes[joinKeys[i]]
      if (index[joinValue] === undefined) {
        index[joinValue] = []
      }
      index[joinValue].push(feature)
    })
  })
  return index
}

export function flattenFeatures(featureSets: any[], joinKeys: any[]) {
  const rows = []

  // for now we need joinKeys to be 1:1 w/ featureSets
  if (joinKeys.length !== featureSets.length) {
    throw new Error('Must have a joinKey for each featureSet')
  }

  if (featureSets.length === 1) {
    // no need to join, just the flattened features
    return flatten(featureSets[0], joinKeys[0])
  }

  // Otherwise join
  const index = buildIndex(joinKeys, featureSets)
  const key = joinKeys[0] // TODO: support different `category` keys
  const uniqueValues = Object.keys(index)
  uniqueValues.forEach((uniqueValue) => {
    // all the features whose join field was equal to this value
    const features = index[uniqueValue]
    const row = { categoryField: features[0].attributes[key] || '' }
    features.forEach((feature, i) => {
      const attributes = feature.attributes
      Object.keys(attributes).forEach((attrKey) => {
        // append the feature's index to the row's column name
        const col = `${attrKey}_${i}`
        row[col] = attributes[attrKey]
      })
    })
    rows.push(row)
  })

  return rows
}
