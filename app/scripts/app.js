/*
  ■ pomodoro
      app
          scripts
              * app.js
  +---------------------------------------------------------------------------
    * app.js
        Main script for the 'pomodoro' app.
  ---------------------------------------------------------------------------+
*/

(function() {
    function config($stateProvider, $locationProvider) {
        $locationProvider
            .html5Mode({
                enabled: true,
                requireBase: false
            });
        $stateProvider
            .state('pomodoro', {
                controller: 'PomodoroCtrl',
                controllerAs: 'pomodoro',
                url: '/',
                templateUrl: '/templates/pomodoro.html'
            });
    }

    var app = angular
        .module('pomodoro', ['ui.router', 'firebase'])
        .config(config);

    /*
        CONSTANTS
          INTERVAL_WORK : time in seconds for pomodoro work period
          INTERVAL_BREAK : time in seconds for pomodoro break period
    */
    app.constant('INTERVAL_WORK', 3); //1500);
    app.constant('INTERVAL_BREAK', 2); //300);
    app.constant('INTERVAL_LONG_BREAK', 4); //1800);
})();
