const line = {
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
    // bulletColor: '#FFFFFF',
    dashLengthField: 'dashLengthLine',
    fillAlphas: 0,
    useLineColorForBulletBorder: true
  }],
  legend: {
    // horizontalGap: 10,
    position: 'bottom',
    useGraphSettings: true
  },
  export: {
    enabled: true
  }
}

export default line
