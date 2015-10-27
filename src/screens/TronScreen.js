import { Container, Sprite, Text, extras, loader } from 'pixi';
import { linear, easeOutExpo, easeInExpo, easeInOutExpo } from 'easing';

import Screen from './Screen';
import { UP, DOWN, LEFT, RIGHT } from '../Controls';

const gridY = 242 / 1080;
const gridX = 81 / 1920;
const gridHeight = 884 / 1080;
const gridWidth = 1 - 2 * gridX;
const readyPosY = 440 / 768;
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
    loader.add('tronTrail0', 'Images/trail-red.png');
    loader.add('tronTrail1', 'Images/trail-green.png');
    loader.add('tronTrail2', 'Images/trail-blue.png');
    loader.add('tronTrail3', 'Images/trail-yellow.png');
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
      });

      this.initializeState();
      this.render(0.5 / velocity);
      this.paused = true;

      this.animations.addAnimation(2, easeOutExpo, val => {
        const tileScale = 0.5 + 0.5 * val;
        grid.tileScale.x = tileScale;
        grid.tileScale.y = tileScale;
        grid.alpha = val;

      }).then(() => {
        this.paused = false;

        const goText = new Text('GO!', {
          font: '93px VCR',
          fill: '#ffffff',
        });
        goText.anchor.x = 0.5;
        goText.anchor.y = 0.5;
        goText.y = readyPosY * height;
        goText.x = 0.5 * width;
        this.container.addChild(goText);

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
      player.trailOrigin = Object.assign({}, player.position);

      const trailContainer = new Container();
      const trailTexture = this.resources['tronTrail' + i].texture;
      player.trailTexture = trailTexture;
      player.trailContainer = trailContainer;
      gridContainer.addChild(trailContainer);

      const bikeContainer = new Container();
      const inactiveBike = new Sprite(this.resources.tronBikeInactive.texture);
      const bike = new Sprite(this.resources['tronBike' + i].texture);
      bike.anchor.x = 0.5;
      bike.anchor.y = 0.5;
      inactiveBike.anchor.y = 0.5;
      inactiveBike.anchor.x = 0.5;
      inactiveBike.visible = false;
      bikeContainer.addChild(inactiveBike);
      bikeContainer.addChild(bike);

      player.bike = bikeContainer;
      player.bikeSprite = bike;
      player.inactiveBikeSprite = inactiveBike;
    }

    for (let i = 0; i < 4; i++) {
      const player = players[i];
      if (!player.connected) { continue; }
      gridContainer.addChild(player.bike);
    }

    this.activePlayers = 4 - startingPositions.length;
  }

  handleButtons(playerId, button) {
    if (!this.grid) { return; }
    if (!this.players[playerId].connected) { return; }
    switch (button) {
      case UP:
      case DOWN:
      case LEFT:
      case RIGHT:
        this.players[playerId].lastButton = button;
        break;
    }
  }

  playerDied(index) {
    const player = this.players[index];
    player.died = true;
    this.activePlayers--;

    const wait = () => this.animations.addAnimation(0.2, linear, () => {});

    const setState = state => {
      player.bikeSprite.visible = state;
      player.inactiveBikeSprite.visible = !state;
    };

    setState(false);

    wait()
      .then(() => { setState(true); })
      .then(wait)
      .then(() => { setState(false); })
      .then(wait)
      .then(() => { setState(true); })
      .then(wait)
      .then(() => { setState(false); });

    if (this.activePlayers <= 1) {
      let winner = null;
      for (let i = 0; i < 4; i++) {
        if (this.players[i].connected && !this.players[i].died) {
          winner = i;
          break;
        }
      }
      this.endGame(winner);
    }
  }

  adjustTrail(player, gridItem) {
    const { x, y, dx, dy } = player.trailOrigin;

    if (!player.trail) {
      const trail = new Sprite(player.trailTexture);
      trail.anchor.x = 0;
      trail.anchor.y = 0.5;
      trail.rotation = getRotation(dx, dy);
      trail.position.x = x * gridItem.width - dx * player.trailTexture.height * 0.5;
      trail.position.y = y * gridItem.height - dy * player.trailTexture.height * 0.5;
      player.trail = trail;
      player.trailContainer.addChild(trail);
    }

    player.trail.width = player.trailTexture.height + (Math.abs(player.position.x - x) + Math.abs(player.position.y - y)) * gridItem.width;
  }

  render(elapsedTime) {
    super.render();

    const time = Date.now() / 1000;
    const elapsed = elapsedTime || (this.lastTime ? time - this.lastTime : 0);
    this.lastTime = time;

    if (!this.grid) { return; }
    if (this.paused) { return; }
    const gridItem = this.resources.tronGrid.texture;

    for (let i = 0; i < 4; i++) {
      const player = this.players[i];
      if (!player.connected) { continue; }

      if (!player.died && elapsedTime === undefined) {
        this.manager.addScore(i, elapsed * 1000);
      }

      const oldX = player.position.x;
      const oldY = player.position.y;
      if (!player.died) {
        player.position.x += player.position.dx * velocity * elapsed;
        player.position.y += player.position.dy * velocity * elapsed;
      }

      const oldJunctionX = Math.round(oldX);
      const oldJunctionY = Math.round(oldY);
      const junctionX = Math.round(player.position.x);
      const junctionY = Math.round(player.position.y);

      if (oldJunctionX !== junctionX || oldJunctionY !== junctionY) {
        if (this.grid[junctionX][junctionY].occupied) {
          this.playerDied(i);
        }

        this.grid[junctionX][junctionY].occupied = true;
      }

      if (!player.died &&
          ((player.position.x > junctionX && oldX <= junctionX) ||
          (player.position.x < junctionX && oldX >= junctionX))) {

        if (player.lastButton === UP) {
          player.position.x = junctionX;
          player.position.dx = 0;
          player.position.dy = -1;
          player.trail = null;
          player.trailOrigin = Object.assign({}, player.position);

        } else if (player.lastButton === DOWN) {
          player.position.x = junctionX;
          player.position.dx = 0;
          player.position.dy = 1;
          player.trail = null;
          player.trailOrigin = Object.assign({}, player.position);
        }
      }

      if (!player.died &&
          ((player.position.y > junctionY && oldY <= junctionY) ||
          (player.position.y < junctionY && oldY >= junctionY))) {

        if (player.lastButton === LEFT) {
          player.position.y = junctionY;
          player.position.dx = -1;
          player.position.dy = 0;
          player.trail = null;
          player.trailOrigin = Object.assign({}, player.position);

        } else if (player.lastButton === RIGHT) {
          player.position.y = junctionY;
          player.position.dx = 1;
          player.position.dy = 0;
          player.trail = null;
          player.trailOrigin = Object.assign({}, player.position);
        }
      }

      this.adjustTrail(player, gridItem);

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
    //return this.animations.addAnimation(0.5, val => {
      //this.bgContainer.alpha = val;
    //}, 1, 0);
  }
}
