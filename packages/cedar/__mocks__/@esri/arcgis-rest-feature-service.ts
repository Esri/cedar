import {} from 'jest'

// stub queryFeatures to resolve an empty object
// instead of actually fetching features
export const queryFeatures = jest.fn().mockResolvedValue({})
