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
  entry: 'compiled/index.js',
  moduleName: 'Cedar',
  format: 'umd',
  plugins: [json(), resolve()],
  banner: copyright
};
