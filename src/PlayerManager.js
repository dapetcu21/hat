import audio from './audio';
import { EventEmitter } from 'events';
import Controls from './Controls';

export default class PlayerManager {
  constructor() {
    this.inGame = false;
    this.players = [];
    for (let i = 0; i < 4; i++) {
      this.players.push({
        user: null,
        connected: false,
        wins: 0,
        score: 0,
      });
    }

    this.controls = new Controls();
    this.controls.addListener('buttonDown', (player, button) => {
      console.log('buttonDown', player, button);
    });
    this.controls.addListener('buttonUp', (player, button) => {
      console.log('buttonUp', player, button);
    });
  }

  clear() {
    for (let i = 0; i < 4; i++) {
      if (this.players[i].user) {
        this.left(this.players[i].user);
      }
    }
  }

  _playerForUser(user) {
    for (let i = 0; i < 4; i++) {
      if (this.players[i].user === user) {
        return i;
      }
    }
    return null;
  }

  joined(user) {
    console.log(this.room.user, this.room.hash);
    console.log(user);
    let playerId = this._playerForUser(user);

    if (playerId === null && !this.inGame) {
      for (let i = 0; i < 4; i++) {
        if (!this.players[i].user) {
          playerId = i;
          break;
        }
      }
    }

    if (playerId === null) {
      this.room.send({ a: 'rf', h: user });
      return;
    }

    const player = this.players[playerId];
    player.user = user;
    player.connected = true;
    this.room.send({ a: 'pl', h: user, p: playerId });
    audio.sfx.connect();
  }

  left(user) {
    const playerId = this._playerForUser(user);
    if (playerId === null) { return; }
    let player = this.players[playerId];
    player = {
      user: this.inGame ? player.user : null,
      connected: false,
      wins: 0,
      score: 0,
    };
    this.players[playerId] = player;
    this.controls.playerLeft(playerId);
    audio.sfx.disconnect();
  }

  onData(payload) {
    const data = payload.data;
    switch (data.a) {
      case 'bu':
      case 'bd':
        this.controls.setButton(data.p, data.b, data.a === 'bd');
        break;
    }
  }
}
