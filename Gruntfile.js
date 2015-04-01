var _ = require('underscore');
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            all: {
                  options: { livereload: true }
                , files: [ 
                      'js/**/*.js'
                    , 'assets/views/**/*.jade'
                    , 'assets/less/**/*.less' 
                ]
                , tasks: [ 'jade', 'uglify' ]
        	}
    	}
        , jade: {
            compile: {
                options: {
                    data: { debug: false }
                }
                , files: [ {
                      cwd: 'assets/views'
                    , src: '**/*.jade'
                    , dest: 'build/views'
                    , expand: true
                    , ext: '.html'
                } ]
            }
        }
        , uglify: {
              options: { mangle: false }
            , my_target: {
                files: [ {
                     cwd: 'js'
                    , src: '**/*.js'
                    , dest: 'build/js'
                    , expand: true
                    , ext: '.js'
                } ]
            }
        }
    });
    var tasks = [
          'grunt-contrib-watch'
        , 'grunt-contrib-jade'
        , 'grunt-contrib-uglify'
    ];
    _.each(tasks, function(obj) {
        grunt.loadNpmTasks(obj);
    })
    grunt.registerTask('default', [ 'watch' ]);
};
