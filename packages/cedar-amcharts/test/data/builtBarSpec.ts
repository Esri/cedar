/* tslint:disable */
const builtBarSpec = {
  "type": "serial",
  "rotate": false,
  "theme": "calcite",
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "valueLineBalloonEnabled": true,
    "valueLineEnabled": false
  },
  "graphs": [{
    "type": "column",
    "title": "Number of Students",
    "valueField": "Number_of_SUM",
    "balloonText": "Number of Students [[undefined]]: <b>[[Number_of_SUM]]</b>",
    "labelText": "[[Number_of_SUM]]"
  }],
  "legend": {},
  "valueAxes": [{
    "stackType": "regular"
  }],
  "export": {
    "enabled": true
  },
  "titleField": "categoryField",
  "valueField": "Number_of_SUM"
}
/* tslint:enable */

export default builtBarSpec
