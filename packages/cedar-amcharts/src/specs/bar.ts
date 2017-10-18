export const bar = {
  type: 'serial',
  rotate: false,
  theme: 'calcite',
  chartCursor: {
    categoryBalloonEnabled: false,
    valueLineBalloonEnabled: true,
    valueLineEnabled: false
  },
  graphs: [{
    type: 'column',
  }],
  legend: {},
  valueAxes: [ {
    stackType: 'regular'
  } ],
  export: {
    enabled: true
  }
}

export default bar
