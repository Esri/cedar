$(function () {

  var chart = new Cedar({"type": "bar"});

  var dataset = {
    "url":"http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Education_WebMercator/MapServer/5",
    "query": {
      "groupByFieldsForStatistics": "FACUSE",
      "outStatistics": [{
        "statisticType": "sum", 
        "onStatisticField": "TOTAL_STUD", 
        "outStatisticFieldName": "TOTAL_STUD_SUM"
      }]
    },
    "mappings":{
      "sort": "TOTAL_STUD_SUM DESC",
      "x": {"field":"FACUSE","label":"Facility Use"},
      "y": {"field":"TOTAL_STUD_SUM","label":"Total Students"}
    }
  };

  chart.tooltip = {
    "title": "{FACUSE}",
    "content": "{TOTAL_STUD_SUM} Students in {FACUSE}"
  }

  chart.dataset = dataset;

  chart.show({
    elementId: "#chart",
    autolabels: true,
    renderer: "svg"
  });

});