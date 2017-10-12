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

  // If we aren't joining, but we are appending
  if (joinKeys.length === 0) {
    featureSets.forEach((featureSet, i) => {
      // const transformFunc = getTransformFunc(transformFuncs[i])
      featureSet.features.forEach((feature) => {
        rows.push(feature.attributes)
      })
    })
    return rows
  }

  // TODO: if there's only 1 featureSet, do we need to build an index?
  // couldn't we just return featureSet.features.map(feature => feature.attributes)

  // Otherwise join
  // TODO: does joinKeys have to be 1:1 to featureSets? I think so
  const index = buildIndex(joinKeys, featureSets)
  const key = joinKeys[0] // TODO: support different `category` keys
  const uniqueValues = Object.keys(index)
  uniqueValues.forEach((uniqueValue) => {
    // all the features whose join field was equal to this value
    const features = index[uniqueValue]
    const row = { categoryField: features[0].attributes[key] }
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

export default flattenFeatures
