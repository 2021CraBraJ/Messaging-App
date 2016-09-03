'use strict';
//Declerations
var provider = new firebase.auth.GoogleAuthProvider();

function Application() {
  //Easy access to firebase refrences
  this.user = firebase.auth().currentUser
  
  //Get authentication buttons
  this.signInButton = document.getElementById('login-button');
  this.userMenuButton = document.getElementById('user-menu-button');
  
  //Bind event handelers
  this.signInButton.addEventListener('click',SignIn())
  this.userMenuButton.addEventListener('click',SignOut())
}
function SignIn() {
  firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
  $("#login-button").hide();
  $("#user-menu-button").show();
  $("#user-menu-button").text(this.user.displayName);
  }).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  });
}
window.onload = function() {
  window.Application = new Application();
};
///End
