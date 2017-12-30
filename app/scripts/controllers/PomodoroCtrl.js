/*
  ■ pomodoro
      scripts
          controllers
              * PomodoroCtrl.js
   +---------------------------------------------------------------------------
    * PomodoroCtrl.js
      => A controller for the Pomodoro functionality.
   ---------------------------------------------------------------------------+
*/

(function() {
    function PomodoroCtrl(Tasks) {
        this.tasks = Tasks.all;


        this.submit = function(item) {
            this.tasks.$add(item)
            document.getElementById('form-add-task').reset();
        }
    }

    angular
        .module('pomodoro')
        .controller('PomodoroCtrl', ['Tasks', PomodoroCtrl]);
})();
