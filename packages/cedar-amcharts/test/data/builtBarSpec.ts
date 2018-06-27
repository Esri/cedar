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
      "balloonText": "<div>Type: [[Type]]</div><div>Number of Students: [[Number_of_SUM]]</div>",
      "newStack": true
    }
  ],
  "legend": {
    "enabled": false,
    "valueAlign": "left",
    "spacing": 25
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
