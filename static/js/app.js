;(function(angular) {
  'use strict';
  angular.module('brewersBeard', [
      //'ngTouch',
      'ngRoute',
      'ngAnimate',
      'ngResource',
      'brewersBeard.controllers',
      'brewersBeard.services'
  ]).
  config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/brew', {
      templateUrl: '/partials/brew.html',
      controller: 'brewCtrl'});
    $routeProvider.when('/brew/:id', {
      templateUrl: '/partials/brew.html',
      controller: 'brewCtrl'});
    $routeProvider.when('/', {
      templateUrl: '/partials/main.html',
      controller: 'mainCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  });
  angular.module('brewersBeard.controllers', [], function(){});
  angular.module('brewersBeard.services', [], function(){});
})(angular);
