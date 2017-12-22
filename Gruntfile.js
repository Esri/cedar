// var fs = require('fs');

/* jshint strict: false, camelcase: false */
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    watch: {

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
          port: 8082,
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
          assets: '/'
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

    surge: {
      'cedar-v0': {
        options: {
          // The path or directory to your compiled project
          project: 'site/build',
          // The domain or subdomain to deploy to
          domain: 'cedar-v0.surge.sh'
        }
      }
    }

  });

  // Development Tasks
  grunt.registerTask('default', ['docs']);

  // Documentation Site Tasks
  grunt.registerTask('docs', ['assemble:dev', 'sass', 'copy', 'imagemin', 'connect:docs', 'watch']);

  // Local built to site/build
  grunt.registerTask('docs:build', ['assemble:build', 'sass','copy', 'imagemin']);

  // Push to GH Pages
  grunt.registerTask('docs:deploy', ['assemble:build', 'sass','copy', 'imagemin', 'surge']);

  // Require all grunt modules
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});
};
