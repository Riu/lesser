module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
          development: {
            files: {
              "public/themes/default/css/style.css": "less/themes/default/style.less",
              "public/themes/dashboard/css/style.css": "less/themes/dashboard/style.less",
            }
          },
        },
        watch: {
            less: {
                files: ['less/**/*.less', 'less/**/*.overrides', 'less/**/*.variables', 'less/**/*.config', 'less/**/*.mixins'],
                tasks: ['less'],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less','watch']);

};
