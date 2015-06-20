var _ = require('underscore');
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            all: {
                  options: { livereload: true }
                , files: [ 
                      'ts/**/*.ts'
                    , 'views/**/*.jade'
                    , 'data/less/**/*.less' 
                ]
                , tasks: [ 'typescript', 'uglify', 'usebanner', 'less', 'wiredep', 'jade' ]
        	}
    	}
        , less: {
            development: {
                  options: {
                      compress: true
                    , yuicompress: true
                    , optimization: 2
                }
                , files: {
                    'build/css/page.css': 'data/less/main.less'
                }
            }
        }
        , wiredep: {
            task: {
                  src: [ 'views/template.jade' ]
                , dependencies: true
                , devDependencies: false
            }
        }
        , banner: 
            '/**\n' +
            ' * Project: OBKK-client \n' +
            ' * Date: <%= grunt.template.today("dd-mm-yyyy HH-MM") %>\n' +
            ' * Author: <%= grunt.template.today("yyyy") %>  Mateusz Bagiński\n' +
            ' */'
        , usebanner: {
            dist: {
                options: {
                      position: 'top'
                    , banner: '<%= banner %>'
                    , linebreak: true
                    , process: function(filepath) {
                        this.banner = [
                              this.banner.slice(0, 4)
                            , ' * File: <%= filename %>\n'
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
                      src: [ 'build/js/**/*.js' ]
                }
            }
        }
        , jade: {
            compile: {
                options: {
                    data: { debug: false }
                }
                , files: [ {
                      cwd: 'views'
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
                      cwd: 'build/js'
                    , src: '**/*.js'
                    , dest: 'build/js'
                    , expand: true
                    , ext: '.js'
                } ]
            }
        }
        , typescript: {
            base: {
                  src: [ 'ts/**/*.ts' ]
                , dest: 'build/js/app.js'
                , options: {
                    target: 'es5'
                }
            }
        }
    });
    var tasks = [
          'grunt-contrib-watch'
        , 'grunt-contrib-jade'
        , 'grunt-contrib-less'
        , 'grunt-typescript'
        , 'grunt-contrib-uglify'
        , 'grunt-banner'
        , 'grunt-wiredep'
    ];
    _.each(tasks, function(obj) {
        grunt.loadNpmTasks(obj);
    })
    grunt.registerTask('default', [ 'watch' ]);
};
