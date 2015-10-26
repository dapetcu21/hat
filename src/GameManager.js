import { Container, Text, Sprite, loader } from 'pixi';
import PlayerBar from './PlayerBar';
import PlayerManager from './PlayerManager';
import ScreenManager from './screens/ScreenManager';
import JoinScreen from './screens/JoinScreen';
import TronScreen from './screens/TronScreen';

const frameOffsetY = 195 / 1080;

export default class GameManager {
  constructor(renderer, setQRVisible) {
    this.renderer = renderer;
    this.stage = new Container();
    this.players = new PlayerManager();
    this.setQRVisible = setQRVisible;

    this.loaded = false;
    this.fontWorkaround = new Text(' ', {
      font: '1px VCR',
      fill: '#000000',
    });
    this.stage.addChild(this.fontWorkaround);
    process.nextTick(this.loadViews.bind(this));
  }

  loadViews() {
    this.loaded = true;
    this.stage.removeChild(this.fontWorkaround);
    this.fontWorkaround = null;

    this.playerBar = new PlayerBar(this);
    this.stage.addChild(this.playerBar.container);

    loader.add('bgFrame', 'Images/frame.png');
    loader.load((_, resources) => {
      const background = new Sprite(resources.bgFrame.texture);
      background.position.y = this.renderer.height * frameOffsetY;

      this.mainScreen = new ScreenManager(this);
      this.stage.addChild(this.mainScreen.bgContainer);
      this.stage.addChild(background);
      this.stage.addChild(this.mainScreen.container);
      this.mainScreen.setScreen(new JoinScreen(this, this.mainScreen));
    });
  }

  startGame() {
    const tron = new TronScreen(this, this.mainScreen);
    this.mainScreen.setScreen(tron);
  }

  render() {
    if (!this.loaded) {
      this.renderer.render(this.stage);
      return;
    }

    if (this.mainScreen) { this.mainScreen.render(); }

    this.playerBar.render();
    this.renderer.render(this.stage);
  }
}

