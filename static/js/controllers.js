;(function(angular) {
  'use strict';
  angular.module('brewersBeard.controllers', [])
  .controller('mainCtrl', function ($scope, $rootScope, $window, $location) {
      $scope.test = 'tits';
    })
  .controller('brewCtrl', function($scope, $routeParams, $http, BrewService) {
      var makeList = function() {
        $scope.brews = BrewService.query();
      };
      var loadBrew = function(id) {
        $scope.brew = BrewService.get({brewId: id}, function(d) {
          console.log(d);
        });
      };
      $scope.deleteBrew = function(id) {
        BrewService.delete({brewId: id}, function() {
          refreshView();
        });
      };
      $scope.updateBrew = function(brew) {
        console.log(brew);
        BrewService.update({ brewId:brew.id }, brew, function() {
          refreshView();
        });
      };
      $scope.id = $routeParams.id;
      var refreshView = function() {
        if (!$scope.id) {
          makeList();
        }
        else {
          loadBrew($scope.id);
        }
      };
      refreshView();
      $scope.addBrew = function() {
        BrewService.save({name: $scope.createdName}, function() {
          refreshView();
        });
      };

    });
})(angular);
