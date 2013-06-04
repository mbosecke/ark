module.exports = function(grunt) {

	var mainFiles = [
			'src/ark.js',
			'src/ark.error.js',
			'src/ark.logger.js',
			'src/ark.bus.js',
			'src/ark.singleton.js'
		], jqueryExtensionFiles = [
			'src/ark-jquery/ark.ajax.js',
			'src/ark-jquery/ark.dom.js',
			'src/ark-jquery/ark.event.js'
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
		},
		jquery: {
			src: [
				jqueryExtensionFiles
			],
			dest: 'build/ark.jquery.js'
		}
	},
	jshint: {
		basic: mainFiles,
		jquery: jqueryExtensionFiles
	},
    uglify: {
      basic: {
        src: 'build/ark.js',
        dest: 'build/ark.min.js'
      },
	  jquery: {
		src: 'build/ark.jquery.js',
		dest: 'build/ark.jquery.min.js'
	  }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'jshint']);

};