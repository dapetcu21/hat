import { Container, Sprite, extras, loader } from 'pixi';
import { linear, easeOutExpo } from 'easing';

import Screen from './Screen';
import { UP, DOWN, LEFT, RIGHT } from '../Controls';

const gridY = 242 / 1080;
const gridX = 81 / 1920;
const gridHeight = 884 / 1080;
const gridWidth = 1 - 2 * gridX;
const rows = 20;
const columns = 45;
const velocity = 10; // squares per second;

function getRotation(dx, dy) {
  switch ((dx + 1) * 4 + (dy + 1)) {
    case 9:
      return 0;
    case 6:
      return Math.PI * 0.5;
    case 1:
      return Math.PI;
    case 4:
      return Math.PI * (3 / 2);
  }
}

export default class TronScreen extends Screen {
  show() {
    const { width, height } = this.manager.renderer;

    loader.add('tronGrid', 'Images/tron-grid.png');
    loader.add('tronBike0', 'Images/bike-red.png');
    loader.add('tronBike1', 'Images/bike-green.png');
    loader.add('tronBike2', 'Images/bike-blue.png');
    loader.add('tronBike3', 'Images/bike-yellow.png');
    loader.add('tronBikeInactive', 'Images/bike-disabled.png');
    loader.load((_, resources) => {
      this.resources = resources;

      const grid = new extras.TilingSprite(resources.tronGrid.texture,
        gridWidth * width,
        gridHeight * height
      );
      grid.position.x = gridX * width;
      grid.position.y = gridY * height;
      this.bgContainer.addChild(grid);

      grid.tileScale.x = 0.5;
      grid.tileScale.y = 0.5;
      grid.alpha = 0;

      this.animations.addAnimation(2, easeOutExpo, val => {
        const tileScale = 0.5 + 0.5 * val;
        grid.tileScale.x = tileScale;
        grid.tileScale.y = tileScale;
        grid.alpha = val;

      }).then(() => {
        this.initializeState();
      });
    });
  }

  initializeState() {
    const { width, height } = this.manager.renderer;

    const grid = [];
    for (let i = 0; i < columns; i++) {
      const column = [];
      grid.push(column);
      for (let j = 0; j < rows; j++) {
        column.push({
          occupied: !i || !j || i === columns - 1 || j === rows - 1,
        });
      }
    }

    this.grid = grid;

    const startingPositions = [
      () => ({ x: 0, y: 1 + Math.floor(Math.random() * (rows - 2)), dx: 1, dy: 0 }),
      () => ({ x: columns - 1, y: 1 + Math.floor(Math.random() * (rows - 2)), dx: -1, dy: 0 }),
      () => ({ x: 1 + Math.floor(Math.random() * (columns - 2)), y: 0, dx: 0, dy: 1 }),
      () => ({ x: 1 + Math.floor(Math.random() * (columns - 2)), y: rows - 1, dx: 0, dy: -1 }),
    ];

    const gridContainer = new Container();
    this.gridContainer = gridContainer;
    gridContainer.position.x = gridX * width;
    gridContainer.position.y = gridY * height;
    this.bgContainer.addChild(gridContainer);

    this.handleButtons = this.handleButtons.bind(this);
    this.manager.players.controls.addListener('buttonDown', this.handleButtons);

    const players = [];
    this.players = players;
    const playersState = this.manager.players.players;
    for (let i = 0; i < 4; i++) {
      const player = {};
      players.push(player);

      player.connected = playersState[i].connected;
      if (!player.connected) { continue; }

      player.position = startingPositions.shift()();

      const bike = new Sprite(this.resources['tronBike' + i].texture);
      bike.anchor.x = 0.5;
      bike.anchor.y = 0.5;
      player.bike = bike;
      gridContainer.addChild(bike);
    }

  }

  handleButtons(playerId, button) {
    if (!this.grid) { return; }
    if (!this.players[playerId].connected) { return; }
    console.log(playerId, button);
    switch (button) {
      case UP:
      case DOWN:
      case LEFT:
      case RIGHT:
        this.players[playerId].lastButton = button;
        break;
    }
  }

  render() {
    super.render();

    const time = Date.now() / 1000;
    const elapsed = this.lastTime ? time - this.lastTime : 0;
    this.lastTime = time;

    if (!this.grid) { return; }
    const gridItem = this.resources.tronGrid.texture;

    for (let i = 0; i < 4; i++) {
      const player = this.players[i];
      if (!player.connected) { continue; }

      const oldX = player.position.x;
      const oldY = player.position.y;
      player.position.x += player.position.dx * velocity * elapsed;
      player.position.y += player.position.dy * velocity * elapsed;

      const junctionX = Math.round(player.position.x);
      const junctionY = Math.round(player.position.y);

      if ((player.position.x > junctionX && oldX <= junctionX) ||
          (player.position.x < junctionX && oldX >= junctionX)) {

        if (player.lastButton === UP) {
          player.position.x = junctionX;
          player.position.dx = 0;
          player.position.dy = -1;

        } else if (player.lastButton === DOWN) {
          player.position.x = junctionX;
          player.position.dx = 0;
          player.position.dy = 1;
        }
      }

      if ((player.position.y > junctionY && oldY <= junctionY) ||
          (player.position.y < junctionY && oldY >= junctionY)) {

        if (player.lastButton === LEFT) {
          player.position.y = junctionY;
          player.position.dx = -1;
          player.position.dy = 0;

        } else if (player.lastButton === RIGHT) {
          player.position.y = junctionY;
          player.position.dx = 1;
          player.position.dy = 0;
        }
      }

      const bike = player.bike;
      let oldRotation = bike.rotation;
      const newRotation = getRotation(player.position.dx, player.position.dy);

      if (oldRotation !== newRotation) {
        if (newRotation - oldRotation > Math.PI) {
          oldRotation += 2 * Math.PI;
        } else if (oldRotation - newRotation > Math.PI) {
          oldRotation -= 2 * Math.PI;
        }

        this.animations.addAnimation(1 / velocity, linear, val => {
          bike.rotation = val;
        }, oldRotation, newRotation);
      }

      bike.position.x = player.position.x * gridItem.width;
      bike.position.y = player.position.y * gridItem.height;
    }

  }

  destroy() {
    this.manager.players.controls.removeListener('buttonDown', this.handleButtons);
  }
}
