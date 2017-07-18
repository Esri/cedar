const scatter = {
  type: 'xy',
  autoMarginOffset: 20,
  startDuration: 0,
  valueAxes: [ {
      position: 'bottom',
      axisAlpha: 0
    }, {
      axisAlpha: 0,
      position: 'left'
    } ],
  chartScrollbar: {
      scrollbarHeight: 2,
      offset: -1,
      backgroundAlpha: 0.1,
      backgroundColor: '#888888',
      selectedBackgroundColor: '#67b7dc',
      selectedBackgroundAlpha: 1
    },
  chartCursor: {
      fullWidth: true,
      valueLineEabled: true,
      valueLineBalloonEnabled: true,
      valueLineAlpha: 0.5,
      cursorAlpha: 0
    },
  graphs: [{
    fillAlphas: 0,
    lineAlpha: 0,
    bullet: 'circle',
    bulletBorderAlpha: 0.2,
    bulletAlpha: 0.8,
    color: '#000000',
    valueField: null,
    xField: null,
    yField: null,
  }]
}

export default scatter
