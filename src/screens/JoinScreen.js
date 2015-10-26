import { Sprite, Text, loader } from 'pixi';
import { linear } from 'easing';

import Screen from './Screen';
import { START } from '../Controls';

const frameOffsetX = 70 / 1920;
const frameOffsetY = 238 / 1080;
const scanToJoinOffset = 210 / 768;

export default class JoinScreen extends Screen {
  show() {
    this.manager.setQRVisible(true, true);
    this.manager.playerSelect = true;

    const { width, height } = this.manager.renderer;

    const players = this.manager.players;
    this.buttonDown = this.buttonDown.bind(this);
    players.controls.addListener('buttonDown', this.buttonDown);
    for (let i = 0; i < 4; i++) {
      players.players[i].ready = false;
    }

    const label = new Text('SCAN TO JOIN!', {
      font: '62px VCR, arial',
      fill: '#ffffff',
    });
    label.x = 0.5 * width;
    label.y = scanToJoinOffset * height;
    label.anchor.x = 0.5;
    this.label = label;
    this.container.addChild(label);
  }

  buttonDown(player, button) {
    if (button === START) {
      const players = this.manager.players.players;
      players[player].ready = true;
      for (let i = 0; i < 4; i++) {
        const playerState = players[i];
        if (playerState.connected && !playerState.ready) {
          return;
        }
      }
      this.manager.startGame();
    }
  }

  destroy() {
    this.manager.players.controls.removeListener('buttonDown', this.buttonDown);
    this.manager.setQRVisible(false, true);

    return this.animations.addAnimation(0.5, linear, val => {
      this.label.alpha = 1 - val;
    }).then(() => {
      this.manager.playerSelect = false;
      console.log('done');
    });
  }
}
