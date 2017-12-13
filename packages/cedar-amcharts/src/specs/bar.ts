export const bar = {
  type: 'serial',
  rotate: false,
  theme: 'calcite',
  chartCursor: {
    categoryBalloonEnabled: false
  },
  graphs: [{
    type: 'column',
    newStack: true
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
