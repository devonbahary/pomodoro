/*
  ■ pomodoro
      scripts
          directives
              * pomodoroInfo.js
   +---------------------------------------------------------------------------
    * pomodoroInfo.js
      => A directive for a pomodoro informational modal.
   ---------------------------------------------------------------------------+
*/

(function() {
    function pomodoroInfo($timeout, $rootScope) {
        function pomodoroInfoModal(scope, element, attrs) {
            /*
                (Boolean)
                    → info modal open flag
            */
            var modalOpen = false;

            /*
                (Boolean)
                    → display first-time welcome messages open flag
            */
            var displayWalkthrough = false;

            /*
                (Boolean)
                    → current walkthrough message has remove button state
            */
            var hasBtnRemoveMessage = false;

            /*
                (Array)
                    → queue of walkthrough messages to display
            */
            var walkthroughMessages = [];

            /*
                (Boolean)
                    → displayed walkthrough for 'addedTask' event flag
            */
            var shownAddedTaskWalkthrough = false;

            /*
                (Boolean)
                    → displayed walkthrough for 'startedWork' event flag
            */
            var shownStartedWorkWalkthrough = false;

            /*
                (Boolean)
                    → displayed walkthrough for 'endedWork' event flag
            */
            var shownEndedWorkWalkthrough = false;

            /*
                (Boolean)
                    → displayed walkthrough for 'endedWork' event flag WITH
                      long break condition
            */
            var shownEndedWorkLongBreakWalkthrough = false;

            /*
                (Boolean)
                    → displayed walkthrough for 'startedWork' event flag
            */
            var shownStartedBreakWalkthrough = false;

            /*
                (Boolean)
                    → displayed walkthrough for 'endedWork' event flag
            */
            var shownEndedBreakWalkthrough = false;

            /*
                (null or Promise)
                    → the Promise reference to the current timer kept to cancel
                      unwanted display message termination
            */
            var timer = null;

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
                clearWalkthroughMessages()
                    => Transitions walkthrough message off-screen and clears the
                      'walkthroughMessages' queue so that the next 'displayWalk-
                      throughMessage' call can fire immediately.
            */
            function clearWalkthroughMessages() {
                walkthroughMessages = [];
                document.getElementById('walkthrough-msg').style.left = '-100%';
                displayWalkthrough = false;
                hasBtnRemoveMessage = false;
                $timeout.cancel(timer);
            }

            /*
                displayWalkthroughMessage(String, Boolean)
                    => Adds String 'displayMessage' to 'walkthrough-msg' element,
                      transitions element on-screen, and sets timer to remove if
                      Boolean !'persistFlag'.
            */
            function displayWalkthroughMessage(displayMessage, persistFlag) {
                // if not already displaying a message..
                if (!displayWalkthrough) {
                    // set message + display
                    document.getElementById('display-msg').innerHTML = displayMessage;
                    document.getElementById('walkthrough-msg').style.left = '0';
                    displayWalkthrough = true;
                    if (persistFlag) {
                        hasBtnRemoveMessage = true;
                    }
                    // termination/transition timer
                    if (!persistFlag) {
                        timer = $timeout(function() {
                            document.getElementById('walkthrough-msg').style.left = '-100%';
                            // display message for messages in-queue
                            if (walkthroughMessages.length > 0) {
                                $timeout(function() {
                                    var messageInQueue = walkthroughMessages.shift();
                                    displayWalkthroughMessage(messageInQueue.message, messageInQueue.persistFlag);
                                }, 1000);
                            }
                            displayWalkthrough = false;
                            hasBtnRemoveMessage = false;
                        }, timeToDisplayMessage(displayMessage));
                    }
                } else {
                    // save message in queue to display after current message
                    walkthroughMessages.push({
                        message: displayMessage,
                        persistFlag: persistFlag
                    });
                }
            }

            /*
                timeToDisplayMessage(String)
                    => Takes a String 'message' and returns an appropriate duration
                      to display it to the user based on its length.
            */
            function timeToDisplayMessage(message) {
                return Math.max(message.length * 100, 3000);
            }

            /*
                scope.onBtnRmvMsg()
                    => Returns the state of 'hasBtnRemoveMessage'.
            */
            scope.hasBtnRmvMsg = function() {
                return hasBtnRemoveMessage;
            }

            /*
                scope.onBtnRmvMsg()
                    => Closes the current walkthrough message display.
            */
            scope.onBtnRmvMsg = function() {
                clearWalkthroughMessages();
            }

            /*
                scope.onBtnModal()
                    => Opens/closes the modal.
            */
            scope.onBtnModal = function() {
                modalOpen = !modalOpen;
            }

            /*
                scope.isModalOpen()
                    => Returns current 'modalOpen' state.
            */
            scope.isModalOpen = function() {
                return modalOpen;
            }

            /*
                => Introductory welcome walkthrough instructions.
            */
            $timeout(function() {
                if (!firebase.auth().currentUser) {
                    displayWalkthroughMessage("Welcome to Pomodoro.<br>Let's get work done.")
                    displayWalkthroughMessage("It's simple:<br>1. Add tasks<br>2. Work for 25min<br>3. Take a break<br>4. Repeat")
                    displayWalkthroughMessage("Ready to get started?<br>Add tasks with the task pane above.", true);
                }
            }, 2000);

            /* EVENT LISTENERS
              -------------------------------------------------------------- */
            /*
                => Walkthrough message after adding a task
            */
            $rootScope.$on('addedTask', function() {
                if (!shownAddedTaskWalkthrough) {
                    function onAddedTask() {
                        var message = "Nice! Add some more, or begin your first <span class='ion-android-stopwatch'></span> work session with the timer.";
                        displayWalkthroughMessage(message, true);
                    }

                    var messageInterrupted = displayWalkthrough;
                    clearWalkthroughMessages();
                    if (messageInterrupted) {
                        timer = $timeout(function() {
                            onAddedTask();
                        }, 750);
                    } else {
                        onAddedTask();
                    }
                    shownAddedTaskWalkthrough = true;
                }
            });

            /*
                => Walkthrough message after starting work
            */
            $rootScope.$on('startedWork', function() {
                if (!shownStartedWorkWalkthrough) {
                    function onStartedWork() {
                        var message = "Alright, time to focus. No distractions until the timer's up.<br><span class='sub-txt'><span class='ion-android-checkbox-outline'></span> Mark tasks completed<br><span class='ion-trash-b'></span> Clear them altogether.</span>";
                        displayWalkthroughMessage(message, true);
                        audioChime.play();
                    }

                    var messageInterrupted = displayWalkthrough;
                    clearWalkthroughMessages();
                    if (messageInterrupted) {
                        timer = $timeout(function() {
                            onStartedWork();
                        }, 750);
                    } else {
                        onStartedWork();
                    }
                    shownStartedWorkWalkthrough = true;
                }
            });

            /*
                => Walkthrough message after ending work
            */
            $rootScope.$on('endedWork', function(event, data) {
                if (!shownEndedWorkWalkthrough || !shownEndedWorkLongBreakWalkthrough) {
                    function onEndedWork() {
                        var message = "Good job! Take 5 to stretch, grab your phone, take a walk, etc.<br><span class='sub-txt'>(Hit the <span class='ion-android-walk'></span> break timer to start.)</span>";
                        displayWalkthroughMessage(message, true);
                    }

                    function onEndedWorkLongBreak() {
                        var message = "You've earned your first <span class='ion-android-walk long'></span> <strong>long break</strong>!<br><span class='sub-txt'>(After every 4 consecutive work sessions, your break will be much longer.)</span>"
                        displayWalkthroughMessage(message, true);
                    }

                    var messageInterrupted = displayWalkthrough;
                    clearWalkthroughMessages();

                    if (!shownEndedWorkWalkthrough) {
                        if (messageInterrupted) {
                            timer = $timeout(function() {
                                onEndedWork();
                            }, 750);
                        } else {
                            onEndedWork();
                        }
                        shownEndedWorkWalkthrough = true;
                    } else if (!shownEndedWorkLongBreakWalkthrough && data) {
                        if (messageInterrupted) {
                            timer = $timeout(function() {
                                onEndedWorkLongBreak();
                            }, 750);
                        } else {
                            onEndedWorkLongBreak();
                        }
                        shownEndedWorkLongBreakWalkthrough = true;
                    }

                }
            });

            /*
                => Walkthrough message after starting break
            */
            $rootScope.$on('startedBreak', function() {
                if (!shownStartedBreakWalkthrough) {
                    function onStartedBreak() {
                        var message = "Managing the time we have to focus on our work and take breaks helps us do <strong>both</strong> better.<br><span style='opacity: 0.8';>(Another 25 minutes of work after this.)</span>";
                        displayWalkthroughMessage(message, true);
                        audioChime.play();
                    }

                    var messageInterrupted = displayWalkthrough;
                    clearWalkthroughMessages();
                    if (messageInterrupted) {
                        timer = $timeout(function() {
                            onStartedBreak();
                        }, 750);
                    } else {
                        onStartedBreak();
                    }
                    shownStartedBreakWalkthrough = true;
                }
            });

            /*
                => Walkthrough message after ending a break
            */
            $rootScope.$on('endedBreak', function() {
                if (!shownEndedBreakWalkthrough) {
                    function onEndedBreak() {
                        var message = "Relaxed? Good. Time to focus!<br>I think you've got the hang of this.";
                        displayWalkthroughMessage(message, true);
                    }

                    var messageInterrupted = displayWalkthrough;
                    clearWalkthroughMessages();
                    if (messageInterrupted) {
                        timer = $timeout(function() {
                            onEndedBreak();
                        }, 750);
                    } else {
                        onEndedBreak();
                    }
                    shownEndedBreakWalkthrough = true;
                }
            });

        }

        return {
            restrict: 'E',
            replace: true,
            link: pomodoroInfoModal,
            scope: {},
            templateUrl: '/templates/pomodoroInfo.html'
        }
    }

    angular
        .module('pomodoro')
        .directive('pomodoroInfo', ['$timeout', '$rootScope', pomodoroInfo]);
})();
