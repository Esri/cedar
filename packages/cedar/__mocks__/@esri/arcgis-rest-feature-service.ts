import { all, Dewitt, Fayetteville, Jordan } from '../../test/data/queryResponses'
export function queryFeatures(requestOptions) {
  let response
  switch (requestOptions.params.where) {
    case 'City=\'Jordan\'':
      response = Jordan
      break
    case 'City=\'Dewitt\'':
      response = Dewitt
      break
    case 'City=\'Fayetteville\'':
      response = Fayetteville
      break
    default:
      response = all
  }
  return Promise.resolve(response)
}
