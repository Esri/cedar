const scatter = {
  type: 'xy',
  theme: 'calcite',
  valueAxes: [ {
      axisAlpha: 0.8,
      gridAlpha: 0.2,
      position: 'bottom',
    }, {
      axisAlpha: 0.8,
      gridAlpha: 0.2,
      position: 'left'
    } ],
  chartScrollbar: {
      scrollbarHeight: 5,
      offset: -1,
      backgroundAlpha: 0.1,
      backgroundColor: '#888888',
      selectedBackgroundColor: '#67b7dc',
      selectedBackgroundAlpha: 1,
      dragIconWidth: 15,
      dragIconHeight: 15,
    },
  chartCursor: {
      categoryBalloonEnabled: true,
      cursorAlpha: 0.3,
      valueLineAlpha: 0.3,
      valueLineBalloonEnabled: true
  },
  graphs: [{
    fillAlphas: 0,
    lineAlpha: 0,
    bullet: 'circle',
    bulletBorderAlpha: 0.2,
    bulletAlpha: 0.8,
    valueField: null,
    xField: null,
    yField: null,
  }],
  export: {
    enabled: true
  }
}

export default scatter
