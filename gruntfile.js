module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nwjs: {
            options: {
                platforms: ['win', 'osx64', 'linux'],
                buildDir: './webkitbuilds'
            },
            src: ['./src/**/*']
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.registerTask('default', ['nwjs']);

};