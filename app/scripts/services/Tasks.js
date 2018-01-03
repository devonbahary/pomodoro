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
            refTasksActive()
                => Returns the firebase reference where the user's active tasks
                  are located.
        */
        function refTasksActive() {
            return firebase.database().ref('/' + firebase.auth().currentUser.uid + '/tasksActive');
        }

        /*
            refTasksCompleted()
                => Returns the firebase reference where the user's completed tasks
                  are located.
        */
        function refTasksCompleted() {
            return firebase.database().ref('/' + firebase.auth().currentUser.uid + '/tasksCompleted');
        }

        /*
            (Array or $firebaseArray)
                → an array / $firebaseArray (on user sign-in) of active task objects
        */
        Tasks.active = [];

        /*
            (Array or $firebaseArray)
                → an array / $firebaseArray (on user sign-in) of completed task objects
        */
        Tasks.completed = [];

        /*
            Tasks.addTask(String)
                => Takes a task 'name' String and writes a task object to the
                  database, including a timestamp for ordering.
        */
        Tasks.addTask = function(name) {
            var newTask = {
                name: name,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            if (firebase.auth().currentUser) {
                Tasks.active.$add(newTask);
            } else {
                Tasks.active.push(newTask);
            }
        }

        /*
            Tasks.completeTask(Object)
                => Takes an active task 'item' Object, removes it from the
                  active tasks, and adds it to the complete tasks with a
                  new timestamp.
        */
        Tasks.completeTask = function(item) {
            var completeTask = {
                name: item.name,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }
            if (firebase.auth().currentUser) {
                Tasks.active.$remove(item);
                Tasks.completed.$add(completeTask);
            } else {
                var index = Tasks.active.indexOf(item);
                Tasks.active.splice(index, 1);
                Tasks.completed.push(completeTask);
            }
        }

        /*
            Tasks.destroyTask(Object)
                => Takes a completed task 'item' Object and removes it from
                  the completed tasks database.
        */
        Tasks.destroyTask = function(item) {
            if (firebase.auth().currentUser) {
                Tasks.completed.$remove(item);
            } else {
                var index = Tasks.completed.indexOf(item);
                Tasks.completed.splice(index, 1);
            }
        }


        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                Tasks.active = $firebaseArray(refTasksActive());
                Tasks.completed = $firebaseArray(refTasksCompleted());
            } else {
                Tasks.active = [];
                Tasks.completed = [];
            }
        });

        return Tasks;
    }

    angular
        .module('pomodoro')
        .factory('Tasks', ['$firebaseArray', Tasks]);
})();
