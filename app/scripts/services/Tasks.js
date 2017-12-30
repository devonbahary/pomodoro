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
        var ref = firebase.database().ref('/tasks');

        var tasks = $firebaseArray(ref);

        return {
            all: tasks
        };
    }

    angular
        .module('pomodoro')
        .factory('Tasks', ['$firebaseArray', Tasks]);
})();
