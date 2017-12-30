/*
  ■ pomodoro
      scripts
          directives
              * pomodoroTimer.js
   +---------------------------------------------------------------------------
    * pomodoroTimer.js
      => A directive for pomodoro timer functionality.
   ---------------------------------------------------------------------------+
*/

(function() {
    function pomodoroTimer($interval, INTERVAL_WORK, INTERVAL_BREAK) {
        function timer(scope, element, attrs) {
            /*
                timer (null or Object)
                  → the $interval object returned from starting a timer, kept as
                  a reference to cancel the timer later
            */
            scope.timer = null;

            /*
                timerCount (Number)
                  → the current progress into the timer
            */
            scope.timerCount = INTERVAL_WORK;

            /*
                timerState (String)
                  → a flag indicating timer state
                        'idle'    : user isn't engaged with the timer
                        'working' : user is working
                        'break'   : user is taking a break
            */
            scope.timerState = 'idle';

            scope.onBtnTimer = function() {
                switch(scope.timerState) {
                case 'idle':
                    scope.timerCount--;
                    var delay = 1000; // every 1s
                    scope.timer = $interval(function() {
                        scope.timerCount--;
                    }, delay)
                    scope.timerState = 'working';
                    break;
                case 'working':
                    $interval.cancel(scope.timer);
                    scope.timerState = 'idle';
                    scope.timerCount = INTERVAL_WORK;
                    break;
                }
            }

            /*
                isIdle()
                  => Returns true if timer is in 'idle' state.
            */
            scope.isIdle = function() {
                return scope.timerState === 'idle';
            }

            /*
                isEngaged()
                  => Returns true if timer is in 'working' or 'break' state.
            */
            scope.isEngaged = function() {
                return scope.timerState === 'working' || scope.timerState === 'break';
            }
        }

        return {
            restrict: 'E',
            replace: true,
            link: timer,
            templateUrl: '/templates/pomodoroTimer.html'
        }
    }

    angular
        .module('pomodoro')
        .directive('pomodoroTimer', ['$interval', 'INTERVAL_WORK', 'INTERVAL_BREAK', pomodoroTimer]);
})();
