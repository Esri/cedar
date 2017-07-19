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
  moduleName: 'cedar',
  format: 'umd',
  external: ['cedar-utils'],
  plugins: [json()],
  globals: {
    'cedar-utils': 'cedarUtils',
    'cedar-amcharts': 'cedarAmCharts',
    'cedar': 'cedar'
  },
  banner: copyright
};
