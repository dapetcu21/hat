import { Container, Sprite, extras, loader } from 'pixi';
import { linear, easeOutExpo, easeInOutSine } from 'easing';

import Screen from './Screen';
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

      colors.forEach(function(v, k) {
        loader.add(`car-${k}`, `Images/car-${v}.png`);
      });

    }, (resources) => {
      this.resources = resources;
      this.init();
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

      player.playing = true;

      player.container = new Container();
      player.container.x = (laneWidth * i + centerOffset) * width;
      this.gridContainer.addChild(player.container);

      player.carContainer = new Container();
      player.carContainer.x = (laneWidth * i + centerOffset) * width;
      this.gridContainer.addChild(player.carContainer);

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

    if (!player.playing) {
      return false;
    }

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

    if (this.hasCrashed(playerId)) {
      this.crash();
      return;
    }

    this.steerQueue = this.steerQueue || nopPromise();
    this.steerQueue = this.steerQueue.then(() => {
      return this.animations.addAnimation(0.1, linear, val => {
        player.car.position.x = val;
      }, (oldSide + 0.5) * player.car.width, (newSide + 0.5) * player.car.width);
    });
  }

  crash(player) {
    player.playing = false;
    this.steerQueue = this.steerQueue || nopPromise();
    this.steerQueue = this.steerQueue.then(() => {
      return this.animations.addAnimation(0.1, linear, val => {
        player.car.rotation = val;
      }, 0, Math.PI / 8);
    });
  }

  handleButtons(playerId, button) {

    if (!this.players[playerId].connected) {
      return;
    }

    switch (button) {
      case LEFT:
        //this.move(playerId);
        this.steer(playerId, 0);
        break;
      case RIGHT:
        //this.move(playerId);
        this.steer(playerId, 1);
        break;
      case A:
        this.move(playerId);
        break;
    }
  }

  render() {
    super.render();
  }

}
