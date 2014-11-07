
module.exports = function(grunt) {

	// project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: '\n;\n\n'
			},
			dist: {
				src: [
					'js/Cryptii.js',
					'js/Cryptii/Adam.js',
					'js/Cryptii/*.js',
					'js/Cryptii/Format/Text.js',
					'js/Cryptii/Format/Decimal.js',
					'js/Cryptii/*/*.js',
					'js/Cryptii/*/*/*.js',
					'js/Cryptii/*/*/*/*.js',
				],
				dest: '../js/cryptii.js'
			}
		},
		uglify: {
			options: {
				banner: '//\n// <%= pkg.name %>\n// <%= grunt.template.today("yyyy-mm-dd") %>\n//\n'
			},
			build: {
				src: '../js/cryptii.js',
				dest: '../js/cryptii.min.js'
			}
		},
		sass: {
			options: {
				banner: '/*\n<%= pkg.name %>\n<%= grunt.template.today("yyyy-mm-dd") %>\n*/\n'
			},
			development: {
				files: {
					'../css/cryptii.css': 'sass/base.scss'
				}
			},
			production: {
				options: {
					style: 'compressed'
				},
				files: {
					'../css/cryptii.min.css': 'sass/base.scss'
				}
			}
		},
		watch: {
			js: {
				files: ['js/**/**/*.js'],
				tasks: ['concat', 'uglify']
			},
			sass: {
				files: [
					'sass/*.scss'
				],
				tasks: ['sass']
			},
			html: {
				files: ['*.html']
			}
		}
	});

	// plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// default tasks
	grunt.registerTask('default', ['concat', 'uglify', 'sass']);

};
