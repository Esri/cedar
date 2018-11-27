import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const pkg = require('../package.json');
const copyright = `/**
* ${pkg.name} - v${pkg.version} - ${new Date().toString()}
* Copyright (c) ${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${pkg.license}
*/`;

// TODO: treat AmCharts as an external and don't use the global
export default {
  input: 'dist/esm/index.js',
  output: {
    name: 'cedar',
    format: 'umd',
    globals: {
      '@esri/arcgis-rest-feature-service': 'arcgisRest'
    },
    banner: copyright
  },
  external: [
    '@esri/arcgis-rest-feature-service'
  ],
  // NOTE: using node resolve to bundle an older version of deepmerge
  // if we move to latest, we _may_ want to make that external instead
  plugins: [
    json(),
    resolve()
  ],
};
