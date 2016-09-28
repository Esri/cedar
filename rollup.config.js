import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const pkg = require('./package.json');
const copyright = `/**
* ${pkg.name} - v${pkg.version} - ${new Date().toString()}
* Copyright (c) ${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${pkg.license}
*/`;

export default {
  entry: 'src/index.js',
  moduleName: 'Cedar',
  format: 'umd',
  external: ['d3', 'vg'],
  plugins: [json(), babel()],
  globals: {
    'arcgis-cedar': 'Cedar',
    'd3': 'd3',
    'vega': 'vg'
  },
  banner: copyright,
  dest: 'dist/bundle.js'
};
