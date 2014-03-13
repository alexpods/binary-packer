"use strict";

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            dev: {
                dest: "dist/<%= pkg.name %>.js",
                src: [
                    "src/_prefix",
                    "src/helpers.js",

                    "src/Packer.js",
                    "src/DataType/*.js",

                    "src/_suffix"
                ],
                options: {
                    separator: '\n\n'
                }
            }
        },
        uglify: {
            min: {
                options: {
                    mangle: true,
                    compress: {
                        unused: false
                    },
                    report: 'gzip',
                    sourceMap: 'dist/<%= pkg.name %>.min.map',
                    preserveComments: false
                },
                dest: "dist/<%= pkg.name %>.min.js",
                src:  "<%= concat.dev.dest %>"
            }
        }
    });

    grunt.registerTask('default', ['concat', 'uglify']);
};