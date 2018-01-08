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
    function pomodoroTimer($interval, $rootScope, INTERVAL_WORK, INTERVAL_BREAK, INTERVAL_LONG_BREAK) {
        function timer(scope, element, attrs) {

            /*
                (null or Object)
                    → the $interval object returned from starting a timer, kept
                      as a reference to cancel the timer later
            */
            var timer = null;

            /*
                (String)
                    → indicates timer state
                        'idle'    : user isn't engaged with the timer
                        'working' : user is working
                        'break'   : user is taking a break
            */
            var timerState = 'idle';

            /*
                (Boolean)
                    → a flag indicating if user has most recently completed a work
                      session
            */
            var workCompleted = false;

            /*
                (Number)
                    → a counter of completed work sessions (after 4, a longer
                      break is permitted)
            */
            var completedWorkSessions = 0;

            /*
                (Object)
                    → an audio file for the chime sound effect played when the
                      timer reaches 0
            */
            var audioChime = new buzz.sound('/assets/audio/chime.mp3', {
                preload: true,
                volume: 100
            });


            /*
                (Boolean)
                    → a flag for the pause state
            */
            var pauseState = false;

            /*
                beginTimer()
                    => Begins an interval function that decrements the timer.
            */
            function beginTimer() {
                scope.timerCount--;
                var delay = 1000; // every 1s
                timer = $interval(function() {
                    if (!scope.timerCount) {
                      $interval.cancel(timer);
                      workCompleted = !workCompleted;
                      if (workCompleted) {
                          completedWorkSessions++;
                          $rootScope.$broadcast('endedWork', scope.isLongBreak());
                      } else {
                          $rootScope.$broadcast('endedBreak');
                      }
                      resetTimer();
                      audioChime.play();
                      return;
                    }
                    scope.timerCount--;
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
                var breakTime = scope.isLongBreak() ? INTERVAL_LONG_BREAK : INTERVAL_BREAK;
                scope.timerCount = workCompleted ? breakTime : workTime;
            }

            /*
                (Number)
                  → the current progress into the timer
            */
            scope.timerCount = INTERVAL_WORK;

            /*
                scope.onBtnTimer()
                    => Starts or resets the timer according to 'timerState'.
            */
            scope.onBtnTimer = function() {
                scope.isIdle() ? beginTimer() : resetTimer();
                !workCompleted ? $rootScope.$broadcast('startedWork') : $rootScope.$broadcast('startedBreak');
            }

            /*
                scope.onBtnPause()
                    => Pauses/resumes timer (when timer > 0).
            */
            scope.onBtnPause = function() {
                if (scope.timerCount) {
                    pauseState = !pauseState;
                    if (pauseState) {
                        $interval.cancel(timer);
                    } else {
                        beginTimer();
                    }
                }
            }

            /*
                scope.onBtnSkipBreak()
                    => Available during break sessions only, skips break and
                      resets timer.
            */
            scope.onBtnSkipBreak = function() {
                workCompleted = !workCompleted;
                resetTimer();
            }

            /*
                scope.isIdle()
                    => Returns true if timer is in 'idle' state.
            */
            scope.isIdle = function() {
                return timerState === 'idle';
            }

            /*
                scope.isEngaged()
                    => Returns true if timer is in 'working' or 'break' state.
            */
            scope.isEngaged = function() {
                return timerState !== 'idle';
            }

            /*
                scope.isWorkCompleted()
                    => Returns true if user has fulfilled the entirety of a work
                      session.
            */
            scope.isWorkCompleted = function() {
                return workCompleted;
            }

            /*
                scope.isLongBreak()
                    => Returns true if a work session has been completed and it
                      is the fourth consecutive without a long break.
            */
            scope.isLongBreak = function() {
                return workCompleted && completedWorkSessions && !(completedWorkSessions % 4);
            }

            /*
                scope.isPaused()
                    => Returns true if session is paused.
            */
            scope.isPaused = function() {
                return pauseState;
            }

            /*
                => reset timer on user sign-out
            */
            firebase.auth().onAuthStateChanged(function(user) {
                if (!user) {
                    resetTimer();
                }
            })

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
        .directive('pomodoroTimer', ['$interval', '$rootScope', 'INTERVAL_WORK',
          'INTERVAL_BREAK', 'INTERVAL_LONG_BREAK', pomodoroTimer]);
})();
