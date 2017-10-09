import json from 'rollup-plugin-json';
// import buble from 'rollup-plugin-buble';

const pkg = require('../package.json');
const copyright = `/**
* ${pkg.name} - v${pkg.version} - ${new Date().toString()}
* Copyright (c) ${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${pkg.license}
*/`;

export default {
  entry: 'compiled/index.js',
  external: ['amcharts3', 'cedar'],
  moduleName: 'cedarAmCharts',
  format: 'umd',
  plugins: [json()],
  globals: {
    'cedar': 'Cedar',
    'amcharts3': 'AmCharts',
  },
  banner: copyright
};
