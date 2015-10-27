import { Container, Sprite, Text, extras } from 'pixi';
import { linear, easeOutExpo, easeInOutSine, easeInOutExpo, easeInExpo } from 'easing';

import Screen from './Screen';
import Audio from '../audio';
import { A, LEFT, RIGHT } from '../Controls';
import { Promise } from 'es6-promise';

function nopPromise() {
  return new Promise(resolve => { resolve(); });
}

const gridY = 242 / 1080;
const gridX = 81 / 1920;
const gridHeight = 884 / 1080;
const gridWidth = 1 - 2 * gridX;
const laneWidth = gridWidth / 4;
const centerOffset = 109 / 1920;
const readyPosY = 440 / 768;

const colors = [
  'red',
  'green',
  'blue',
  'yellow',
];

export default class RoadBlockScreen extends Screen {

  show() {

    this.loadResources((loader) => {

      loader.add('roadBlock-false-false', 'Images/road-block-free.png');
      loader.add('roadBlock-true-false', 'Images/road-block-left.png');
      loader.add('roadBlock-false-true', 'Images/road-block-right.png');

      colors.forEach((v, k) => {
        loader.add(`car-${k}`, `Images/car-${v}.png`);
      });

    }, (resources) => {
      this.resources = resources;
      this.paused = true;
      this.init();

      const { width, height } = this.manager.renderer;

      const readyText = new Text('READY!', {
        font: '93px VCR',
        fill: '#ffffff',
      });
      readyText.anchor.x = 0.5;
      readyText.anchor.y = 0.5;
      readyText.y = readyPosY * height;
      this.container.addChild(readyText);

      this.animations.addAnimation(1, easeOutExpo, val => {
        readyText.x = val;

      }, -0.25 * width, 0.5 * width).then(() => {
        return this.animations.addAnimation(1, easeInExpo, val => {
          readyText.x = val;
        }, 0.5 * width, 1.25 * width);

      }).then(() => {
        this.container.removeChild(readyText);

      }).then(() => {
        const goText = new Text('GO!', {
          font: '93px VCR',
          fill: '#ffffff',
        });
        goText.anchor.x = 0.5;
        goText.anchor.y = 0.5;
        goText.y = readyPosY * height;
        goText.x = 0.5 * width;
        this.container.addChild(goText);

        this.paused = false;

        return this.animations.addAnimation(1, easeInOutExpo, val => {
          const scale = 2 - val;
          goText.scale.x = scale;
          goText.scale.y = scale;
          goText.alpha = val;
        }, 1, 0).then(() => {
          this.container.removeChild(goText);
        });

      });

    });
  }

  addRandomBlock(player) {

    var lastSection = false;

    if (this.sections[player] && this.sections[player][0]) {
      lastSection = this.sections[player][0];
    }

    const section = {
      left:  false,
      right: false,
    }

    if (!lastSection || (!lastSection.left && !lastSection.right)) {
      var addBranch = Math.round(Math.random() * 2) === 0;

      if (addBranch) {
        var where = Math.round(Math.random()) ? 'left' : 'right';
        section[where] = true;
      }
    }

    const sprite = new Sprite(this.resources[`roadBlock-${section.left}-${section.right}`].texture);
    sprite.position.x = 0;
    section.sprite = sprite;

    this.players[player].container.addChild(sprite);
    this.sections[player].unshift(section);
    let pos = 0;

    this.sections[player].forEach(s => {
      s.sprite.position.y = pos;
      pos += s.sprite.height;
    });
  }

