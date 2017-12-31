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
                => Takes a task 'name' String and adds a new tasks database
                  entry via the 'Tasks' service.
        */
        this.submit = function(name) {
            Tasks.addTask(name);
            document.getElementById('form-add-task').reset();
        }

        /*
            this.complete(Object)
                => Takes a task 'item' Object and removes it from the database
                  via the 'Tasks' service.
        */
        this.complete = function(item) {
            Tasks.removeTask(item);
        }
    }

    angular
        .module('pomodoro')
        .controller('PomodoroCtrl', ['Tasks', PomodoroCtrl]);
})();
