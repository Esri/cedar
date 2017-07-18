const line = {
  type: 'serial',
  theme: 'light',
  graphs: [{
    fillAlphas: 0,
    lineAlpha: 1,
    dashLengthField: 'dashLengthLine',
    useLineColorForBulletBorder: true,
    bulletBorderThickness: 3,
    bullet: 'circle',
    bulletBorderAlpha: 0.8,
    bulletAlpha: 0.8,
    bulletColor: '#FFFFFF',
  }],
  legend: {
    horizontalGap: 10,
    position: 'bottom',
    useGraphSettings: true,
    markerSize: 10
  },
  valueAxes: [ {
    gridColor: '#FFFFFF',
    gridAlpha: 0.2,
    dashLength: 0,
  } ],
  gridAboveGraphs: true,
  startDuration: 0.1,
  startEffect: 'easeInSine',
  chartCursor: {
    categoryBalloonEnabled: false,
    cursorAlpha: 0,
    zoomable: false
  },
  categoryAxis: {
    gridPosition: 'start',
    gridAlpha: 0,
    tickPosition: 'start',
    tickLength: 20,
    guides: []
  },
  export: {
    enabled: true
  }
}

export default line
