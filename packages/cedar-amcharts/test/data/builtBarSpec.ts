const builtBarSpec = {
  type: 'serial',
  graphs: [
    {
      fillAlphas: 0.2,
      lineAlpha: 0.8,
      type: 'column',
      color: '#000000',
      title: 'Number of Students',
      valueField: 'Number_of_SUM',
      balloonText: 'Number of Students [[categoryField]]: <b>[[Number_of_SUM]]</b>'
    }
  ],
  theme: 'dark',
  legend: {
    horizontalGap: 10,
    maxColumns: 1,
    position: 'right',
    useGraphSettings: true,
    markerSize: 10
  },
  valueAxes: [
    {
      gridColor: '#FFFFFF',
      gridAlpha: 0.2,
      dashLength: 0,
      stackType: 'regular'
    }
  ],
  gridAboveGraphs: true,
  startDuration: 0.3,
  startEffect: 'easeInSine',
  chartCursor: {
    categoryBalloonEnabled: false,
    cursorAlpha: 0,
    zoomable: false
  },
  categoryAxis: {
    axisColor: '#DADADA',
    gridAlpha: 0.07,
    gridPosition: 'start',
    tickPosition: 'start',
    tickLength: 20,
    guides: []
  },
  export: {
    enabled: true
  },
  dataProvider: [
    {
      categoryField: 'Middle School',
      Number_of_SUM: 261,
      Type: 'Middle School'
    },
    {
      categoryField: 'Elementary School',
      Number_of_SUM: 252,
      Type: 'Elementary School'
    },
    {
      categoryField: 'High School',
      Number_of_SUM: 184,
      Type: 'High School'
    },
    {
      categoryField: 'Middle School (7&8)',
      Number_of_SUM: 159,
      Type: 'Middle School (7&8)'
    },
    {
      categoryField: 'K-8',
      Number_of_SUM: 98,
      Type: 'K-8'
    },
    {
      categoryField: 'Junior/Senior High School',
      Number_of_SUM: 31,
      Type: 'Junior/Senior High School'
    },
    {
      categoryField: 'Junior High School',
      Number_of_SUM: 22,
      Type: 'Junior High School'
    },
    {
      categoryField: 'K-12',
      Number_of_SUM: 3,
      Type: 'K-12'
    },
    {
      categoryField: 'Intermediate School',
      Number_of_SUM: 1,
      Type: 'Intermediate School'
    },
    {
      categoryField: 'Alternative School',
      Number_of_SUM: 0,
      Type: 'Alternative School'
    },
    {
      categoryField: 'High School Annex',
      Number_of_SUM: 0,
      Type: 'High School Annex'
    },
    {
      categoryField: 'Middle School High School',
      Number_of_SUM: 0,
      Type: 'Middle School High School'
    },
    {
      categoryField: 'Pre-K',
      Number_of_SUM: 0,
      Type: 'Pre-K'
    }
  ],
  categoryField: 'categoryField',
  titleField: 'categoryField',
  valueField: 'Number_of_SUM'
}

export default builtBarSpec
