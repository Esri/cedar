// var fs = require('fs');

/* jshint strict: false, camelcase: false */
module.exports = function(grunt) {
  var browsers = grunt.option('browser') ? grunt.option('browser').split(',') : ['PhantomJS'];

  // var copyright = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n' +
  //                 '*   Copyright (c) <%= grunt.template.today(\'yyyy\') %> Environmental Systems Research Institute, Inc.\n' +
  //                 '*   Apache License' +
  //                 '*/\n';

  var cedar_core = [
    'src/cedar.js',
  ];



  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '35'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '30'
    },
    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.9',
      version: '7.1'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: [
          'src/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'src/**/*.js',
          'spec/**/*.spec.js'
        ],
        tasks: ['jshint', 'concat', 'uglify', 'copy:scripts'],
        options: {
          spawn: false
        }
      },
      specs: {
        files: [
          'src/charts/*.json'
        ],
        tasks: ['copy:specs'],
        options: {
          spawn: false
        }
      },
      'docs-sass': {
        files: ['site/source/scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          nospawn: true
        }
      },
      'docs-js': {
        files: ['site/source/**/*.js'],
        tasks: ['copy:assemble'],
        options: {
          nospawn: true
        }
      },
      'docs-img': {
        files: ['site/source/img/**/*'],
        tasks: ['newer:imagemin'],
        options: {
          nospawn: true
        }
      },
      'docs-assemble': {
        files: ['site/source/**/*.md', 'site/source/**/*.hbs'],
        tasks: ['assemble:dev'],
        options: {
          nospawn: true
        }
      }
    },

    concat: {
      options: {
        sourceMap: true,
        separator: '\n\n'
      },
      core: {
        src: cedar_core,
        dest: 'dist/cedar.js'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        wrap: false,
        mangle:true,
        preserveComments: 'some',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/cedar.min.js': cedar_core
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      run: {
        reporters: ['progress'],
        browsers: browsers
      },
      coverage: {
        reporters: ['progress', 'coverage'],
        browsers: browsers,
        preprocessors: {
          'src/**/*.js': 'coverage'
        }
      },
      watch: {
        singleRun: false,
        autoWatch: true,
        browsers: browsers
      },
      sauce: {
        sauceLabs: {
          testName: 'Cedar Unit Tests'
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['progress', 'saucelabs'],
        singleRun: true
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true
        }
      },
      docs: {
        options: {
          port: 8081,
          hostname: '0.0.0.0',
          base: './site/build/'
        }
      }
    },

    assemble: {
      options: {
        layout: 'layout.hbs',
        layoutdir: 'site/source/layouts/',
        partials: 'site/source/partials/**/*.hbs',
        helpers: ['site/source/helpers/**/*.js' ]
      },
      dev: {
        options: {
          assets: 'site/build/'
        },
        files: [{
          cwd: 'site/source/pages',
          dest: 'site/build',
          expand: true,
          src: ['**/*.hbs', '**/*.md']
        }]
      },
      build: {
        options: {
          assets: 'cedar/'
        },
        files: [{
          cwd: 'site/source/pages',
          dest: 'site/build',
          expand: true,
          src: ['**/*.hbs', '**/*.md']
        }]
      }
    },

    copy: {
      assemble: {
        files: [
          { src: 'site/source/js/script.js', dest: 'site/build/js/script.js'},
          { expand: true, cwd: 'site/source/data/', src: '**/*.*', dest: 'site/build/data/'}
        ]
      },
      scripts: {
        files: [
          { expand: true, cwd: 'dist', src: '*.js*', dest: 'site/build/js/'},
          { expand: true, cwd: 'node_modules/d3', src: '*.js*', dest: 'site/build/js/'},
          { expand: true, cwd: 'node_modules/vega', src: '*.js*', dest: 'site/build/js/'}
        ]
      },
      specs: {
        files: [
          { expand: true, cwd: 'src/charts', src: '*.json', dest: 'site/build/js/charts'},
          { expand: true, cwd: 'src/charts', src: '*.json', dest: 'dist/charts'}
        ]
      }

    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'site/source/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'site/build/img'
        }]
      }
    },

    sass: {
      site: {
          files: [{
                    'expand': true,
                    'dest': 'site/build/css/',
                    'cwd': 'site/source/scss/',
                    'src': ['*'],
                    'ext': '.css',
                    'style': 'compressed'
                  }]
        }
    },

    'gh-pages': {
      options: {

        base: 'site/build'
        //,repo: 'git@github.com:esri/cedar.git'

      },
      src: ['**']
    },

    // s3: {
    //   options: {
    //     key: '<%= aws.key %>',
    //     secret: '<%= aws.secret %>',
    //     bucket: '<%= aws.bucket %>',
    //     access: 'public-read',
    //     headers: {
    //       // 1 Year cache policy (1000 * 60 * 60 * 24 * 365)
    //       'Cache-Control': 'max-age=630720000, public',
    //       'Expires': new Date(Date.now() + 63072000000).toUTCString()
    //     }
    //   },
    //   upload: {
    //     upload: [
    //       {
    //         src: 'dist/**/*',
    //         dest: 'esri-leaflet/<%= pkg.version %>/'
    //       }
    //     ]
    //   }
    // },

    releaseable: {
      release: {
        options: {
          remote: 'upstream',
          dryRun: grunt.option('dryRun') ? grunt.option('dryRun') : false,
          silent: false
        },
        src: [ 'dist/**/*.js','dist/**/*.map' ]
      }
    }
  });

  // var awsExists = fs.existsSync(process.env.HOME + '/esri-leaflet-s3.json');

  // if (awsExists) {
  //   grunt.config.set('aws', grunt.file.readJSON(process.env.HOME + '/esri-leaflet-s3.json'));
  // }

  // Development Tasks
  grunt.registerTask('default', ['docs']);
  grunt.registerTask('build', ['jshint', 'karma:coverage', 'concat', 'uglify', 'copy:specs']);
  grunt.registerTask('test', ['jshint', 'karma:run']);
  grunt.registerTask('publish', ['concat', 'uglify', 'copy:specs']);
  grunt.registerTask('release', ['releaseable', 's3']);
  grunt.registerTask('test:sauce', ['karma:sauce']);

  // Documentation Site Tasks
  grunt.registerTask('docs', ['assemble:dev', 'concat', 'uglify', 'sass', 'copy', 'imagemin', 'connect:docs', 'watch']);

  // Local built to site/build
  grunt.registerTask('docs:build', ['assemble:build', 'concat', 'uglify', 'sass','copy', 'imagemin']);

  // Push to GH Pages
  grunt.registerTask('docs:deploy', ['assemble:build', 'concat', 'uglify', 'sass','copy', 'imagemin', 'gh-pages']);

  // Require all grunt modules
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

};
