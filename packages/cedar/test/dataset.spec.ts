import { IFeatureSet } from '@esri/arcgis-rest-common-types'
import {} from 'jest'
import { getChartData, IDataset } from '../src/dataset'
import * as chartData from './data/chartData'
import { barJoined } from './data/definitions'
import {all, Dewitt, Fayetteville, Jordan } from './data/queryResponses'

describe('when getting chart data', () => {
  describe('when no datasets', () => {
    test('it should return an empty array', () => {
      expect(getChartData([])).toEqual([])
    })
  })
  describe('when only one dataset', () => {
    let dataset: IDataset
    let featureSet: IFeatureSet
    let expected
    beforeAll(() => {
      // get the query response for all features
      featureSet = all as IFeatureSet
      // set up the expected output
      expected = chartData.bar
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
        const options = {
          datasetsData: { dummy: featureSet }
        }
        expect(getChartData([dataset], options)).toEqual(expected)
      })
      test('it should flatten a feature set using default name', () => {
        delete dataset.name
        const options = {
          datasetsData: { dataset0: featureSet }
        }
        expect(getChartData([dataset], options)).toEqual(expected)
      })
    })
  })
  describe('when joining data', () => {
    test('it should return an array of objects w/ categoryField and other props prefixed by dataset names', () => {
      // get the datasets and series from the example joined definition
      const { datasets, series } = barJoined
      // simulate a hash of query responses
      const datasetsData = { Jordan, Dewitt, Fayetteville }
      const options = { datasetsData, series }
      // expected join output
      const expected = chartData.barJoined
      expect(getChartData(datasets, options)).toEqual(expected)
    })
  })
})
