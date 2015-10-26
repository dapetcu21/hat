(function () {
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
  
}());
