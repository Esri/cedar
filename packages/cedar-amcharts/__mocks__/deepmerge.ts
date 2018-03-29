// TODO: remove this mock once Jest can import deepmerge
// see: https://github.com/KyleAMathews/deepmerge/issues/87
// and: https://github.com/facebook/jest/pull/2704
import deepmerge = require('deepmerge')
export default function merge(...args) {
  return deepmerge(...args)
}
