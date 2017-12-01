const spec = {
  type: 'bar',
  datasets: [
    {
      url: 'https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Public_Schools_in_Onondaga_County/FeatureServer/0',
      query: {
        orderByFields: 'Number_of_SUM DESC',
        groupByFieldsForStatistics: 'Type',
        outStatistics: [
          {
            statisticType: 'sum',
            onStatisticField: 'Number_of',
            outStatisticFieldName: 'Number_of_SUM'
          }
        ]
      }
    }
  ],
  series: [
    {
      category: {field: 'Type', label: 'Type'},
      value: {field: 'Number_of_SUM', label: 'Number of Students'}
    }
  ],
  overrides: {
    categoryAxis: {
      labelRotation: -45
    },
    graphs: [{
      balloonText: `[[categoryField]]: <b>[[Number_of_SUM]]</b>`
    }]
  }
}

const data = [
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

const realData = [
  {
    categoryField: 'Middle School',
    Number_of_SUM_0: 261,
    Type_0: 'Middle School'
  },
  {
    categoryField: 'Elementary School',
    Number_of_SUM_0: 252,
    Type_0: 'Elementary School'
  },
  {
    categoryField: 'High School',
    Number_of_SUM_0: 184,
    Type_0: 'High School'
  },
  {
    categoryField: 'Middle School (7&8)',
    Number_of_SUM_0: 159,
    Type_0: 'Middle School (7&8)'
  },
  {
    categoryField: 'K-8',
    Number_of_SUM_0: 98,
    Type_0: 'K-8'
  },
  {
    categoryField: 'Junior/Senior High School',
    Number_of_SUM_0: 31,
    Type_0: 'Junior/Senior High School'
  },
  {
    categoryField: 'Junior High School',
    Number_of_SUM_0: 22,
    Type_0: 'Junior High School'
  },
  {
    categoryField: 'K-12',
    Number_of_SUM_0: 3,
    Type_0: 'K-12'
  },
  {
    categoryField: 'Intermediate School',
    Number_of_SUM_0: 1,
    Type_0: 'Intermediate School'
  },
  {
    categoryField: 'Alternative School',
    Number_of_SUM_0: 0,
    Type_0: 'Alternative School'
  },
  {
    categoryField: 'High School Annex',
    Number_of_SUM_0: 0,
    Type_0: 'High School Annex'
  },
  {
    categoryField: 'Middle School High School',
    Number_of_SUM_0: 0,
    Type_0: 'Middle School High School'
  },
  {
    categoryField: 'Pre-K',
    Number_of_SUM_0: 0,
    Type_0: 'Pre-K'
  }
]

const barSpec = {
  spec,
  data,
  realData
}

export default barSpec
