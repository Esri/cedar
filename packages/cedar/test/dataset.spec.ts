import { IFeatureSet } from '@esri/arcgis-rest-common-types'
import {} from 'jest'
import { getChartData, IDataset } from '../src/dataset'
import { datasets, datasetsData, series } from './data/joinData'

describe('when getting chart data', () => {
  describe('when only one dataset', () => {
    let dataset: IDataset
    let featureSet: IFeatureSet
    let expected
    beforeAll(() => {
      // copy a feature set from the example data for the join test
      featureSet = datasetsData.Jordan as IFeatureSet
      // set up the expected output
      expected = [
        { Number_of_SUM: 13, Type: 'High School' },
        { Number_of_SUM: 6, Type: 'Middle School' },
        { Number_of_SUM: 1, Type: 'Elementary School' }
      ]
    })
    beforeEach(() => {
      // create a dummy dataset
      dataset = {
        name: 'dummy'
      }
    })
    describe('when data is set on dataset', () => {
      test('it should flatten data as a feature set', () => {
        dataset.data = featureSet
        expect(getChartData([dataset])).toEqual(expected)
      })
      test('it should flatten data as an array of features', () => {
        dataset.data = featureSet.features
        expect(getChartData([dataset])).toEqual(expected)
      })
      test('it should not have to flatten an array of objects', () => {
        // simulate passing in an array of objects
        dataset.data = expected
        expect(getChartData([dataset])).toEqual(expected)
      })
    })
    describe('when data is passed in via datasetData', () => {
      test('it should flatten a feature set referenced by name', () => {
        const datasetData = { dummy: featureSet }
        expect(getChartData([dataset], datasetData)).toEqual(expected)
      })
      test('it should flatten a feature set using default name', () => {
        delete dataset.name
        const datasetData = { dataset0: featureSet }
        expect(getChartData([dataset], datasetData)).toEqual(expected)
      })
    })
  })
  describe('when joining data', () => {
    test('it should return an array of objects w/ categoryField and other props prefixed by dataset names', () => {
      const expected = [
        { categoryField: 'High School', Jordan_Number_of_SUM: 13, Fayetteville_Number_of_SUM: 8 },
        { categoryField: 'Middle School', Jordan_Number_of_SUM: 6, Fayetteville_Number_of_SUM: 0 },
        { categoryField: 'Elementary School', Jordan_Number_of_SUM: 1, Dewitt_Number_of_SUM: 1, Fayetteville_Number_of_SUM: 1 }
      ]
      expect(getChartData(datasets, datasetsData, series)).toEqual(expected)
    })
  })
})
