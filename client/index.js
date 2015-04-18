/* global Firebase:true */

'use strict';

var root, characters, myKey, myCharacter, items;
var move = '/assets/move.wav';
var $sound;

$(document).ready(init);

function init(){
  root = new Firebase('https://zelda-cdr.firebaseio.com/');
  characters = root.child('characters');
  items = root.child('items');

  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  $('#start-user').click(startUser);
  
  items.on('child_added', itemAdded);
  items.on('child_changed', itemChanged);

  characters.on('child_added', characterAdded);
  characters.on('child_changed', characterChanged);
  $('#create-character').click(createCharacter);

  $(document).keydown(keyDown);
  $sound = $('#sound');
  startTimer();

}

function itemChanged() {

}



function itemAdded(snapshot) {
  var item = snapshot.val();
  // console.log(item);
  var $td = $('#board td[data-x="'+item.x+'"][data-y="'+item.y+'"]');
  $td.addClass(item.name);
  $td.css('background-image', 'url("'+item.avatar+'")');
}

function startTimer() {
  setInterval(dropItems, 30000);
}

function dropItems() {
  var names = ['health', 'weapon' , 'blackhole'];
  var itemAvatars = ['http://www.thestar.com/content/dam/thestar/opinion/editorials/star_s_view_/2011/10/12/an_apple_a_day_not_such_a_good_idea/apple.jpeg','http://icons.iconarchive.com/icons/chrisl21/minecraft/512/Iron-Sword-icon.png','http://th05.deviantart.net/fs70/PRE/i/2013/087/b/e/vortex_stock_by_wyonet-d5zm8an.png'];
  var rnd =Math.floor(Math.random() * names.length);
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  var name = names[rnd];
  var avatar = itemAvatars[rnd];

  items.push({
    name: name,
    avatar: avatar,
    x: x,
    y: y
  });
}

function keyDown(event) {
  $sound.attr('src', move);
  $sound[0].play();

  var x = $('.'+myCharacter.handle).data('x');
  var y = $('.'+myCharacter.handle).data('y');
  // console.log(x,y);
  switch (event.keyCode) {
    case 37:
      x -= 1;
      break;
    case 38:
      y -= 1;
      break;
    case 39:
      x += 1;
      break;
    case 40:
      y += 1;
  }
  characters.child(myKey).update({x:x, y:y});
  event.preventDefault();
}

function characterChanged(snapshot){
  var character = snapshot.val();
  var $td = $('#board td[data-x="'+character.x+'"][data-y="'+character.y+'"]');
  $('#board > tbody td.' + character.handle).css('background-image', '');
  $('#board > tbody td').removeClass(character.handle);
  $td.addClass(character.handle);
  $td.css('background-image', 'url("'+character.avatar+'")');
}

function createCharacter(){
  var handle = $('#handle').val();
  var avatar = $('#avatar').val();
  var uid = root.getAuth().uid;

  characters.push({
    handle: handle,
    avatar: avatar,
    uid: uid
  });
}

function characterAdded(snapshot){
  var character = snapshot.val();
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  var active = '';
  // console.log('myUid', myUid);
  // console.log('character.uid', character.uid);
  if(myUid === character.uid){
    // console.log('in it');
    myKey = snapshot.key();
    active = 'active';
    myCharacter = snapshot.val();
  }

  var tr = '<tr class="'+active+'"><td>'+character.handle+'</td><td><img src="'+character.avatar+'"></td></tr>';
  $('#characters > tbody').append(tr);
}

function logoutUser(){
  root.unauth();
  myKey = null;
  $('#characters > tbody > tr.active').removeClass('active');
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error logging in:', error);
    }else{
      redrawCharacters();
    }
  });
}

function startUser(){
  // debugger;
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  characters.child(myKey).update({x:x, y:y});

}

function redrawCharacters(){
  $('#characters > tbody').empty();
  characters.off('child_added', characterAdded);
  characters.on('child_added', characterAdded);
}

function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.createUser({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error creating user:', error);
    }
  });
}
