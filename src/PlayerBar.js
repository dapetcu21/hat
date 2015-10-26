import { Sprite, Container, Text, loader } from 'pixi';

const marginHorizontal = 52 / 1366;
const marginVertical = 57 / 768;
const playerWidth = 300 / 1366;
const playerHeight = 93 / 768;
const interPlayerMargin = (1 - 2 * marginHorizontal - 4 * playerWidth) / 3;
const labelOffsetY = 10 / 768;
const labelOffsetX = 110 / 1366;
const winsOffsetX = labelOffsetX;
const winsOffsetY = 44 / 768;

export default class PlayerBar {
  constructor(manager) {
    this.manager = manager;
    this.container = new Container();
    this.players = [];

    const { width, height } = this.manager.renderer;

    console.log(width, height);

    loader.add('avatar0', 'Images/player-red.png');
    loader.add('avatar1', 'Images/player-yellow.png');
    loader.add('avatar2', 'Images/player-blue.png');
    loader.add('avatar3', 'Images/player-green.png');
    loader.add('avatarInactive', 'Images/player-inactive.png');
    loader.load((loader, resources) => {
      this.loaded = true;

      for (let i = 0; i < 4; i++) {
        const player = new Container();
        player.position.y = (marginVertical) * height;
        player.position.x = (marginHorizontal + (interPlayerMargin + playerWidth) * i) * width;

        this.container.addChild(player);

        const avatar = new Sprite(resources['avatar' + i].texture);
        avatar.width = playerHeight * height;
        avatar.height = playerHeight * height;
        player.addChild(avatar);

        const avatarInactive = new Sprite(resources.avatarInactive.texture);
        avatarInactive.width = playerHeight * height;
        avatarInactive.height = playerHeight * height;
        player.addChild(avatarInactive);

        const label = new Text(`PLAYER ${i + 1}`, {
          font: '35px VCR, arial',
          fill: '#ffffff',
        });

        label.x = labelOffsetX * width;
        label.y = labelOffsetY * height;

        player.addChild(label);

        const wins = new Text('', {
          font: '25px VCR, arial',
          fill: '#aaaaaa',
        });

        wins.x = winsOffsetX * width;
        wins.y = winsOffsetY * height;

        player.addChild(wins);

        this.players.push({
          container: player,
          avatar,
          avatarInactive,
          label,
          wins,
        });
      }
    });
  }

  render() {
    if (!this.loaded) { return; }

    for (let i = 0; i < 4; i++) {
      const playerState = this.manager.players.players[i];
      const player = this.players[i];

      player.avatar.visible = !!playerState.connected;
      player.avatarInactive.visible = !playerState.connected;

      player.wins.text = playerState.connected ? `WINS: ${playerState.wins}` : `NOT CONNECTED`;
      player.wins.alpha = playerState.connected ? 1 : 1;
      player.label.alpha = playerState.connected ? 1 : 1;
    }
  }
}
