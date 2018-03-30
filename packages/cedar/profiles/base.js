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
  entry: 'dist/esm/index.js',
  moduleName: 'cedar',
  format: 'umd',
  external: ['@esri/arcgis-rest-feature-service'],
  globals: {
    '@esri/arcgis-rest-feature-service': 'arcgisRest'
  },
  // NOTE: using node resolve to bundle an older version of deepmerge
  // if we move to latest, we _may_ want to make that external instead
  plugins: [json(), resolve()],
  banner: copyright
};
