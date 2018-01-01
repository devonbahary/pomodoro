/*
  ■ pomodoro
      scripts
          services
              * Tasks.js
   +---------------------------------------------------------------------------
    * Tasks.js
      => A service to handle task manipulation through Firebase .
   ---------------------------------------------------------------------------+
*/

(function() {
    function Tasks($firebaseArray) {

        /*
            (Object)
                → the return object containing the service's features
        */
        var Tasks = {};

        /*
                → the Firebase database reference to 'tasksActive' data
        */
        var refTasksActive = firebase.database().ref('/tasksActive');

        /*
                → the Firebase database reference to 'tasksCompleted' data
        */
        var refTasksCompleted = firebase.database().ref('/tasksCompleted');

        /*
            ($firebaseArray)
                → a $firebaseArray of active task objects
        */
        Tasks.active = $firebaseArray(refTasksActive);

        /*
            ($firebaseArray)
                → a $firebaseArray of completed task objects
        */
        Tasks.completed = $firebaseArray(refTasksCompleted);

        /*
            Tasks.addTask(String)
                => Takes a task 'name' String and writes a task object to the
                  database, including a timestamp for ordering.
        */
        Tasks.addTask = function(name) {
            Tasks.active.$add({
                name: name,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }

        /*
            Tasks.completeTask(Object)
                => Takes an active task 'item' Object, removes it from the
                  active tasks, and adds it to the complete tasks with a
                  new timestamp.
        */
        Tasks.completeTask = function(item) {
            Tasks.active.$remove(item);
            Tasks.completed.$add({
                name: item.name,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }

        /*
            Tasks.destroyTask(Object)
                => Takes a completed task 'item' Object and removes it from
                  the completed tasks database.
        */
        Tasks.destroyTask = function(item) {
            Tasks.completed.$remove(item);
        }

        return Tasks;
    }

    angular
        .module('pomodoro')
        .factory('Tasks', ['$firebaseArray', Tasks]);
})();
