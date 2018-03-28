import {} from 'jest'
import { queryDatasets } from '../../src/query/query'
import * as definitions from '../data/definitions'
import { all, Dewitt, Fayetteville, Jordan } from '../data/queryResponses'

describe('when querying datasets', () => {
  describe('when no datasets', () => {
    it('should return an empty hash', () => {
      const datasets = []
      return queryDatasets(datasets).then((datasetsData) => {
        expect(datasetsData).toEqual({})
      })
    })
  })
  describe('when a single dataset', () => {
    describe('when that dataset has a name', () => {
      const datasets = definitions.bar.datasets
      it('should return a hash with an entry for only that dataset', () => {
        return queryDatasets(datasets).then((datasetsData) => {
          expect(datasetsData).toEqual({
            Number_of_SUM: all
          })
        })
      })
    })
    describe('when that dataset does not have a name', () => {
      it('should use the default name', () => {
        const barDataset = definitions.bar.datasets[0]
        const datasets = [{
          name: undefined,
          url: barDataset.url,
          query: barDataset.query
        }]
        return queryDatasets(datasets).then((datasetsData) => {
          expect(datasetsData).toEqual({
            dataset0: all
          })
        })
      })
    })
  })
  describe('when multiple datasets', () => {
    describe('when one has inline data', () => {
      // dummy dataset w/ inline data
      const inlineDataset = {
        name: 'inline',
        data: [
          { a: 1, b: 2 },
          { a: 3, b: 4 },
        ]
      }
      const datasets = [ definitions.bar.datasets[0], inlineDataset ]
      it('should return a hash with an entry for only the non-inline dataset', () => {
        return queryDatasets(datasets).then((datasetsData) => {
          expect(datasetsData).toEqual({
            Number_of_SUM: all
          })
        })
      })
    })
  })
  describe('when all have urls', () => {
    const datasets = definitions.barJoined.datasets
    it('should return a hash with an entry for each dataset', () => {
      return queryDatasets(datasets).then((datasetsData) => {
        expect(datasetsData).toEqual({
          Jordan,
          Dewitt,
          Fayetteville
        })
      })
    })
  })
})
