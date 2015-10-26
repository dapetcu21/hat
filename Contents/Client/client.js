(function () {
  room = new MAF.Room();

  room.addEventListener('joined', function (event) {
    console.log('user joined', event.user);
  });

  room.addEventListener('data', function (event) {
    console.log('data', event.data);
  });
}());
