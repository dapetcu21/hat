module.exports = function (source) {
  this.cacheable();
  return 'eval(decodeURIComponent(' + JSON.stringify(encodeURIComponent(source)) + '));';
}
