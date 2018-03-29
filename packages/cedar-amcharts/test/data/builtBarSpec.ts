/* tslint:disable */
const builtBarSpec = {
  "type": "serial",
  "rotate": false,
  "theme": "calcite",
  "chartCursor": {
    "categoryBalloonEnabled": false
  },
  "graphs": [
    {
      "type": "column",
      "title": "Number of Students",
      "valueField": "Number_of_SUM",
      "balloonText": "Number of Students [[Type]]: <b>[[Number_of_SUM]]</b>",
      "newStack": true
    }
  ],
  "legend": {
    "enabled": false
  },
  "valueAxes": [
    {
      "position": "left",
      "stackType": "regular",
      "title": "Number of Students"
    }
  ],
  "categoryAxis": {
    "title": "Type"
  },
  "export": {
    "enabled": true
  },
  "dataProvider": [],
  "categoryField": "Type"
}
/* tslint:enable */

export default builtBarSpec
