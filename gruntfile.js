module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		uglify: {
			ajaxify: {
				files: {
					'public/js/ajaxify.min.js': ['src/ajaxify.js'],
				},
				options: {
					banner: '/*\n' +
					' * TwentySix ajaxify module.\n' +
					' * Copyright <%= grunt.template.today("yyyy") %> OhByeongYun.\n' +
					' *\n' +
					' * last compiled: <%= grunt.template.today("yyyy-mm-dd") %>.\n' +
					' */\n'
				}
			},
			twentysix: {
				files: {
					'public/js/twentysix.min.js': ['src/twentysix.js']
				},
				options: {
					banner: '/*\n' +
					' * TwentySix.\n' +
					' * Copyright <%= grunt.template.today("yyyy") %> OhByeongYun.\n' +
					' *\n' +
					' * last compiled: <%= grunt.template.today("yyyy-mm-dd") %>.\n' +
					' */\n'
				}
			}
		},
		watch: {
			ajaxify: {
				files: ['src/ajaxify.js'],
				tasks: ['uglify:ajaxify']
			},
			twentysix: {
				files: ['src/twentysix.js'],
				tasks: ['uglify:twentysix']
			}
		},
		express: {
			dev: {
				options: {
					port: 9000,
					hostname: 'localhost',
					bases: [__dirname, 'app/views/'],
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dev', ['watch']);
};