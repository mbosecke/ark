module.exports = function(grunt) {

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
			src: [
				'src/ark.js',
				'src/ark.error.js',
				'src/ark.logger.js',
				'src/ark.bus.js',
				'src/ark.singleton.js',
			],
			dest: 'build/ark.js'
		},
		jquery: {
			src: [
				'src/ark.js',
				'src/ark.error.js',
				'src/ark.logger.js',
				'src/ark.bus.js',
				'src/ark.singleton.js',
				'src/ark-jquery/ark.ajax.js',
				'src/ark-jquery/ark.dom.js',
				'src/ark-jquery/ark.event.js'
			],
			dest: 'build/ark-with-jquery-extension.js'
		}
	},
    uglify: {
      basic: {
        src: 'build/ark.js',
        dest: 'build/ark.min.js'
      },
	  jquery: {
		src: 'build/ark-with-jquery-extension.js',
		dest: 'build/ark-with-jquery-extension.min.js'
	  }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify')

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};