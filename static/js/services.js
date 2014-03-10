;(function(angular) {
  'use strict';
  angular.module('brewersBeard.services', [])
  .service('BrewService', function($resource) {
    return $resource('/api/brew/:brewId', {
      brewId: '@id'
    }, {
      'update': { method: 'PATCH' }
    });
  });
})(angular);
