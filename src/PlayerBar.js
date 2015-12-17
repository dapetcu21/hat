import { Sprite, Container, Text, loader } from 'pixi';
import getResource from './getResource';

const marginHorizontal = 52 / 1366;
const marginVertical = 40 / 768;
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

    loader.add('avatar0', getResource('Images/player-red.png'));
    loader.add('avatar1', getResource('Images/player-green.png'));
    loader.add('avatar2', getResource('Images/player-blue.png'));
    loader.add('avatar3', getResource('Images/player-yellow.png'));
    loader.add('avatarInactive', getResource('Images/player-inactive.png'));
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
          font: '40px VCR, arial',
          fill: '#ffffff',
        });

        label.x = labelOffsetX * width;
        label.y = labelOffsetY * height;

        player.addChild(label);

        const wins = new Text('', {
          font: '31px VCR, arial',
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
    const playerSelect = !!this.manager.playerSelect;
    const pulse = Math.abs(Math.sin(Date.now() / 500));

    for (let i = 0; i < 4; i++) {
      const playerState = this.manager.players.players[i];
      const player = this.players[i];

      player.avatar.visible = !!playerState.connected;
      player.avatarInactive.visible = !playerState.connected;

      player.wins.text = playerState.connected ? playerSelect ? playerState.ready ? 'READY' : 'PRESS START' : `SCORE: ${Math.round(playerState.score)}` : `NOT CONNECTED`;
      player.wins.style.fill = (playerState.connected && playerSelect && playerState.ready) ? '#1ba24b' : '#aaaaaa';
      player.wins.alpha = playerState.connected ? (playerSelect && !playerState.ready) ? pulse : 1 : 0.6;
      player.label.alpha = playerState.connected ? 1 : 1;
    }
  }
}
