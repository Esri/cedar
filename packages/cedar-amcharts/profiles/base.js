// NOTE: this standalone UMD build is still being run, but is not currently in use
// since this package is now bundled with cedar's UMD build
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
  // TODO: reconsider name after https://github.com/Esri/cedar/issues/279#issuecomment-335170913
  output: {
    name: 'cedarAmCharts',
    format: 'umd',
    exports: 'named',
    banner: copyright
  },
  
  // NOTE: using node resolve to bundle an older version of deepmerge
  // if we move to latest, we _may_ want to make that external instead
  plugins: [json(), resolve()]
};
