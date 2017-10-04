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
  moduleName: 'Cedar',
  format: 'umd',
  external: ['cedarAmCharts'],
  plugins: [json()],
  globals: {
    'cedar-amcharts': 'cedarAmCharts',
    'cedar': 'Cedar'
  },
  banner: copyright
};
