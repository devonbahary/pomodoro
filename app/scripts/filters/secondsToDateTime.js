/*
  ■ pomodoro
      scripts
          filters
              * secondsToDateTime.js
   +---------------------------------------------------------------------------
    * secondsToDateTime.js
      => A filter to convert seconds to a Date time object.
   ---------------------------------------------------------------------------+
*/

(function() {
    function secondsToDateTime() {
        return function(seconds) {
            return new Date(0,0,0,0,0,0,0).setSeconds(seconds);
        };
    }

    angular
        .module('pomodoro')
        .filter('secondsToDateTime', secondsToDateTime);
})();
