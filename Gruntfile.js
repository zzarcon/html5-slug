module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    watch: {
      game: {
        files: ['game/*'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      game: {
        options: {
          port: 9092,
          base: ['game']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect:game', 'watch']);
};