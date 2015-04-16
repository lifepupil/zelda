'use strict';


var root, users;

$(document).ready(init);

function init(){
  root = new Firebase('https://zelda-cdr.firebaseio.com/');
  users = root.child('users');
  #('#create-user').click(createUser);
}

function createUser() {
  var handle = $('#handle').val();
  var avatar = $('#avatar').val();

  users.push({
    handle: handle,
    avatar: avatar
  });

}
