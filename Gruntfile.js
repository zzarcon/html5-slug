module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    concat: {
      application: {
        src: ['src/*'],
        dest: 'dist/app.js'
      },
      libraries: {
        src: ['dist/lib/zepto/zepto.js'],
        dest: 'dist/libraries.js'
      },
    },
    watch: {
      application: {
        files: ['src/*.js', 'demo/*.js'],
        tasks: ['compile'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      app: {
        options: {
          port: 9092,
          base: ['.', 'dist']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('compile', ['concat']);
  grunt.registerTask('default', ['connect:app', 'compile', 'watch']);
};