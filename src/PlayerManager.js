import audio from './audio';

export default class PlayerManager {
  constructor() {
    this.inGame = false;
    this.players = [];
    for (let i = 0; i < 4; i++) {
      this.players.push({
        user: null,
        connected: false,
        wins: 0,
      });
    }
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
      return;
    }

    const player = this.players[playerId];
    player.user = user;
    player.connected = true;
    this.room.send({ a: 'pl', h: user, p: playerId });
  }

  left(user) {
    const playerId = this._playerForUser(user);
    if (playerId === null) { return; }
    const player = this.players[playerId];
    if (!this.inGame) {
      player.user = null;
    }
    player.connected = false;
    audio.sfx.die.play();
  }

  onData(payload) {
    console.log('data', payload);
  }
}
