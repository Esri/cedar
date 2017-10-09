// NOTE: this standalone UMD build is still being run, but is not currently in use
// since this package is now bundled with cedar's UMD build
import json from 'rollup-plugin-json';

const pkg = require('../package.json');
const copyright = `/**
* ${pkg.name} - v${pkg.version} - ${new Date().toString()}
* Copyright (c) ${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
* ${pkg.license}
*/`;

// TODO: treat AmCharts as an external and don't use the global
export default {
  entry: 'compiled/index.js',
  moduleName: 'cedarAmCharts',
  format: 'umd',
  plugins: [json()],
  banner: copyright
};
