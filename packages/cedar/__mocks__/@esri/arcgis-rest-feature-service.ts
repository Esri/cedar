import { all, Dewitt, Fayetteville, Jordan } from '../../test/data/queryResponses'
export function queryFeatures(requestOptions) {
  if (requestOptions.fetch) {
    // we are testing a custom fetch implementation
    // just call that instead
    return requestOptions.fetch()
  }
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
