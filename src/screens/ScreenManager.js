import { Container } from 'pixi';
import { Promise } from 'es6-promise';

function nopPromise() {
  return new Promise(resolve => { resolve(); });
}

export default class ScreenTransition {
  constructor(manager) {
    this.container = new Container();
    this.bgContainer = new Container();
    this.manager = manager;
  }

  render() {
    if (this.screen) {
      this.screen.render();
    }
  }

  setScreen(screen) {

    if (this.screen) {
      return nopPromise().then(() => {
        console.log('started destroy');
        return this.screen.destroy();
      }).then(() => {
        this.container.removeChild(this.screen.container);
        this.bgContainer.removeChild(this.screen.bgContainer);
        this.screen = null;
        console.log('finished destroy');
        return this.setScreen(screen);
      });
    }

    console.log('start create', screen);

    this.screen = screen;

    if (this.screen) {
      this.container.addChild(this.screen.container);
      this.bgContainer.addChild(this.screen.bgContainer);
      this.screen.show();
      console.log('shown', screen);
    }

    return nopPromise();
  }
}
