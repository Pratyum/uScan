// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('scanner', [
  'ionic',
  'ngCordova',
  'scanner.controllers'
])

  .constant('List', {
    url: 'http://localhost:8100/list/'
  })
  .constant('RealList', {
    url: 'http://172.21.147.177:8000/list/'
  })
  .constant('Register', {
    url: 'http://172.21.147.177:8000/register/'
  })
  .constant('Check', {
    url: 'http://localhost:8100/check/'
  })
  .constant('RealCheck',{
    url:'172.21.147.177:8000/check/'
  })
  .service('eventName', function() {
    this.eventName = "";
    this.eventCode = "";

  })


  .run(function($rootScope, $ionicPlatform, $cordovaStatusbar) {

    $ionicPlatform.ready(function() {

      // Hide the accessory bar by default
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      // Color the iOS status bar text to white
      if (window.StatusBar) {
        $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusBar.style(1); //Light
      }

      // Default update checking
      $rootScope.updateOptions = {
        interval: 2 * 60 * 1000
      };

    });
  })

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      //   .state('login', {
      //   url: "/login",
      //   templateUrl: "templates/login.html",
      //   controller:"LoginCtrl"
      // })
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      // Welcome tab
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeController as vm'
          }
        }
      })

      .state('tab.all', {
        url: '/all',
        views: {
          'tab-all': {
            templateUrl: 'templates/tab-list.html',
            controller: 'ListController'
          }
        }
      });
////////////
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

  });
