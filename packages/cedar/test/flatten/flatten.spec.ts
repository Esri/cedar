import {} from 'jest'
import { buildIndex, flattenFeatures } from '../../src/flatten/flatten'
import expectedChartData from '../data/chartData'
import featureServiceResponse from '../data/featureServiceResponse'
import schoolResponse from '../data/schoolResponse'

describe('running when a single dataset', () => {
  test('it shoudl flattenFeatures returns flattend features', () => {
    const data = {
      joinKeys: ['Type'],
      featureSets: [featureServiceResponse]
    }
    expect(flattenFeatures(data.featureSets, data.joinKeys)).toEqual(expectedChartData.barSingleDataset)
  })

  test('BuildIndex should properly build an index...', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: schoolResponse
    }
    const result = {
      'High School': [
        { attributes: { Number_of_SUM: 13, Type: 'High School' } },
        { attributes: { Number_of_SUM: 8, Type: 'High School' } }
      ],
      'Middle School': [
        { attributes: { Number_of_SUM: 6, Type: 'Middle School' } },
        { attributes: { Number_of_SUM: 0, Type: 'Middle School' } }
      ],
      'Elementary School': [
        { attributes: { Number_of_SUM: 1, Type: 'Elementary School' } },
        { attributes: { Number_of_SUM: 1, Type: 'Elementary School' } },
        { attributes: { Number_of_SUM: 1, Type: 'Elementary School' } }
      ]
    }

    expect(buildIndex(data.joinKeys, data.featureSets)).toEqual(result)
  })

  test('flattenFeatures properly flattens when provided join keys', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: schoolResponse
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

    expect(flattenFeatures(data.featureSets, data.joinKeys)).toEqual(result)
  })
})
