import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
const pkg = require('../package.json');
const copyright = `/**
* ${pkg.name} - v${pkg.version} - ${new Date().toString()}
* Copyright (c) ${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${pkg.license}
*/`;

export default {
  entry: 'src/cedar.js',
  moduleName: 'Cedar',
  format: 'umd',
  external: ['d3', 'vega'],
  plugins: [json(), buble()],
  globals: {
    'arcgis-cedar': 'Cedar',
    'd3': 'd3',
    'vega': 'vg'
  },
  banner: copyright
};
