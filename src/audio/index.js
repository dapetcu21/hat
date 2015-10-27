import getResource from '../getResource';

class AudioManager {

  constructor() {
    this.sfx = {
      connect: this.load('connect.wav'),
      disconnect: this.load('disconnect.wav'),
      die: this.load('die.wav'),
      finish: this.load('finish.wav'),
    };
  }

  musicStart() {

    if (!this.audio) {
      this.audio = new Audio(getResource('Sounds/music.ogg'));
    }

    this.audio.loop = 1;
    this.rate = 1;
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

    if (!this.audio) {
      return;
    }

    this.audio.pause();
    delete this.audio;
  }

  load(name) {
    const audio = new Audio(getResource('Sounds/' + name));
    return function () {
      audio.play();
    };
  }
}

export default new AudioManager();
