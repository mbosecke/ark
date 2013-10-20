module.exports = function(grunt) {

	var mainFiles = [
			'src/ark.js',
			'src/ark.error.js',
			'src/ark.logger.js',
			'src/ark.bus.js',
			'src/ark.singleton.js'
		];

  // Project configuration.
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
	concat: {
		options:{
			stripBanners: true,
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},
		basic: {
			src: mainFiles,
			dest: 'build/ark.js'
		}
	},	
	qunit: {
		all: ['test/index.html']
	},
	jshint: {
		main: mainFiles
	},
    uglify: {
    	main: {
    		src: 'build/ark.js',
    		dest: 'build/ark.min.js'
    	}
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task(s).
  grunt.registerTask('test', [ 'concat', 'qunit']);
  grunt.registerTask('default', [ 'concat', 'qunit', 'uglify', 'jshint']);

};