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
            (Object)
                → the 'Tasks' service, from which we can access properties
                  'active' + 'completed' task arrays
        */
        this.tasks = Tasks;

        /*
            this.submit(String)
                => Takes a task 'name' String and adds a new active tasks
                  database entry via the 'Tasks' service.
        */
        this.submit = function(name) {
            Tasks.addTask(name);
            document.getElementById('form-add-task').reset();
        }

        /*
            this.onBtnComplete(Object)
                => Takes a task 'item' Object,  removes it from the active
                  tasks database and adds it to the completed tasks database
                  via the 'Tasks' service.
        */
        this.onBtnComplete = function(item) {
            Tasks.completeTask(item);
        }

        /*
            this.onBtnDestroy(Object)
                => Takes a task 'item' Object and removes it from the completed
                  tasks database via the 'Tasks' service.
        */
        this.onBtnDestroy = function(item) {
            Tasks.destroyTask(item);
        }
    }

    angular
        .module('pomodoro')
        .controller('PomodoroCtrl', ['Tasks', PomodoroCtrl]);
})();
