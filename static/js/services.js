;(function(angular) {
  'use strict';
  angular.module('brewersBeard.services', [])
  .service('BrewService', function($resource) {
    return $resource('/api/brew/:brewId', {
      brewId: '@id'
    }, {
      'query':  {method:'GET', isArray:false },
      'update': { method: 'PATCH' }
    });
  });
})(angular);
