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
                , tasks: [ 'jade', 'uglify', 'usebanner' ]
        	}
    	}
        , banner: 
            '/**\n' +
            ' * Project: OBKK-client \n' +
            ' * Date: <%= grunt.template.today("dd-mm-yyyy HH-MM") %>\n' +
            ' * Author: <%= grunt.template.today("yyyy") %>  Mateusz Bagiński\n' +
            ' */\n'
        , usebanner: {
            dist: {
                options: {
                      position: 'top'
                    , banner: '<%= banner %>'
                    , linebreak: true
                    , process: function(filepath) {
                        this.banner = [
                              this.banner.slice(0, 4)
                            , ' File: <%= filename %>\n *'
                            , this.banner.slice(4)
                        ].join('');
                        return grunt.template.process(
                            this.banner,
                            { data: {
                                filename: filepath.match(/\/([^/]*)$/)[1]
                            } } );
                    }
                },
                files: {
                      src: [ 'build/**/*.js' ]
                }
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
        , 'grunt-banner'
    ];
    _.each(tasks, function(obj) {
        grunt.loadNpmTasks(obj);
    })
    grunt.registerTask('default', [ 'watch' ]);
};
