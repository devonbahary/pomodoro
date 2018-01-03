/*
  ■ pomodoro
      scripts
          directives
              * userAuth.js
   +---------------------------------------------------------------------------
    * userAuth.js
        => A directive for user authentication.
   ---------------------------------------------------------------------------+
*/

(function() {
    function userAuth($timeout) {
        function user(scope, element, attrs) {

            /*
                (Number)
                    → duration (ms) before interface auto-collapse
            */
            var INTERFACE_OPEN_DURATION = 3000;

            /*
                (null or Promise)
                    → existing timeout function for interface auto-collapse
            */
            var timeout = null;

            /*
                (Boolean)
                    → sign-in modal open flag
            */
            var modalOpen = false;

            /*
                (Boolean)
                    → user toggle selection (has account <-> sign up)
            */
            var toggleHasAccount = true;

            /*
                (Boolean)
                    → user toggle selection (hide password <-> show password)
            */
            var toggleHidePassword = true;

            /*
                (Boolean)
                    → state of attempting user sign-in / sign-up
            */
            var attemptingAuth = false;

            /*
                (Boolean)
                    → state of attempting password reset email
            */
            var attemptingEmailReset = false;

            /*
                (Boolean)
                    → password reset email success flag
            */
            var emailReset = false;

            /*
                closeModal()
                    => Closes modal + resets forms.
            */
            function closeModal() {
                resetForm();
                resetFormErrors();
                modalOpen = false;
            }

            /*
                resetForm()
                    => Resets form inputs + associated scope variables.
            */
            function resetForm() {
                document.getElementById('form').reset();
                scope.inputDisplayName = "";
                scope.inputEmail = "";
                scope.inputPassword = "";
                emailReset = false;
                resetFormErrors();
            }

            /*
                resetFormErrors()
                    => Removes error styling from input containers in the view.
            */
            function resetFormErrors() {
                document.getElementById('input-email-container').classList.remove('error');
                document.getElementById('input-password-container').classList.remove('error');
            }

            /*
                attemptSignIn()
                    => Attempts to sign in user with form email + password,
                      highlighting input elements according to errors returned.
            */
            function attemptSignIn(email, password) {
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    switch(errorCode) {
                        case ('auth/invalid-email'):
                        case ('auth/user-disabled'):
                        case ('auth/user-not-found'):
                            document.getElementById('input-email-container').classList.toggle('error');
                            break;
                        case ('auth/wrong-password'):
                            document.getElementById('input-password-container').classList.toggle('error');
                            break;
                    }
                    attemptingAuth = false;
                    scope.$apply();
                });
            }

            /*
                attemptSignUp()
                    => Attempts to sign up user with form email + password,
                      highlighting input elements according to errors returned.
            */
            function attemptSignUp(email, password, displayName) {
                firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                    // on success
                    user.updateProfile({
                        displayName: displayName
                    }).then(function() {
                        scope.displayName = displayName;
                        scope.$apply();
                    });
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    switch(errorCode) {
                        case ('auth/invalid-email'):
                        case ('auth/email-already-in-use'):
                            document.getElementById('input-email-container').classList.toggle('error');
                            break;
                        case ('auth/weak-password'):
                            document.getElementById('input-password-container').classList.toggle('error');
                            break;
                    }
                    attemptingAuth = false;
                    scope.$apply();
                });
            }

            /*
                (String)
                    → user's diplay name
            */
            scope.displayName = "";

            /*
                scope.onBtnOpenInterface()
                    => Toggles user auth interface.
            */
            scope.onBtnOpenInterface = function() {
                var btnUserAuthContainer = document.getElementById('btn-user-auth-container');
                btnUserAuthContainer.classList.toggle('active');
                // set delayed interface auto-collapse
                if (btnUserAuthContainer.classList.contains('active')) {
                    timeout = $timeout(function() {
                        btnUserAuthContainer.classList.toggle('active');
                    }, INTERFACE_OPEN_DURATION);
                } else if (timeout) {
                    $timeout.cancel(timeout);
                    timeout = null;
                }
            }

            /*
                scope.onBtnSignOut()
                    => Signs current user out of session.
            */
            scope.onBtnSignOut = function() {
                firebase.auth().signOut();
                $timeout(function() {
                    scope.onBtnOpenInterface();
                }, 500);
            }

            /*
                scope.isModalOpen()
                    => Returns current 'modalOpen' state.
            */
            scope.isModalOpen = function() {
                return modalOpen;
            }

            /*
                scope.onBtnModal()
                    => Opens/closes the modal.
            */
            scope.onBtnModal = function() {
                if (modalOpen) {
                    closeModal();
                } else {
                    modalOpen = !modalOpen;
                }

            }

            /*
                scope.onBtnToggleAccount()
                    => Toggles the form to shown to the view (sign-in form <->
                      sign-up form).
            */
            scope.onBtnToggleAccount = function() {
                var accountToggle = document.getElementById('account-toggle-cursor');
                accountToggle.classList.toggle('switch');
                toggleHasAccount = !toggleHasAccount;
                document.getElementById('has-account').classList.toggle('active');
                document.getElementById('sign-me-up').classList.toggle('active');
                resetForm();
            }

            /*
                scope.isToggleHasAccount()
                    => Returns the state in which the user has selected having
                      an account already or not.
            */
            scope.isToggleHasAccount = function() {
                return toggleHasAccount;
            }

            /*
                scope.onBtnToggleHidePassword()
                    => Changes the input (password) form element to input (text)
                      for password visiblity + vice versa.
            */
            scope.onBtnToggleHidePassword = function() {
                var inputPassword = document.getElementById('input-password');
                if (inputPassword.type === 'password') {
                    inputPassword.type = 'text';
                } else {
                    inputPassword.type = 'password';
                }
                toggleHidePassword = !toggleHidePassword;
            }

            /*
                scope.isHidePassword()
                    => Returns the state in which the user has selected display-
                      ing the password.
            */
            scope.isHidePassword = function() {
                return toggleHidePassword;
            }

            /*
                scope.onFormSubmit()
                    => Attempts a sign-in / sign-up based on 'toggleHasAccount'
                      state.
            */
            scope.onFormSubmit = function() {
                attemptingAuth = true;
                resetFormErrors();
                var displayName = scope.inputDisplayName;
                var email = scope.inputEmail;
                var password = scope.inputPassword;
                toggleHasAccount ? attemptSignIn(email, password) : attemptSignUp(email, password, displayName);
            }

            scope.onBtnPasswordReset = function() {
                emailReset = false;
                attemptingEmailReset = true;
                resetFormErrors();
                var email = scope.inputEmail;
                firebase.auth().sendPasswordResetEmail(email).then(function() {
                    // Email sent.
                    emailReset = true;
                    attemptingEmailReset = false;
                    scope.$apply();
                }).catch(function(error) {
                    // An error happened.
                    var errorCode = error.code;
                    switch(errorCode) {
                        case ('auth/invalid-email'):
                        case ('auth/user-not-found'):
                            document.getElementById('input-email-container').classList.toggle('error');
                            break;
                    }
                    attemptingEmailReset = false;
                    scope.$apply();
                });
            }

            /*
                scope.isAttemptingAuth()
                    => Returns true if the user is attempting a sign-in / sign-up.
            */
            scope.isAttemptingAuth = function() {
                return attemptingAuth;
            }

            /*
                scope.isAttemptingEmailReset()
                    => Returns true if a password reset email is being requested.
            */
            scope.isAttemptingEmailReset = function() {
                return attemptingEmailReset;
            }

            /*
                scope.isEmailSent()
                    => Returns true if a password reset email was successfully
                      sent.
            */
            scope.isEmailSent = function() {
                return emailReset;
            }

            /*
                scope.isUserSignedIn()
                    => Returns user signed-in state.
            */
            scope.isUserSignedIn = function() {
                return !!firebase.auth().currentUser;
            }

            firebase.auth().onAuthStateChanged(function(user) {
                attemptingAuth = false;
                if (user) {
                    closeModal();
                    scope.displayName = user.displayName;
                    scope.$apply();
                    scope.onBtnOpenInterface();
                } else {
                    scope.displayName = "";
                    scope.onBtnOpenInterface();
                }
            })
        }

        return {
            restrict: 'E',
            replace: true,
            link: user,
            scope: {},
            templateUrl: '/templates/userAuth.html'
        }
    }

    angular
        .module('pomodoro')
        .directive('userAuth', ['$timeout', userAuth]);
})();
