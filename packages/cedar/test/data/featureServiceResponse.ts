const response = {
  objectIdFieldName: 'FID',
  globalIdFieldName: '',
  geometryType: 'esriGeometryPoint',
  spatialReference: {wkid: 102100,
                     latestWkid: 3857},
  fields: [
    {name: 'Number_of_SUM', type: 'esriFieldTypeDouble',
     alias: 'Number_of_SUM', sqlType: 'sqlTypeFloat', domain: null, defaultValue: null},
    {name: 'Type', type: 'esriFieldTypeString', alias: 'Type',
     sqlType: 'sqlTypeNVarchar', length: 254, domain: null, defaultValue: null}
  ],
  features: [
    {attributes: {Number_of_SUM: 261, Type: 'Middle School'}},
    {attributes: {Number_of_SUM: 252, Type: 'Elementary School'}},
    {attributes: {Number_of_SUM: 184, Type: 'High School'}},
    {attributes: {Number_of_SUM: 159, Type: 'Middle School (7&8)'}},
    {attributes: {Number_of_SUM: 98, Type: 'K-8'}},
    {attributes: {Number_of_SUM: 31, Type: 'Junior/Senior High School'}},
    {attributes: {Number_of_SUM: 22, Type: 'Junior High School'}},
    {attributes: {Number_of_SUM: 3, Type: 'K-12'}},
    {attributes: {Number_of_SUM: 1, Type: 'Intermediate School'}},
    {attributes: {Number_of_SUM: 0, Type: 'Alternative School'}},
    {attributes: {Number_of_SUM: 0, Type: 'High School Annex'}},
    {attributes: {Number_of_SUM: 0, Type: 'Middle School High School'}},
    {attributes: {Number_of_SUM: 0, Type: 'Pre-K'}},
    {attributes: {Number_of_SUM: 0, Type: null}}
  ]
}

export default response
