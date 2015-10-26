import { Container } from 'pixi';
import { AnimationManager } from '../AnimationManager';

export default class Screen {
  constructor(manager, transition) {
    this.container = new Container();
    this.bgContainer = new Container();
    this.animations = new AnimationManager();
    this.transition = transition;
    this.manager = manager;
  }

  show() {
  }

  render() {
    this.animations.render();
  }

  destroy() {
  }
}
