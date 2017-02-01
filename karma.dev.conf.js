// import base configuration
var base = require('./karma.conf');
var json = require('rollup-plugin-json');
var buble =require('rollup-plugin-buble');


module.exports = function(config) {
  // apply base settings
  base(config);
  // then override
  config.set({
    // list of files / patterns to load in the browser
    files: [
      'node_modules/d3/d3.js',
      'node_modules/vega/vega.js',
      'test/spec/**/*.spec.js',
      { pattern: 'src/utils/**/*.js', included: false, served: false },
      { pattern: 'src/charts/**/*.json', included: false, served: true },
      'src/cedar.js',
    ],

    preprocessors: {
     'src/cedar.js': ['rollup']
    },

    reporters: ['mocha'],

    // Configure the plugins
    rollupPreprocessor: {
      // rollup settings. See Rollup documentation
      moduleName: 'Cedar',
      // format: 'umd',
      format: 'iife',
      external: ['d3', 'vega'],
      plugins: [json(), buble()],
      globals: {
        'arcgis-cedar': 'Cedar',
        'd3': 'd3',
        'vega': 'vg'
      },
      // will help to prevent conflicts between different tests entries
      sourceMap: 'inline'
    },

    mochaReporter: {
      showDiff: true
    },

    // re-run when files are changed
    singleRun: false
  });
};
