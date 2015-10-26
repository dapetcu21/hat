document.createElement = document.createElement || function (type) {
  switch (type) {
    case 'canvas':
      return new Canvas();
  }
  throw new Error(`document.createElement(${type}) not implemented. Check out createElementShim.js`);
}
