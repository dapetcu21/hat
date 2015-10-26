var fs = require('fs'),
  xml2js = require('xml2js'),
  MIDIUtils = require('midiutils');

var parser = new xml2js.Parser();

fs.readFile(__dirname + '/song.xml', function(err, data) {
  parser.parseString(data, function(err, result) {

    var measures = result.part.measure;
    console.log('function setup(track) {\n');

    for (var i = 0 in measures) {

      var notes = measures[i].note;
      var dump = '';

      for (var j = 0 in notes) {

        var t = notes[j].type[0];
        var s = '';

        if (notes[j].rest) {
          s = s + '    .rest("' + t + '")\n';
        } else if (notes[j].pitch) {

          var x = notes[j].pitch[0].step[0];
          var x = x + (notes[j].pitch[0].alter ? 'b' : '');
          var x = x + notes[j].pitch[0].octave[0];

          s = s + '    .note("' + t + '", "' + x + '")\n';
        }

        dump += s;
      }

      console.log("  track\n" + dump);
    }

    console.log('}');
  });
});