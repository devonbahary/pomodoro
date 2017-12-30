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
        /*
            ($firebaseArray)
                → a $firebaseArray of task objects from the 'Tasks' service
        */
        this.tasks = Tasks.all;


        /*
            this.submit(String)
                => Takes a task 'item' String and adds a new tasks database
                  entry via the 'Tasks' service.
        */
        this.submit = function(item) {
            Tasks.addTask(item);
            document.getElementById('form-add-task').reset();
        }
    }

    angular
        .module('pomodoro')
        .controller('PomodoroCtrl', ['Tasks', PomodoroCtrl]);
})();
