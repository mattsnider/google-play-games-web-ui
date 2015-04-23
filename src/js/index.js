/**
 * The JS for the testing index page. No JS for the UI modules should be put here.
 */

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: '../src/js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/main']);