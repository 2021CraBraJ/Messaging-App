'use strict';
//Declerations
var provider = new firebase.auth.GoogleAuthProvider(),
	signed_in = null;

function Application() {
  //Easy access to firebase refrences
  
  //Get authentication buttons
  this.signInButton = document.getElementById('login-button');
  this.userMenuButton = document.getElementById('user-menu-button');
  this.sendButton = document.getElementById('send-button');
  
  //Bind event handelers
  this.signInButton.addEventListener('click',this.SignIn);
  this.userMenuButton.addEventListener('click',this.SignOut);
  this.sendButton.addEventListener('click',this.SendMessage);
  }
Application.prototype.SignIn = function() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
  $("#login-button").hide();
  $("#user-menu-button").show();
  $("#user-menu-button").text(user.displayName);
  $("#message-box").show();
  }).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  });
}
Application.prototype.SignOut = function() {
	try {
	  firebase.auth().signOut()
      $("#login-button").show();
      $("#user-menu-button").hide();
      $("#user-menu-button").text("");
	  $("#message-box").hide();
	} catch (e) {
		console.error(e);
	}
}
Application.prototype.FirstLoginSetup = function() {
	//TODO: add account types selection
}
Application.prototype.SendMessage = function() {
	firebase.database().ref('messages/' + Date.now() +  Math.floor(Math.random() * 10001)).set({
		message: $("#message-input").val(),
		sender: firebase.auth().currentUser.uid
    });
	$("#message-input").val(null);
}
Application.prototype.LoadMessages = function() {
		var messageRef = firebase.database().ref("messages");
		messagesRef.off();
		
		messageRef.on('child_added', function(data) {
			var message = data.message();
			alert(message);
		}
	)
}
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	  signed_in = true;
	  $("#login-button").hide();
	  $("#user-menu-button").show();
      $("#user-menu-button").text(user.displayName);
	  $("#message-box").show();
  } else {
    signed_in = false;
  }
});
window.onload = function() {
  window.Application = new Application();
};
///End
