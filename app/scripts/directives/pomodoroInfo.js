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
    function pomodoroInfo() {
        function pomodoroInfoModal(scope, element, attrs) {
            /*
                (Boolean)
                    → info modal open flag
            */
            var modalOpen = false;

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
        .directive('pomodoroInfo', pomodoroInfo);
})();
