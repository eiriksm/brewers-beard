;(function(angular) {
  'use strict';
  angular.module('brewersBeard', [
      //'ngTouch',
      'ngRoute',
      'ngAnimate',
      'ngResource',
      'brewersBeard.controllers',
      'brewersBeard.services',
      'primus',
      'brewClockDirective'
  ]).
  config(function($routeProvider, $locationProvider, primusProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/brew', {
      templateUrl: '/js/components/brew/brew.html',
      controller: 'brewCtrl'});
    $routeProvider.when('/brew/:id', {
      templateUrl: '/js/components/brew/brew.html',
      controller: 'brewCtrl'});
    $routeProvider.when('/', {
      templateUrl: '/js/components/index/main.html',
      controller: 'mainCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
    primusProvider
      // Define Primus endpoint.
      .setEndpoint()
      // Define Primus options.
      .setOptions({
        reconnect: {
          minDelay: 100,
          maxDelay: 60000,
          retries: 100
        }
      })
      // Define default multiplex option for resources.
      .setDefaultMultiplex(false);
  });
  angular.module('brewersBeard.controllers', [], function(){});
  angular.module('brewersBeard.services', [], function(){});

})(angular);
