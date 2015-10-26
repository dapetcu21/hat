// Create a class and extended it from the MAF.system.Sidebarthis

import { CanvasRenderer } from 'pixi';
import GameManager from './GameManager';

MAF.Theme.Fonts.add('VCR', 'Fonts/VCR');

const GameView = new MAF.Class({
  ClassName: 'GameView',

  Extends: MAF.system.FullscreenView,

  // Create your this template
  createView() {

    // Create a Canvas element
    const canvas = new MAF.element.Core({
      element: Canvas,
      styles: {
        width: this.width,
        height: this.height,
      }
    }).appendTo(this);

    const qrcode = new MAF.element.Image({
      styles: {
        vAlign: 'center',
        hAlign: 'center',
        vOffset: 130,
      },
    }).appendTo(this);

    qrcode.opacity = 0;
    const renderer = new CanvasRenderer(this.width, this.height, { view: canvas.element });
    const game = new GameManager(renderer, (visible, animate) => {
      const opacity = visible ? 1 : 0;
      if (animate) {
        qrcode.animate({
          opacity,
          duration: 0.5,
        });
      } else {
        qrcode.opacity = opacity;
      }
    });

    const draw = () => {
      if (!this.animating) { return; }
      requestAnimationFrame(draw);
      game.render();
    };

    this.animating = true;
    draw();

    // Create room
    const room = new MAF.PrivateRoom(this.ClassName);
    this.room = room;
    game.players.room = room;

    // Set listeners for Room and Connection
    (function (event) {
      var payload = event.payload;
      switch (event.type) {
        case 'onConnected':
          if (!room.joined) room.join();
          return;
        case 'onDisconnected':
          game.players.clear();
          return;
        case 'onCreated':
          var url = widget.getUrl('Client/client.html?hash=' + payload.hash);
          console.log(url);
          qrcode.setSource(QRCode.get(url));
          return;
        case 'onDestroyed':
          game.players.clear();
          return;
        case 'onJoined':
          if (payload.user !== room.user) {
            game.players.joined(payload.user);
          }
          return;
        case 'onHasLeft':
          if (payload.user !== room.user) {
            game.players.left(payload.user);
          }
          return;
        case 'onData':
          game.players.onData(payload);
          break;
        default:
          log(event.type, payload);
          break;
      }
    }).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);

    if (room.connected) room.join();
  },

  destroyView() {
    this.animating = false;
    if (this.room) {
      this.room.leave();
      this.room.destroy();
      delete this.room;
    }
  },
});

export default GameView;
