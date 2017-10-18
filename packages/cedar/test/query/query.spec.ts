import {} from 'jest'
import query from '../../src/query/query'
import response from '../data/featureServiceResponse'

describe('Feature service to array and array to feature service work', () => {
  test('fsToArr takes in a feature service response and returns an array of attributes', () => {
    const arr = [
      {Number_of_SUM: 261, Type: 'Middle School'},
      {Number_of_SUM: 252, Type: 'Elementary School'},
      {Number_of_SUM: 184, Type: 'High School'},
      {Number_of_SUM: 159, Type: 'Middle School (7&8)'},
      {Number_of_SUM: 98, Type: 'K-8'},
      {Number_of_SUM: 31, Type: 'Junior/Senior High School'},
      {Number_of_SUM: 22, Type: 'Junior High School'},
      {Number_of_SUM: 3, Type: 'K-12'},
      {Number_of_SUM: 1, Type: 'Intermediate School'},
      {Number_of_SUM: 0, Type: 'Alternative School'},
      {Number_of_SUM: 0, Type: 'High School Annex'},
      {Number_of_SUM: 0, Type: 'Middle School High School'},
      {Number_of_SUM: 0, Type: 'Pre-K'}
    ]
    const result = query.fsToArr(response)
    expect(result).toEqual(arr)
  })

  test('arrToFs takes an array and returns a FS response', () => {
    const arr = [
      {Number_of_SUM: 261, Type: 'Middle School'},
      {Number_of_SUM: 252, Type: 'Elementary School'},
      {Number_of_SUM: 184, Type: 'High School'},
      {Number_of_SUM: 159, Type: 'Middle School (7&8)'},
      {Number_of_SUM: 98, Type: 'K-8'},
      {Number_of_SUM: 31, Type: 'Junior/Senior High School'},
      {Number_of_SUM: 22, Type: 'Junior High School'},
      {Number_of_SUM: 3, Type: 'K-12'},
      {Number_of_SUM: 1, Type: 'Intermediate School'},
      {Number_of_SUM: 0, Type: 'Alternative School'},
      {Number_of_SUM: 0, Type: 'High School Annex'},
      {Number_of_SUM: 0, Type: 'Middle School High School'},
      {Number_of_SUM: 0, Type: 'Pre-K'}
    ]
    const result = query.arrToFs(arr)
    expect(result.features).toEqual(response.features)
  })
})
