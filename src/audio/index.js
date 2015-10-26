import getResource from '../getResource';

class AudioManager {
  constructor() {
    this.sfx = {
      die: this.load('die.wav'),
    };
  }

  load(name) {
    const audio = new Audio(getResource('Images/' + name));
    return audio;
  }
}

export default new AudioManager();
