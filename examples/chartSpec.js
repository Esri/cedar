// Feature layer
const featureLayer = {
  "url": "<fs-url>",
  "title": "blahblah",
  "id": "123455",
  "layerType": "ArcGISFeatureLayer",
  "visibility": true,
  "opacity": 1,
  "layerDefinition": {
    "charts": [{chartSpec}] // Not sure if charts lives in layerDefinition or at the top level
  }
};

// Chart
const chartSpec = {
  type: 'chart',
  name: 'blah', // point of the difference between name and title?
  title: 'blah',
  subTitle: 'blah blah blah',
  footer: 'string',
  theme: 'string' // What goes here?
  series: [chartSeriesSpec], // Types: scatter, bar, line, histogram, etc
  legend: [chartLegendSpec], // chart legend object
  axes: [chartAxesSpec], // chart axes object
  metadata: 'string' // what would be contained here
};

// legend spec
const chartLegendSpec = {
  type: 'chartLegend',
  // chart legend
  visible: true, // boolean default is true
  title: 'string',
  alignment: 'left|right|top|bottom',
  valueFormat: 'string' // What is?
};

// axis
const chartAxisSpec = {
  type: 'chartAxis',
  // chart axis
  id: 'unique-axis-id' // not needed, I don't think
  visible: true, // boolean default true
  isLogarithmic: false, // boolean default false - how would this play in for us
  title: 'string',
  valueFormat: 'string', // ??
  dateTimeFormat: 'string',
  calculateAutomaticMinimum: true, //boolean default true
  calculateAutomaticMaximum: true, // boolean default true
  minimum: 'number',
  maximum: 'number'
};

// chart series

// scatter series
const scatterChartSeriesSpec = {
  type: 'scatterSeries',

  // chartSeries
  title: 'string',

  query: {
    where: 'where-clause',

    outStatistics: [{
      onStatisticField: 'fs_field_name', // actual field name from the data
      statisticType: '<count | sum | min | max | avg | stddev | var>', // what is var?
      outStatisticFieldName: 'uniqueFieldName'
    }], // other outstatistics here

    groupByFieldsForStatistics: 'field1,field2',
    orderByFields: 'field1,field2'
  },

  x: 'field-name',
  y: 'field-name',

  showLabels: false, // boolean default false
  horizontalAxisId: 'axis-id',
  verticalAxisId: 'axis-id',

  colorType: 'singleColor|colorMatch', // default singleColor could inherit site colors here

  // scatterSeries
  markerSymbol: {esriSMS}, // would have to toss and bring in our own

  // future concepts.....
  visualVariables: [{}] // specifics to chart
};

// bar series
const barSeriesSpec = {
  type: 'barSeries',

  // chartSeries
  title: 'string',

  query: {
    where: 'where-clause',

    outStatistics: [{
      onStatisticField: 'fs_field_name', // actual field name from the data
      statisticType: '<count | sum | min | max | avg | stddev | var>', // what is var?
      outStatisticFieldName: 'uniqueFieldName'
    }], // other outstatistics here

    groupByFieldsForStatistics: 'field1,field2',
    orderByFields: 'field1,field2'
  },

  x: 'field-name',
  y: 'field-name',

  showLabels: false, // boolean default false
  horizontalAxisId: 'axis-id',
  verticalAxisId: 'axis-id',

  colorType: 'singleColor|colorMatch', // default singleColor could inherit site colors here

  // barSeries
  multipleBarType: 'none|sideBySide|stacked|stacked100', // what is stacked100?
  barSize: 'long', //default: 90 ??????
  fillSymbol: {esriSFS} // Pull in our own stuff
};

// line series
const lineSeriesSpec = {
  type: 'lineSeries',

  // chartSeries
  title: 'string',

  query: {
    where: 'where-clause',

    outStatistics: [{
      onStatisticField: 'fs_field_name', // actual field name from the data
      statisticType: '<count | sum | min | max | avg | stddev | var>', // what is var?
      outStatisticFieldName: 'uniqueFieldName'
    }], // other outstatistics here

    groupByFieldsForStatistics: 'field1,field2',
    orderByFields: 'field1,field2'
  },

  x: 'field-name',
  y: 'field-name',

  showLabels: false, // boolean default false
  horizontalAxisId: 'axis-id',
  verticalAxisId: 'axis-id',

  colorType: 'singleColor|colorMatch', // default singleColor could inherit site colors here

  // lineSeries
  lineSymbol: {esriSLS},
  markerSymbol: {esriSMS} // need to figure out how to translate into our own
};

// histogram series
const histogramSeriesSpec = {
  type: 'histogramSeries',

  // chartSeries
  title: 'string',

  query: {
    where: 'where-clause',

    outStatistics: [{
      onStatisticField: 'fs_field_name', // actual field name from the data
      statisticType: '<count | sum | min | max | avg | stddev | var>', // what is var?
      outStatisticFieldName: 'uniqueFieldName'
    }], // other outstatistics here

    groupByFieldsForStatistics: 'field1,field2',
    orderByFields: 'field1,field2'
  },

  x: 'field-name',
  y: 'field-name',

  showLabels: false, // boolean default false
  horizontalAxisId: 'axis-id',
  verticalAxisId: 'axis-id',

  colorType: 'singleColor|colorMatch', // default singleColor could inherit site colors here

  //histogramSeries
  binCount: 'long', // default 8
  showMean: false, // boolean default false
  showMediam: false, // boolean default false
  showStandardDeviation: false, // boolean default false
  fillSymbol: {esriSFS},
  meanLineSymbol: {esriSLS},
  medianLineSymbol: {esriSLS},
  standardDeviationSymbol: {esriSFS}
};
