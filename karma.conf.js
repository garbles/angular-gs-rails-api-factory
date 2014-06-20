module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-gs-apibase/build/angular-gs-apibase.js',
      'bower_components/angular-gs-to-snake-case/build/angular-gs-to-snake-case.js',
      'build/**/*.js',
      'build/*.js',
      'test/**/*_spec.js',
      'test/*_spec.js'
    ],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Firefox'],
    captureTimeout: 60000,
    singleRun: false
  });
};
