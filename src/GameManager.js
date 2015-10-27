import { Container, Text, Sprite, loader } from 'pixi';
import PlayerBar from './PlayerBar';
import PlayerManager from './PlayerManager';
import ScreenManager from './screens/ScreenManager';
import JoinScreen from './screens/JoinScreen';
import TronScreen from './screens/TronScreen';
import RoadBlockScreen from './screens/RoadBlockScreen';

const frameOffsetY = 90 / 1080;

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

    loader.add('bgFrame', 'Images/frame.png');
    loader.load((_, resources) => {
      const background = new Sprite(resources.bgFrame.texture);
      background.position.y = this.renderer.height * frameOffsetY;

      this.mainScreen = new ScreenManager(this);
      this.stage.addChild(this.mainScreen.bgContainer);
      this.stage.addChild(background);
      this.stage.addChild(this.mainScreen.container);
      this.stage.addChild(this.playerBar.container);
      this.goToJoin();
    });
  }

  goToJoin() {
    this.players.inGame = false;
    for (let i = 0; i < 4; i++) {
      this.players.players[i].wins = 0;
      this.players.players[i].score = 0;
    }
    this.mainScreen.setScreen(new JoinScreen(this, this.mainScreen));
  }

  nextLevel() {
    let game;
    console.log('next level');
    // game = new TronScreen(this, this.mainScreen);
    game = new RoadBlockScreen(this, this.mainScreen);
    this.mainScreen.setScreen(game);
  }

  addScore(playerId, score) {
    this.players.players[playerId].score += score;
  }

  endGame(winner) {
    if (winner !== null) {
      this.players.players[winner].wins++;
    }
    this.gamesLeft--;
    if (this.gamesLeft) {
      this.nextLevel();
    } else {
      this.goToJoin();
    }
  }

  startGame() {
    this.players.inGame = true;
    this.gamesLeft = 5;
    this.nextLevel();
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

