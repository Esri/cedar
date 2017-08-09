import {} from 'jest'
import flatten from '../../src/flatten/flatten'
import { buildIndex } from '../../src/flatten/flatten'
// TODO: better example of merge response
import mergeResponse from '../data/mergeResponse'
import schoolResponse from '../data/schoolResponse'

describe('Features should properly flatten', () => {
  test('flattenFeatures properly flattens features when no joinKeys are present', () => {
    const data = {
      joinKeys: [],
      featureSets: mergeResponse,
      transformFuncs: []
    }
    const expected = [{Number_of_SUM: 13, Type: 'High School'}, {Number_of_SUM: 6, Type: 'Middle School'}, {Number_of_SUM: 1, Type: 'Elementary School'}, {Number_of_SUM: 1, Type: 'Elementary School'}, {Number_of_SUM: 8, Type: 'High School'}, {Number_of_SUM: 1, Type: 'Elementary School'}, {Number_of_SUM: 0, Type: 'Middle School'}]

    expect(flatten(data.featureSets, data.joinKeys, data.transformFuncs)).toEqual(expected)
  })

  test('BuildIndex should properly build an index...', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: schoolResponse,
      transformFuncs: []
    }
    const result = {
      'High School':
         [ { Jordan_SUM: 13, Type: 'High School' },
           { Dewitt_SUM: 8, Type: 'High School' } ],
      'Middle School':
         [ { Jordan_SUM: 6, Type: 'Middle School' },
           { Dewitt_SUM: 0, Type: 'Middle School' } ],
      'Elementary School':
         [ { Jordan_SUM: 1, Type: 'Elementary School' },
           { Fayetteville_SUM: 1, Type: 'Elementary School' },
           { Dewitt_SUM: 1, Type: 'Elementary School' } ]
         }

    expect(buildIndex(data.joinKeys, data.featureSets, [])).toEqual(result)
  })

  test('flattenFeatures properly flattens when provided join keys', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: schoolResponse,
      transformFuncs: []
    }

    const result = [
      {
        categoryField: 'High School',
        Jordan_SUM: 13,
        Type: 'High School',
        Dewitt_SUM: 8
      },
      {
        categoryField: 'Middle School',
        Jordan_SUM: 6,
        Type: 'Middle School',
        Dewitt_SUM: 0
      },
      {
        categoryField: 'Elementary School',
        Jordan_SUM: 1,
        Type: 'Elementary School',
        Fayetteville_SUM: 1,
        Dewitt_SUM: 1
      }
    ]

    expect(flatten(data.featureSets, data.joinKeys, data.transformFuncs)).toEqual(result)
  })
})
