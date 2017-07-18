const bar = {
  type: 'serial',
  graphs: [{
    fillAlphas: 0.2,
    lineAlpha: 0.8,
    type: 'column',
    color: '#000000'
  }],
  theme: 'dark',
  legend: {
    horizontalGap: 10,
    maxColumns: 1,
    position: 'right',
    useGraphSettings: true,
    markerSize: 10
  },
  valueAxes: [ {
    gridColor: '#FFFFFF',
    gridAlpha: 0.2,
    dashLength: 0,
    stackType: 'regular'
  } ],
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
    // gridAlpha: 0,
    tickPosition: 'start',
    tickLength: 20,
    guides: []
  },
  export: {
    enabled: true
  }
}

export default bar
