module.exports = function(grunt) {
  grunt.initConfig({
  	watch 	: 	{
	    all 	:  	{
		    options 	: 	{ livereload: true },
		    files 		: 	[
				'js/**/*.js',
				'assets/views/**/*.jade' 
		    ],
		    tasks 		: 	[ 'jshint' ]
	    }
	}
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [ 'watch' ]);
};
