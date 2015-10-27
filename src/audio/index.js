import getResource from '../getResource';

class AudioManager {

  constructor() {
    this.sfx = {
      die: this.load('die.wav'),
    };
  }

  musicStart() {

    if (!this.audio) {
      this.audio = new Audio(getResource('Sounds/music.ogg'));
      this.audio.loop = 1;
      this.rate = 1;
    }

    this.audio.play();
  }

  musicUp() {

    if (!this.audio) {
      return;
    }

    this.rate *= 1.1;
    this.audio.playbackRate = this.rate;
  }

  musicStop() {
    this.audio && this.audio.stop();
  }

  load(name) {
    const audio = new Audio(getResource('Sounds/' + name));
    return function () {
      audio.play();
    };
  }
}

export default new AudioManager();
