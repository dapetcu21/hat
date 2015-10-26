(function () {

  $(document).on('click', function(e){
     console.log("X Axis : " + e.pageX + "px" + " Y Axis : " + e.pageY + "px");
  });


  room = new MAF.Room();
  var player = null;
  var color = [
    "red",
    "blue",
    "green",
    "yellow"
  ];

  room.addEventListener('joined', function (event) {
    console.log('user joined', event.user);
  });

  room.addEventListener('data', function (event) {
    var d = event.data;

    if (d.h === room.hash) {
      player = d.r;
      document.getElementById("player").className = document.getElementById("player").className + "player-" + color[0];
    }

    console.log('data', event.data);
  });

  button.on('touchstart', function () {
    room.send({ a: 'bd', b: 'a', p: player });  
  });

  button.on('touchmove', function () {
    room.send({ a: 'bm', b: 'b', p: player });
  });

  button.on('touchend', function () {
    room.send({ a: 'bu', b: 'a', p: player });
  });
  


  // Find the right method, call on correct element
  function launchIntoFullscreen(element) {
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

  // Launch fullscreen for browsers that support it!
  launchIntoFullscreen(document.documentElement); // the whole page

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