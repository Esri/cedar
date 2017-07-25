function _defaultTransformFunc(feature: any) {
  return feature.attributes
}

export function getTransformFunc(transformFunc: any) {
  return typeof transformFunc === 'function' ? transformFunc : _defaultTransformFunc
}

export function buildIndex(joinKeys: string[], featureSets: any[], transformFuncs: any[]) {
  const index = {}
  featureSets.forEach((featureSet, i) => {
    const transformFunc = getTransformFunc(transformFuncs[i])
    featureSet.features.forEach((features, j) => {
      const idx = features.attributes[joinKeys[i]]
      if (index[idx] === undefined) {
        index[idx] = []
      }
      index[idx].push(transformFunc(features))
    })
  })
  return index
}

export function flattenFeatures(featureSets: any[], joinKeys: any[], transformFuncs: any[]) {
  // TODO: Transform data
  const features = []

  // If we aren't joining, but we are merging
  if (joinKeys.length === 0) {
    featureSets.forEach((featureSet, i) => {
      const transformFunc = getTransformFunc(transformFuncs[i])
      featureSet.features.forEach((feature, j) => {
        features.push(transformFunc(feature))
      })
    })
    return features
  }

  // Otherwise join
  const index = buildIndex(joinKeys, featureSets, transformFuncs)
  const key = joinKeys[0] // TODO: support different `category` keys
  const keys = Object.keys(index)
  keys.forEach((indKey, i) => {
    const idxArr = index[indKey]
    const feature = { categoryField: idxArr[0][key] }
    idxArr.forEach((idx, k) => {
      const attrKeys = Object.keys(idx)
      attrKeys.forEach((ak, j) => {
        const attr = `${ak}_${k}`
        feature[attr] = idx[ak]
      })
    })
    features.push(feature)
  })

  return features
}

export default flattenFeatures
