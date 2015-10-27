import { Container, loader } from 'pixi';
import { AnimationManager } from '../AnimationManager';

export default class Screen {
  constructor(manager, transition) {
    this.container = new Container();
    this.bgContainer = new Container();
    this.animations = new AnimationManager();
    this.transition = transition;
    this.manager = manager;
  }

  loadResources(fn, fnc) {
    if (!this.constructor.loadedResources) {
      fn(loader);
      loader.load((_, resources) => {
        this.constructor.loadedResources = resources;
        fnc(resources);
      });

    } else {
      fnc(this.constructor.loadedResources);
    }
  }

  show() {
  }

  render() {
    this.animations.render();
  }

  destroy() {
  }
}
