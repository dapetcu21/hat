import { Container } from 'pixi';

export default class ScreenTransition {
  constructor(manager) {
    this.container = new Container();
    this.manager = manager;
  }

  setScreen(screen) {
    if (this.screen) {
      this.container.removeChild(this.screen.container);
    }
    this.screen = screen;
    this.container.addChild(this.screen.container);
  }
}
