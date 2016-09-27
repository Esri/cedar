import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.js',
  moduleName: 'Cedar',
  format: 'umd',
  external: ['d3', 'vg'],
  plugins: [json(), babel()],
  globals: {
    'arcgis-cedar': 'Cedar',
    'd3': 'd3'
  },
  dest: 'dist/bundle.js'
};
