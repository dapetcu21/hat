(function () {
  room = new MAF.Room();
  var player = null;

  room.addEventListener('data', function (event) {
    var data = event.data;
    console.log(data);
    if (data.a === 'pl' && data.h === room.user) {
      player = data.p;
      console.log('player', player);
    }
  });

  var map = {
    'up-arrow': 'u',
    'down-arrow': 'd',
    'left-arrow': 'l',
    'right-arrow': 'r',
    'remote-start': 's',
    'a-button': 'a',
    'b-button': 'b',
  };

  Object.keys(map).forEach(function (cls) {
    var button = document.getElementsByClassName(cls)[0];
    button.addEventListener('touchstart', function () {
      room.send({ a: 'bd', b: map[cls], p: player });
      room.send({ a: 'bu', b: map[cls], p: player });
    });
  });

}());
