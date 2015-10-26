import { Container, Text } from 'pixi';

const marginHorizontal = 52/1366;
const marginVertical = 57/768;
const playerWidth = 300/1366;
const playerHeight = 93/768;
const interPlayerMargin = (1 - 2 * marginHorizontal - 4 * playerWidth) / 3;

export default class PlayerBar {
  constructor(manager) {
    this.manager = manager;
    this.container = new Container();
    this.players = [];
    this.playerLabels = [];
    this.playerAvatars = [];
    this.playerWins = [];

    const { width, height } = this.manager.renderer;

    for (let i = 0; i < 4; i++) {
      const player = new Container();
      player.position.y = (marginVertical) * height;
      player.position.x = (marginHorizontal + (interPlayerMargin + playerWidth) * i) * width;

      this.players.push(player);
      this.container.addChild(player);

      console.log(player);

      const label = new Text(`PLAYER ${i + 1}`, {
        font: '36px VCR',
        fill: '#ffffff',
      });

      label.x = 0;
      label.y = 0;

      player.addChild(label);
      this.playerLabels.push(label);

      //const wins = new Text('WINS: 0', {
        //font: 'bold italic 36px Arial',
        //fill: '#ffffff',
      //});

      //wins.x = 0;
      //wins.y = 0;

      //player.addChild(wins);
      //this.playerWins.push(wins);
    }
  }

  render() {
  }
}
