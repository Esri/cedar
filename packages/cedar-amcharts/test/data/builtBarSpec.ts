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
  "dataProvider": [
    {
      "categoryField": "Middle School",
      "Number_of_SUM_0": 261,
      "Type_0": "Middle School"
    },
    {
      "categoryField": "Elementary School",
      "Number_of_SUM_0": 252,
      "Type_0": "Elementary School"
    },
    {
      "categoryField": "High School",
      "Number_of_SUM_0": 184,
      "Type_0": "High School"
    },
    {
      "categoryField": "Middle School (7&8)",
      "Number_of_SUM_0": 159,
      "Type_0": "Middle School (7&8)"
    },
    {
      "categoryField": "K-8",
      "Number_of_SUM_0": 98,
      "Type_0": "K-8"
    },
    {
      "categoryField": "Junior/Senior High School",
      "Number_of_SUM_0": 31,
      "Type_0": "Junior/Senior High School"
    },
    {
      "categoryField": "Junior High School",
      "Number_of_SUM_0": 22,
      "Type_0": "Junior High School"
    },
    {
      "categoryField": "K-12",
      "Number_of_SUM_0": 3,
      "Type_0": "K-12"
    },
    {
      "categoryField": "Intermediate School",
      "Number_of_SUM_0": 1,
      "Type_0": "Intermediate School"
    },
    {
      "categoryField": "Alternative School",
      "Number_of_SUM_0": 0,
      "Type_0": "Alternative School"
    },
    {
      "categoryField": "High School Annex",
      "Number_of_SUM_0": 0,
      "Type_0": "High School Annex"
    },
    {
      "categoryField": "Middle School High School",
      "Number_of_SUM_0": 0,
      "Type_0": "Middle School High School"
    },
    {
      "categoryField": "Pre-K",
      "Number_of_SUM_0": 0,
      "Type_0": "Pre-K"
    }
  ],
  "categoryField": "Type"
}
/* tslint:enable */

export default builtBarSpec
