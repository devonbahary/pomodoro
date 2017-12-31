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
                → the Firebase database reference to 'tasks' data
        */
        var ref = firebase.database().ref('/tasks');

        /*
            ($firebaseArray)
                → a $firebaseArray of task objects
        */
        Tasks.all = $firebaseArray(ref);

        /*
            Tasks.addTask(String)
                => Takes a task 'name' String and writes a task object to the
                  database, including a timestamp for ordering.
        */
        Tasks.addTask = function(name) {
            Tasks.all.$add({
                name: name,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }

        /*
            Tasks.removeTask(Object)
                => Takes a task 'item' Object and removes it from the database.
        */
        Tasks.removeTask = function(item) {
            Tasks.all.$remove(item);
        }

        return Tasks;
    }

    angular
        .module('pomodoro')
        .factory('Tasks', ['$firebaseArray', Tasks]);
})();
