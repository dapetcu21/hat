import Screen from './Screen';
import { Sprite, Container, Text, loader, extras } from 'pixi';

const frameOffsetX = 70 / 1080;
const frameOffsetY = 238 / 1920;

export default class JoinScreen extends Screen {
  constructor() {
    super();
    this.manager.setQRVisible(true);

    loader.add('bgFrame', 'Images/game-bg.png');
    loader.load((loader, resources) => {
      //this.
    });
  }

  destroy() {
    this.manager.setQRVisible(false);
  }
}
