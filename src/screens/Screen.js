import { Container } from 'pixi';

export default class Screen {
  constructor(manager, transition) {
    this.container = new Container();
    this.transition = transition;
    this.manager = manager;
  }

  render() {
  }

  destroy() {
  }
}
