;(function(angular) {
  'use strict';
  angular.module('brewersBeard.controllers')
  .controller('mainCtrl', ['$scope', 'primus', function ($scope, primus) {
      primus.send('auth', 'myauth');
      primus.$on('authed', function(msg) {
        $scope.client = true;
      });
      primus.send('gettemp');
      primus.$on('newtemp', function(msg) {
        console.log('new temp ' + msg);
        $scope.temp =  msg;
      });
  }]);
})(angular);
