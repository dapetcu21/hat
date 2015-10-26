import Screen from './Screen';

export default class JoinScreen extends Screen {
  constructor() {
    super();
    this.manager.setQRVisible(true);
  }

  destroy() {
    this.manager.setQRVisible(false);
  }
}
