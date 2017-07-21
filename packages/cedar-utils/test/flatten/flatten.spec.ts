import {} from 'jest'
import flatten from '../../src/flatten/flatten'
import { buildIndex } from '../../src/flatten/flatten'
import schoolResponse from '../data/schoolResponse'

describe('Features should properly flatten', () => {
  test('flattenFeatures properly flattens features when no joinKeys are present', () => {
    const data = {
      joinKeys: [],
      featureSets: schoolResponse,
      transformFuncs: []
    }
    const arr = [{Number_of_SUM: 13, Type: 'High School'}, {Number_of_SUM: 6, Type: 'Middle School'}, {Number_of_SUM: 1, Type: 'Elementary School'}, {Number_of_SUM: 1, Type: 'Elementary School'}, {Number_of_SUM: 8, Type: 'High School'}, {Number_of_SUM: 1, Type: 'Elementary School'}, {Number_of_SUM: 0, Type: 'Middle School'}]

    expect(flatten(data)).toEqual(arr)
    expect(true).toBe(true)
  })

  test('BuildIndex should properly build an index...', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: schoolResponse,
      transformFuncs: []
    }
    const result = {
      'High School':
         [ { Number_of_SUM: 13, Type: 'High School' },
           { Number_of_SUM: 8, Type: 'High School' } ],
      'Middle School':
         [ { Number_of_SUM: 6, Type: 'Middle School' },
           { Number_of_SUM: 0, Type: 'Middle School' } ],
      'Elementary School':
         [ { Number_of_SUM: 1, Type: 'Elementary School' },
           { Number_of_SUM: 1, Type: 'Elementary School' },
           { Number_of_SUM: 1, Type: 'Elementary School' } ]
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
        Number_of_SUM_0: 13,
        Type_0: 'High School',
        Number_of_SUM_1: 8,
        Type_1: 'High School'
      },
      {
        categoryField: 'Middle School',
        Number_of_SUM_0: 6,
        Type_0: 'Middle School',
        Number_of_SUM_1: 0,
        Type_1: 'Middle School'
      },
      {
        categoryField: 'Elementary School',
        Number_of_SUM_0: 1,
        Type_0: 'Elementary School',
        Number_of_SUM_1: 1,
        Type_1: 'Elementary School',
        Number_of_SUM_2: 1,
        Type_2: 'Elementary School'
      }
    ]

    expect(flatten(data)).toEqual(result)
  })
})
