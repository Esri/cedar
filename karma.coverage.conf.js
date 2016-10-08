// import base configuration
var base = require('./karma.conf');

module.exports = function(config) {
  // apply base settings
  base(config);
  // then override
  config.set({
    reporters: ['coverage'],

    preprocessors: {
      // TODO: when we point this at src, use:
      // 'src/**/*.js': 'coverage'
      'dist/**/*.js': 'coverage'
    },

    browsers: [
      'Chrome',
      'Firefox'
    ],

    // Configure the coverage reporters
    coverageReporter: {
      reporters:[
        {type: 'html', dir:'coverage/'},
        {type: 'text'}
      ]
    }
  });
};
