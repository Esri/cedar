const area = {
  type: 'serial',
  theme: 'calcite',
  chartCursor: {
    categoryBalloonEnabled: false,
    valueLineBalloonEnabled: true
  },
  graphs: [{
    bullet: 'circle',
    bulletAlpha: 1,
    bulletBorderAlpha: 0.8,
    bulletBorderThickness: 0,
    dashLengthField: 'dashLengthLine',
    fillAlphas: 0.5,
    useLineColorForBulletBorder: true
  }],
  legend: {
    horizontalGap: 10,
    position: 'bottom',
    useGraphSettings: true,
    markerSize: 10
  },
  valueAxes: [ {
    stackType: 'regular'
  } ],
  export: {
    enabled: true
  }
}

export default area
