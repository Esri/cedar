const builtBarSpec = {
  type: 'serial',
  rotate: false,
  graphs: [
    {
      fillAlphas: 0.2,
      lineAlpha: 0.8,
      type: 'column',
      color: '#000000',
      title: 'Number of Students',
      valueField: 'Number_of_SUM_0',
      balloonText: 'Number of Students [[categoryField]]: <b>[[Number_of_SUM_0]]</b>',
      labelText: '[[Number_of_SUM]]'
    }
  ],
  theme: 'light',
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
  gridAboveGraphs: false,
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
    guides: [],
    position: 'bottom',
    tickPosition: 'start',
    tickLength: 0
  },
  export: {
    enabled: true
  },
  dataProvider: [
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
  ],
  categoryField: 'categoryField',
  titleField: 'categoryField',
  valueField: 'Number_of_SUM_0'
}

export default builtBarSpec
