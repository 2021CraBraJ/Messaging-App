'use strict';
$(document).ready(function() {
    ///Variables
    var config = {
            apiKey: "AIzaSyB-_oxVKECJutT52DBsyoM0cyVnv9_LHUk",
            authDomain: "test-baf2c.firebaseapp.com",
            databaseURL: "https://test-baf2c.firebaseio.com",
            storageBucket: "test-baf2c.appspot.com",
        },
        provider = new firebase.auth.GoogleAuthProvider();
    ///End

    if (window.location.href == "http://localhost:5000/" || "https://2021crabraj.github.io/Messaging-App/") {
        ///Firebase
        //Initialize firebase
        firebase.initializeApp(config);
        //Setup authentication
        function loginGooglePopup() {
            firebase.auth().signInWithPopup(provider).then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                // ...
            });
        }

        function loginGoogleRedirect() {
            firebase.auth().getRedirectResult().then(function(result) {
                if (result.credential) {
                    var token = result.credential.accessToken;
                }
                var user = result.user;
            }).catch(function(error) {
                var errorCode = error.code;
                var email = error.email;
                var credential = error.credential;
            });
        }
        $("#login-button").click(function() {
            loginGooglePopup();
            $("#login-button").hide();
            $("#user-menu-button").show();
            $("#user-menu-button").text(firebase.auth().currentUser.displayName);
        });
        $("#user-menu-button").click(function() {
            firebase.auth().signOut();
        });
    }
});
///End
