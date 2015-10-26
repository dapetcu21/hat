(function () {

  navigator.vibrate = navigator.vibrate ||
       navigator.webkitVibrate ||
       navigator.mozVibrate ||
       navigator.msVibrate;

  var room = new MAF.Room(),
      $remote = $('#remote'),
      player = null,
      vibration = 200;

  var colors = [
    "red",
    "blue",
    "green",
    "yellow"
  ];

  var buttons = {
    "u": [],
    "d": [],
    "l": [],
    "r": [],
    "a": [],
    "b": [],
    "s": [],
  }

  var buttonMap = {
    "u": { ul: { x: 16.71, y: 22.00}, dr: { x: 25.46, y: 39.62} },
    "d": { ul: { x: 16.56, y: 58.72}, dr: { x: 24.84, y: 76.63} },
    "l": { ul: { x:  6.56, y: 41.71}, dr: { x: 15.93, y: 57.83} },
    "r": { ul: { x: 25.46, y: 40.81}, dr: { x: 35.31, y: 57.23} },
    "a": { ul: { x: 81.25, y: 20.81}, dr: { x: 94.53, y: 45.89} },
    "b": { ul: { x: 64.37, y: 53.65}, dr: { x: 77.34, y: 78.72} },
    "s": { ul: { x: 43.28, y: 43.50}, dr: { x: 57.03, y: 55.14} },
    "f": { ul: { x: 46.87, y: 19.02}, dr: { x: 52.65, y: 30.06} },
  }

  room.addEventListener('data', function (event) {

    var data = event.data;

    if (data.h !== room.user) {
      return;
    }

    switch (data.a) {

      case 'pl':
        player = data.p;
        $(".player").addClass("player-" + colors[0]);
        break;

      case 'rf':
        player = null;
        alert('Unable to connect!');
        break;

      case 'vi':
        vibration = data.d;
        setTimeout(function() { vibration = false; }, 2000);
        break;
    }

  });

  function vibrate(duration) {

    if (typeof duration !== 'undefined') {
      vibration = duration;
    }

    if (!vibration) {
      return false;
    }

    window.navigator.vibrate && vibration && window.navigator.vibrate(vibration);
    vibration = false;
  }

  function fullscreen(element) {

    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function send(data) {

  }

  function getCoord(btn) {

    var coord = buttonMap[btn];
    var $img = $('#remote');

    return {
      ul: {x: coord.ul.x, y: coord.ul.y * $img.height() + $img.offset().top},
      dr: {x: coord.dr.x, y: coord.dr.y * $img.height() + $img.offset().top},
    }
  }

  function getCollisions(touch) {

    var buttons = [];

    Object.keys(map).forEach(function(k) {

      var btn = getCoord(k);
      var imgy = $remote.cli

      if (
        btn.ul.y < touch.clientX
        && btn.dr.y > touch.clientY
      ) {

      }

    });

  }

  function handleTouch(e) {

    var changes = [];
    var tids = [];
    var event = e.originalEvent;

    vibrate();
    // fullscreen(document.documentElement);

    for(var i in event.touches) {
      tids.push(event.touches[i].identifier);
    }

    console.log(event);

    send(changes);
  }

  $remote.on('touchstart touchmove touchend', handleTouch);

  /* Prevent right click on desktop */
  document.addEventListener('mousedown', function (event) {
    if(event.button == 2) {
       return false;
    }
  }, false);

}());

var f = null;
var g = null;
var $w = $('#remote');

function getWidth() {
  f = $w.width / 640;
}

function getHeight() {
  g = $w.height * f;
}

function yAxis() {
  var a = x * 640 * 10;
  var b = y * 335 * 10;
  return z = g - b;
}
