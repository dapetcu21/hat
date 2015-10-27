import { each } from 'lodash';
import { Promise } from 'es6-promise';

export class AnimationManager {

  constructor() {
    this.animations = {};
  }

  addAnimation(duration, easing, fun, from, to) {

    if (from === undefined) { from = 0; }
    if (to === undefined) { to = 1; }

    duration *= 1000;

    let resolve;
    const promise = new Promise(_resolve => { resolve = _resolve; });

    this.animations[Math.random()] = ({
      from, to, duration, easing, fun, resolve,
      timeLeft: duration,
      lastValue: from + easing(0) * (to - from),
    });

    fun(from, 0);

    return promise;
  }

  render() {
    const time = Date.now();
    const elapsed = this.lastTime ? time - this.lastTime : 0;
    this.lastTime = time;

    each(this.animations, (anim, key) => {
      anim.timeLeft -= elapsed;
      if (anim.timeLeft <= 0) {
        delete this.animations[key];
        anim.timeLeft = 0;
        anim.resolve();
      }
      const val = anim.easing(1 - (anim.timeLeft / anim.duration));
      const adjusted = anim.from + val * (anim.to - anim.from);
      anim.fun(adjusted, adjusted - anim.lastValue);
      anim.lastValue = adjusted;
    });
  }
}
