# HAT

HAT brings you the experience of old NES games to your TV!

This was built during the [UPC – The Challenge][hackaton] hackathon using [Metrological Framework][metrological] and [Pixi.js][pixi].

## How to build it

You should first run `npm install`.

### Build development build

```bash
webpack
```

### Build production build

```bash
NODE_ENV=production webpack
```

### Build unminified production build

```bash
NOMINIFY=1 NODE_ENV=production webpack
```

### The "unfucker"

There's an issue in the Metrological SDK (more likely in the compiler/minifier, not SDK itself) where using `//` inside a string truncates the string and results in a syntax error. We built a workaround for this:

```bash
UNFUCK=1 webpack
```

### Build with sound
```bash
AUDIO=1 webpack
```

### Zip it all up

The build results should be taken from `./ro.hat-app.app.Hat`, with or without the `Contents/Sounds` folder.
There's a script that does that already for you. Check out `npm run build` and `npm run pack`

## How it works

Bring your friends and use your phones as gamepads to play a sequence of 5 fast paced multiplayer games. On Android, the gamepad will also have haptic feedback.

Two game types are currently implemented: the classic Tron light bikes game and a 2-lane obstacle avoidance game.

## Who built this?

Code: [Marius Petcu](https://github.com/dapetcu21)  
Code: [Anatol Prisăcaru](https://github.com/shark0der)  
Code: [Bogdan Florea](https://github.com/bogdanvf)  
Design: [Gabriel Bucur](https://www.facebook.com/gaby.bucur)  

[metrological]: https://www.metrological.com/appdevelopers.html
[simulator]: https://github.com/Metrological/maf3-sdk
[hackaton]: http://upcthechallenge.ro/
[pixi]: http://www.pixijs.com

## Screenshot

![img_1245](https://cloud.githubusercontent.com/assets/428060/10798546/db458bc0-7db0-11e5-8d67-c207e8b3c286.PNG)
![screenshot from 2015-10-28 19 48 53](https://cloud.githubusercontent.com/assets/428060/10798547/db94a37c-7db0-11e5-906b-91b072fe407d.png)
![screenshot from 2015-10-28 19 49 50](https://cloud.githubusercontent.com/assets/428060/10798548/db967fe4-7db0-11e5-9ff6-d499dbe595b5.png)
![screenshot from 2015-10-28 19 49 21](https://cloud.githubusercontent.com/assets/428060/10798549/db96a3f2-7db0-11e5-8c5c-57043c0b68b3.png)
