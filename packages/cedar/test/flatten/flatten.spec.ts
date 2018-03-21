import {} from 'jest'
import { buildIndex, flattenFeatureSets } from '../../src/flatten/flatten'
import expectedChartData from '../data/chartData'
import exampleData from '../data/exampleData'
import featureServiceResponse from '../data/featureServiceResponse'

describe('running when a single dataset', () => {
  test('it should return a single flattened featureSet', () => {
    const data = {
      joinKeys: ['Type'],
      featureSets: [featureServiceResponse]
    }
    expect(flattenFeatureSets(data.featureSets, data.joinKeys)).toEqual(expectedChartData.barSingleDataset)
  })

  test('flattenFeatureSets properly flattens when provided join keys', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: exampleData
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
        Number_of_SUM_1: 6,
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

    expect(flattenFeatureSets(data.featureSets, data.joinKeys)).toEqual(result)
  })

  test('BuildIndex properly builds and fills in missing data', () => {
    const data = {
      joinKeys: ['Type', 'Type', 'Type'],
      featureSets: exampleData
    }

    const result = {
      'High School': [
        {
          attributes: {
            Number_of_SUM: 13,
            Type: 'High School'
          }
        },
        {
          attributes: {
            Number_of_SUM: 8,
            Type: 'High School'
          }
        },
        {
          attributes: {
            Number_of_SUM: 0,
            Type: 'High School'
          }
        }
      ],
      'Middle School': [
        {
          attributes: {
            Number_of_SUM: 6,
            Type: 'Middle School'
          }
        },
        {
          Number_of_SUM: 6,
          Type: 'Middle School'
        },
        {
          attributes: {
            Number_of_SUM: 0,
            Type: 'Middle School'
          }
        }
      ],
      'Elementary School': [
        {
          attributes: {
            Number_of_SUM: 1,
            Type: 'Elementary School'
          }
        },
        {
          Number_of_SUM: 1,
          Type: 'Elementary School'
        },
        {
          Number_of_SUM: 1,
          Type: 'Elementary School'
        }
      ]
    }
    expect(buildIndex(data.joinKeys, data.featureSets)).toEqual(result)
  })
})
