module.exports = function(grunt){

	function assembleBanner(libData){
		var str = "/*! ";
		str += libData.name + " " + libData.version + " <%= grunt.template.today('yyyy-mm-dd HH:mm') %>\n";
		str += "Copyright 2013-15 Massimo Foti (massimo@massimocorner.com) \n";
		str += "Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0 \n";
		str += "*/  \n";
		return str;
	}

	global.pkg = grunt.file.readJSON("package.json");

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		concat: {
			lugaTarget: {
				options: {
					separator: "\n\n"
				},
				src: ["src/luga.core.js", "src/luga.ajaxform.js", "src/luga.csi.js", "src/luga.validator.js"],
				dest: "dist/luga.js"
			}
		},

		uglify: {
			options: {
				sourceMap: true,
				mangle: false
			},
			ajaxformTarget: {
				options: {
					banner: assembleBanner(global.pkg.libs.ajaxform)
				},
				files: {
					"dist/luga.ajaxform.min.js": ["src/luga.ajaxform.js"]
				}
			},
			csiTarget: {
				options: {
					banner: assembleBanner(global.pkg.libs.csi)
				},
				files: {
					"dist/luga.csi.min.js": ["src/luga.csi.js"]
				}
			},
			coreTarget: {
				options: {
					banner: assembleBanner(global.pkg.libs.core)
				},
				files: {
					"dist/luga.core.min.js": ["src/luga.core.js"]
				}
			},
			validatorTarget: {
				options: {
					banner: assembleBanner(global.pkg.libs.validator)
				},
				files: {
					"dist/luga.validator.min.js": ["src/luga.validator.js"]
				}
			},
			lugaTarget: {
				options: {
					banner: assembleBanner(global.pkg.libs.luga),
					sourceMap: true,
					mangle: false
				},
				files: {
					"dist/luga.min.js": ["dist/luga.js"]
				}
			}
		},

		compress: {
			main: {
				options: {
					archive: "archive/luga-js.zip"
				},
				files: [
					{src: ["docs/**"]},
					{src: ["lib/**"]},
					{src: ["src/**"]},
					{src: ["dist/**"]},
					{src: ["test/**"]}
				]
			}
		}

	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Default task(s).
	grunt.registerTask("default", ["concat:lugaTarget", "uglify:lugaTarget", "uglify:ajaxformTarget", "uglify:csiTarget", "uglify:coreTarget", "uglify:validatorTarget", "compress"]);

};