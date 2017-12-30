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
    function pomodoroTimer($interval, INTERVAL_WORK, INTERVAL_BREAK, INTERVAL_LONG_BREAK) {
        function timer(scope, element, attrs) {

            /*
                timer (null or Object)
                  → the $interval object returned from starting a timer, kept as
                  a reference to cancel the timer later
            */
            var timer = null;

            /*
                timerState (String)
                  → indicates timer state
                        'idle'    : user isn't engaged with the timer
                        'working' : user is working
                        'break'   : user is taking a break
            */
            var timerState = 'idle';

            /*
                workCompleted (Boolean)
                  → a flag indicating if user has most recently completed a work
                  session
            */
            var workCompleted = false;

            /*
                completedWorkSessions (Number)
                  → a counter of completed work sessions (after 4, a longer
                  break is permitted)
            */
            var completedWorkSessions = 0;

            /*
                audioChime (Object)
                  → an audio file for the chime sound effect played when the
                  timer reaches 0
            */
            var audioChime = new buzz.sound('/assets/audio/chime.mp3', {
                preload: true,
                volume: 100
            });

            /*
                beginTimer()
                  => Begins an interval function that decrements the timer.
            */
            function beginTimer() {
                scope.timerCount--;
                var delay = 1000; // every 1s
                timer = $interval(function() {
                    scope.timerCount--;
                    // on timer end
                    if (!scope.timerCount) {
                        $interval.cancel(timer);
                        workCompleted = !workCompleted;
                        if (workCompleted) { completedWorkSessions++; }
                        resetTimer();
                        audioChime.play();
                    }
                }, delay)
                timerState = workCompleted ? 'break' : 'working';
            }

            /*
                resetTimer()
                  => Cancels the interval function from 'beginTimer()' and
                  resets the time.
            */
            function resetTimer() {
                $interval.cancel(timer);
                timerState = 'idle';
                var workTime = INTERVAL_WORK;
                var breakTime = isLongBreak() ? INTERVAL_LONG_BREAK : INTERVAL_BREAK;
                scope.timerCount = workCompleted ? breakTime : workTime;
            }

            /*
                isLongBreak()
                  => Returns true if a work session has been completed and it is
                  the fourth consecutive without a long break.
            */
            function isLongBreak() {
                return workCompleted && completedWorkSessions && !(completedWorkSessions % 4);
            }

            /*
                scope.timerCount (Number)
                  → the current progress into the timer
            */
            scope.timerCount = INTERVAL_WORK;

            /*
                scope.onBtnTimer()
                  => Starts or resets the timer according to 'timerState'.
            */
            scope.onBtnTimer = function() {
                switch(timerState) {
                    case 'idle':
                        beginTimer();
                        break;
                    default:
                        resetTimer();
                }
            }

            /*
                scope.isIdle()
                  => Returns true if timer is in 'idle' state.
            */
            scope.isIdle = function() {
                return timerState === 'idle';
            }

            /*
                scope.isTicking()
                  => Returns true if timer is in 'working' or 'break' state.
            */
            scope.isTicking = function() {
                return timerState === 'working' || timerState === 'break';
            }

            /*
                scope.isWorkCompleted()
                  => Returns true if user has fulfilled the entirety of a work
                  session.
            */
            scope.isWorkCompleted = function() {
                return workCompleted;
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
        .directive('pomodoroTimer', ['$interval', 'INTERVAL_WORK', 'INTERVAL_BREAK',
          'INTERVAL_LONG_BREAK', pomodoroTimer]);
})();
