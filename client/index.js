'use strict';


var root, characters;

$(document).ready(init);

function init(){
  root = new Firebase('https://zelda-cdr.firebaseio.com/');
  characters = root.child('users');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  characters.on('child_added', characterAdded);
  $('#create-character').click(createCharacter);

}

// THIS SENDS
function createCharacter() {
  var handle = $('#handle').val();
  var avatar = $('#avatar').val();
  // THIS GETS YOUR LOGIN INFO OUT OF localStorage (try typing it at the console...)
  var uid = root.getAuth().uid;

  characters.push({
    handle: handle,
    avatar: avatar,
    uid: uid
  });
}

// THIS GETS FIREBASE TO PUSH INFORMATION BACK TO ME (INCLUDING OTHER CHARACTERS THAT ARE PLAYING)
function characterAdded(snapshot){
   var character = snapshot.val();
   var myUid = root.getAuth().uid;
   var active = '';

   if (myUid === character.uid) {
     myClass = 'active';
   }

   var tr = '<tr class='+myClass+'><td>'+character.handle+'</td><td><img src"'+character.avatar+'"></td></tr>';
   $('#characters > tbody').append(tr);
}

function loginUser() {
  var email = $('#email').val();
  var password = $('#password').val();

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed with error:", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
}

function createUser() {
  var email = $('#email').val();
  var password = $('#password').val();

  // SEE NOTES FOR EXPLANATION
  root.createUser({
    email    : email,
    password : password
  }, function(error) {
    if (error) {
      console.log("Error creating user:", error);
    }
  });
}
