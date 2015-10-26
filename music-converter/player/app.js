var musicPlayer;

function Music() {;

  if (musicPlayer) {
    return musicPlayer;
  }

  var conductor = new BandJS();
  conductor.setTimeSignature(4, 4);
  conductor.setTempo(120);

  var track = conductor.createInstrument('square', 'oscillators');
  setup(track);

  musicPlayer = conductor.finish();
  musicPlayer.play();

  return musicPlayer;
}

function Die() {

  var conductor = new BandJS();
  conductor.setTimeSignature(4, 4);
  conductor.setTempo(120);

  var drum = conductor.createInstrument('white', 'noises');;
  drum.setVolume(80);
  drum.note("eighth", "B3", true);
  drum.setVolume(40);
  drum.note("eighth", "B3", true);;

  var fxplayer = conductor.finish();
  fxplayer.play();

  return fxplayer;
}

Music();
