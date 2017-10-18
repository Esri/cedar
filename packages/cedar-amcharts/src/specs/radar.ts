const radar = {
  type: 'radar',
  valueAxes: [{
    gridType: 'circles',
    minimum: 0
  }],
  polarScatter: {
    minimum: 0,
    maximum: 400,
    step: 1
  },
  startDuration: 0,
  graphs: [{ graphFillAlpha: 0}],
  groupPercent: 5,
  balloon: {
     fixedPosition: true
    },
  legend: {
    position: 'right',
    marginRight: 100,
    autoMargins: false
  },
}

export default radar
