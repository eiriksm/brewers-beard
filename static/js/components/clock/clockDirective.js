;(function(angular) {
  'use strict';

  angular.module('brewClockDirective', [])
  .directive('brewClock', ['$interval' ,function ($interval) {
    return {
      restrict: 'A',
      scope: {},
      link: function(scope, elm) {
        function Clock() {
          this.started = false;
          this.startTime;
        }
        Clock.prototype.start = function() {
          if (this.started) {
            throw new Error('Please do not start a running clock!');
          }
          this.started = true;
          this.startTime = Date.now();
        };
        Clock.prototype.elapsed = function() {
          if (!this.startTime) {
            return 0;
          }
          return Date.now() - this.startTime;
        };

        scope.clock = new Clock();
      },
      templateUrl: '/js/components/clock/clock.html'
    };
  }]);
})(angular);
