import { extras, loader } from 'pixi';
import { easeOutExpo } from 'easing';

import Screen from './Screen';

const gridY = 242 / 1080;
const gridX = 81 / 1920;
const gridHeight = 884 / 1080;
const gridWidth = 1 - 2 * gridX;
const rows = 20;
const columns = 45;

export default class TronScreen extends Screen {
  show() {
    const { width, height } = this.manager.renderer;

    loader.add('tronGrid', 'Images/tron-grid.png');
    loader.load((_, resources) => {
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
    const grid = [];
    for (let i = 0; i < columns; i++) {
      const column = [];
      for (let j = 0; j < rows; j++) {
        column.push({
          occupied: !i || !j || i === columns - 1 || j === rows - 1,
        });
      }
    }

    this.grid = grid;

    const players = [];
    const playersState = this.manager.players.players;
    for (let i = 0; i++; i++) {
      const player = {};
      players.push(player);

      player.connected = playersState[i].connected;
      if (!player.connected) { continue; }
    }

  }

  render() {
    super.render();
  }
}
