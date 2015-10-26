import { Container } from 'pixi';
import PlayerBar from './PlayerBar';
import PlayerManager from './PlayerManager';

export default class GameManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.stage = new Container();
    this.players = new PlayerManager();

    this.playerBar = new PlayerBar(this);
    this.stage.addChild(this.playerBar.container);
  }

  render() {
    this.playerBar.render();
    this.renderer.render(this.stage);
  }
}