  init() {

    const { width, height } = this.manager.renderer;
    const container = new Container();
    const playersState = this.manager.players.players;
    const players = [];

    container.position.x = gridX * width;
    container.position.y = gridY * height;

    this.bgContainer.addChild(container);
    this.gridContainer = container;
    this.sections = [[], [], [], []];

    this.players = players;

    for (let i = 0; i < 4; i++) {

      const player = {};
      players.push(player);

      player.connected = playersState[i].connected;
      if (!player.connected) { continue; }

      player.id = i;
      player.playing = true;

      player.container = new Container();
      player.container.alpha = 0;
      player.container.x = (laneWidth * i + centerOffset) * width;
      this.gridContainer.addChild(player.container);

      player.carContainer = new Container();
      player.carContainer.alpha = 0;
      player.carContainer.x = (laneWidth * i + centerOffset) * width;
      this.gridContainer.addChild(player.carContainer);

      this.animations.addAnimation(0.1 + 0.3 * i, linear, () => {}).then(() => {
        console.log('delay passed');
        return this.animations.addAnimation(0.5, easeOutExpo, val => {
          player.container.alpha = val;
          player.carContainer.alpha = val;
        });
      });

      player.side = 0;

      player.car = new Sprite(this.resources[`car-${i}`].texture);
      player.car.anchor.x = 0.5;
      player.car.position.y = player.car.height * 4;
      player.car.position.x = (player.side + 0.5) * player.car.width;
      player.carContainer.addChild(player.car);

      console.log(player.car.position);

      for (let j = 0; j < 5; j++) {
        this.addRandomBlock(i);
      }
    }

    this.handleButtons = this.handleButtons.bind(this);
    this.manager.players.controls.addListener('buttonDown', this.handleButtons);
  }

  hasCrashed(playerId) {
    const sections  = this.sections[playerId];
    const player    = this.players[playerId];
    const currentSection = sections[sections.length - 1];

    return (currentSection.left && player.side === 0) ||
           (currentSection.right && player.side === 1);
  }

  move(playerId) {

    const sections  = this.sections[playerId];
    const player    = this.players[playerId];
    const container = player.container;

    if (!player.playing || player.moving) {
      return false;
    }
    player.moving = true;

    let spriteToRemove = null;

    this.animationQueue = this.animationQueue || nopPromise();
    this.animationQueue = this.animationQueue.then(() => {
      this.addRandomBlock(playerId);
      const spriteHeight = sections[0].sprite.height;
      container.position.y -= spriteHeight;

      const section = sections.pop();
      spriteToRemove = section.sprite;

      return spriteHeight;
    }).then((spriteHeight) => {

      if (this.hasCrashed(playerId)) {
        this.crash(player);
      } else {
        this.manager.addScore(playerId, 100);
      }

      return this.animations.addAnimation(0.15, easeInOutSine, (val, delta) => {
        container.position.y += delta;
      }, 0, spriteHeight);

    }).then(() => {
      player.moving = false;
      if (spriteToRemove) {
        container.removeChild(spriteToRemove);
      }
    });
  }

  steer(playerId, newSide) {

    const player = this.players[playerId];
    const oldSide = player.side;

    if (!player.playing) { return; }

    player.side = newSide;
    if (oldSide === newSide) { return; }

    const hasCrashed = this.hasCrashed(playerId);

    this.steerQueue = this.steerQueue || nopPromise();
    this.steerQueue = this.steerQueue.then(() => {
      return this.animations.addAnimation(0.1, linear, val => {
        player.car.position.x = val;
      }, (oldSide + 0.5) * player.car.width, (newSide + 0.5) * player.car.width);

    }).then(() => {
      if (hasCrashed) {
        this.crash(player);
      }
    });
  }

  crash(player) {
    player.playing = false;
    Audio.sfx.die();
    this.steerQueue = this.steerQueue || nopPromise();
    this.steerQueue = this.steerQueue.then(() => {
      return this.animations.addAnimation(0.1, linear, val => {
        player.car.rotation = val;
      }, 0, Math.PI / 8);

    }).then(() => {
      for (let i = 0; i < 4; i++) {
        const p = this.players[i];
        if (p.connected && p.playing) {
          return null;
        }
      }

      return this.animations.addAnimation(1, linear, () => {}).then(() => {
        this.manager.endGame(player.id);
      });
    });
  }

  handleButtons(playerId, button) {
    if (this.paused) {
      return;
    }

    if (!this.players[playerId].connected) {
      return;
    }

    switch (button) {
      case LEFT:
        this.steer(playerId, 0);
        break;
      case RIGHT:
        this.steer(playerId, 1);
        break;
      case A:
        this.move(playerId);
        break;
    }
  }

  destroy() {
    return this.animations.addAnimation(0.5, linear, val => {
      this.bgContainer.alpha = val;
    }, 1, 0);
  }
}
