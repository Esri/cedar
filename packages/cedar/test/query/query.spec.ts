// NOTE: this is auto-mocked in __mocks__
import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-service'
import {} from 'jest'
import config from '../../src/config'
import { queryDatasets } from '../../src/query/query'
import { createQueryParams } from '../../src/query/url'
import * as definitions from '../data/definitions'

// NOTE: we're only doing this so TS doesn't complain
// TODO: how to tell TS that type of queryFeatures is a jest mock function???
const mockQueryFeatures = (queryFeatures as any)

const mockDecodeValues = (decodeValues as any)


// TODO: ues actual requestOptions type
const verifyRequestOptions = (dataset, requestOptions: any, expectedFetch = undefined) => {
  expect(requestOptions.url).toEqual(dataset.url)
  expect(requestOptions.params).toEqual(createQueryParams(dataset.query))
  expect(requestOptions.fetch).toBe(expectedFetch)
}

describe('when querying datasets', () => {
  // NOTE: this is what the mocked queryFeatures returns
  const mockQueryResponse = {}
  describe('when no datasets', () => {
    it('should return an empty hash', () => {
      const datasets = []
      return queryDatasets(datasets).then((datasetsData) => {
        // it should not have called queryFeatures
        expect(mockQueryFeatures.mock.calls.length).toEqual(0)
        expect(datasetsData).toEqual({})
      })
    })
  })
  describe('when a single dataset', () => {
    beforeEach(() => {
      mockQueryFeatures.mockClear()
      mockDecodeValues.mockClear()
    })
    describe('when that dataset has a name', () => {
      const datasets = definitions.bar.datasets
      it('should return a hash with an entry for only that dataset', () => {
        return queryDatasets(datasets).then((datasetsData) => {
          // verify that it called queryFeatures once w/ the right parameters
          expect(mockQueryFeatures.mock.calls.length).toEqual(1)
          verifyRequestOptions(datasets[0], mockQueryFeatures.mock.calls[0][0])
          expect(datasetsData).toEqual({
            Number_of_SUM: mockQueryResponse
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
          // verify that it called queryFeatures once w/ the right parameters
          expect(mockQueryFeatures.mock.calls.length).toEqual(1)
          verifyRequestOptions(datasets[0], mockQueryFeatures.mock.calls[0][0])
          expect(datasetsData).toEqual({
            dataset0: mockQueryResponse
          })
        })
      })
    })
    describe('when passing in custom fetch', () => {
      const datasets = definitions.bar.datasets
      beforeAll(() => {
        config.fetch = jest.fn()
      })
      afterAll(() => {
        delete config.fetch
      })
      it('should pass fetch along to request', () => {
        return queryDatasets(datasets).then((datasetsData) => {
          // verify that it called queryFeatures once w/ the right parameters
          expect(mockQueryFeatures.mock.calls.length).toEqual(1)
          verifyRequestOptions(datasets[0], mockQueryFeatures.mock.calls[0][0], config.fetch)
          expect(datasetsData).toEqual({
            Number_of_SUM: mockQueryResponse
          })
        })
      })
    })
  })
  describe('when multiple datasets', () => {
    beforeEach(() => {
      mockQueryFeatures.mockClear()
      mockDecodeValues.mockClear()
    })
    describe('when one has inline data', () => {
      const barDataset = definitions.bar.datasets[0]
      // dummy dataset w/ inline data
      const inlineDataset = {
        name: 'inline',
        data: [
          { a: 1, b: 2 },
          { a: 3, b: 4 },
        ]
      }
      const datasets = [ barDataset, inlineDataset ]
      it('should return a hash with an entry for only the non-inline dataset', () => {
        return queryDatasets(datasets).then((datasetsData) => {
          expect(mockQueryFeatures.mock.calls.length).toEqual(1)
          verifyRequestOptions(barDataset, mockQueryFeatures.mock.calls[0][0])
          expect(datasetsData).toEqual({
            Number_of_SUM: mockQueryResponse
          })
        })
      })
    })
    describe('when all have urls', () => {
      const datasets = definitions.barJoined.datasets
      it('should return a hash with an entry for each dataset', () => {
        return queryDatasets(datasets).then((datasetsData) => {
          expect(mockQueryFeatures.mock.calls.length).toEqual(3)
          datasets.forEach((dataset, i) => {
            verifyRequestOptions(dataset, mockQueryFeatures.mock.calls[i][0])
          })
          expect(datasetsData).toEqual({
            Jordan: mockQueryResponse,
            Dewitt: mockQueryResponse,
            Fayetteville: mockQueryResponse
          })
        })
      })
    })
  })
})
