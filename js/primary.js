///File primary.js
///Description the main javascript file for the Application
//'use strict';
//Declerations
var provider = new firebase.auth.GoogleAuthProvider(),
    signed_in = null;

function Application() {
    //Get buttons
    this.signInButton = document.getElementById('login-button');
    this.userMenuButton = document.getElementById('user-menu-button');
    this.signOutButton = document.getElementById('logout-button');
    this.deleteAccountButton = document.getElementById('delete-account-button');
    this.sendButton = document.getElementById('send-button');
    this.accountSetupButton = document.getElementById('account-setup-button');

    //Bind event handelers
    this.signInButton.addEventListener('click', this.SignIn);
    this.userMenuButton.addEventListener('click', this.ShowUserMenu);
    this.signOutButton.addEventListener('click', this.SignOut);
    this.sendButton.addEventListener('click', this.SendMessage);
    this.deleteAccountButton.addEventListener('click', this.DeleteAccount);
    this.accountSetupButton.addEventListener('click', function() {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
            email: firebase.auth().currentUser.email,
            name: firebase.auth().currentUser.displayName,
            type: $("input[name=type]:checked").val()
        });
        $("#first-time-setup").hide();
        $("#message-box").show();
        $("#messages").empty();
        Application.LoadMessages();
    });
}

//The Application's SignIn method
Application.prototype.SignIn = function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        $("#login-button").hide();
        $("#user-menu-button").show();
        $("#user-menu-button").text(user.displayName);
        Application.userExists();
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
    });
}

//The Application's SignOut method
Application.prototype.SignOut = function() {
    try {
        firebase.auth().signOut()
        $("#login-button").show();
        $("#user-menu-button").hide();
        $("#user-menu-button").text("");
        $("#message-box").hide();
        $("#user-menu").slideToggle();
        $("#first-time-setup").hide();
    } catch (e) {
        console.error(e);
    }
}

//The Application's DeleteAccount method
Application.prototype.DeleteAccount = function() {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).remove().then(function() {
        firebase.auth().currentUser.delete().then(function() {
            $("#login-button").show();
            $("#user-menu-button").hide();
            $("#user-menu-button").text("");
            $("#message-box").hide();
            $("#user-menu").slideToggle();
            $("#first-time-setup").hide();
        }, function(error) {

        });
    }).catch(function(error) {

    });
}

//The Application's ShowUserMenu method
Application.prototype.ShowUserMenu = function() {
    $("#user-menu").slideToggle();
}

//The Application's SendMessage method
Application.prototype.SendMessage = function() {
    if ($.trim($('#message-input').val()).length > 0) {
        firebase.database().ref('messages/' + Date.now() + Math.floor(Math.random() * 10001)).set({
            message: $("#message-input").val(),
            sender: firebase.auth().currentUser.uid,
            name: firebase.auth().currentUser.displayName
        });
        $("#message-input").val(null);
    }
}

//The Application's LoadMessages method
Application.prototype.LoadMessages = function() {
    var messageRef = firebase.database().ref("messages");
    messageRef.off();

    messageRef.limitToLast(35).on('child_added', function(data) {
        var message = data.val();
        Application.showMessage(message.message, message.name, data.key);
    });
    messageRef.on('child_removed', function(data) {
        $("#" + data.key).remove();
        document.getElementById('message-box').scrollTop = document.getElementById('message-box').scrollHeight;
    });
}

//The Application's showMessage method
Application.prototype.showMessage = function(message, name, id) {
    var message_formated = "<li id='" + id + "'></li>";
    $("#messages").append(message_formated);
    $("#" + id).text(name + " | " + message);
    document.getElementById('message-box').scrollTop = document.getElementById('message-box').scrollHeight;
}

//The Application's userExists method
Application.prototype.userExists = function() {
    var usersRef = firebase.database().ref('users/');
    usersRef.child(firebase.auth().currentUser.uid).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (!exists) {
            $("#first-time-setup").show()
        } else {
            $("#message-box").show();
            $("#messages").empty();
            Application.LoadMessages();
        }
    });
}

//The Firebase onAuthStateChanged handeler
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        signed_in = true;
        $("#login-button").hide();
        $("#user-menu-button").show();
        $("#user-menu-button").text(user.displayName);
        $("#first-time-setup").hide();
        Application.userExists();
    } else {
        signed_in = false;
    }
});

//Bind key handelers.
$("#message-input").keydown(function(e) {
    switch (e.which) {
        case 13:
            Application.SendMessage();
            break;
        default:
            return;
    }
    e.preventDefault();
});
//Loads the app and messages on window load event
window.onload = function() {
    window.Application = new Application();
    $("#messages").empty();
    Application.LoadMessages();
};


///End Of File
