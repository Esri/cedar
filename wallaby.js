module.exports = function (wallaby) {
  return {
    files: [
      // Test library
      // { pattern: 'node_modules/mocha/mocha.js', instrument: false },
      { pattern: 'node_modules/chai/chai.js', instrument: false },
      { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
      { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
      { pattern: 'node_modules/d3/d3.js', instrument: false},
      { pattern: 'node_modules/vega/vega.js', instrument: false },
      'src/**/*.js',
      { pattern: 'spec/**/*spec.js', ignore: true}
    ],
    tests: [
      'spec/**/*spec.js'
    ],

    testFramework: 'mocha',

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    env: {
      runner: require('/Users/ben7664/.atom/packages/atom-wallaby/node_modules/phantomjs').path,
      params: { runner: '--web-security=false' }
    },

    debug: true
  };
};
