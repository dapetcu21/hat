import EventEmitter from 'events';

export const UP = 'u';
export const DOWN = 'd';
export const LEFT = 'l';
export const RIGHT = 'r';
export const A = 'a';
export const B = 'b';
export const START = 's';

export const buttons = [UP, DOWN, LEFT, RIGHT, A, B, START];

export default class Controls extends EventEmitter {
  constructor() {
    super();

    this.players = [];
    for (let i = 0; i < 4; i++) {
      const player = {};
      buttons.forEach(b => { player[b] = false; });
      this.players.push(player);
    }
  }

  playerLeft(player) {
    buttons.forEach(button => { this.setButton(player, button, false); });
  }

  getButton(playerId, button) {
    const player = this.players[playerId];
    return player[button];
  }

  setButton(playerId, button, state) {
    const player = this.players[playerId];
    if (player[button] !== state) {
      player[button] = state;
      this.emit(state ? 'buttonDown' : 'buttonUp', playerId, button);
    }
  }
}
