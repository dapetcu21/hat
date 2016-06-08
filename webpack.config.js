var webpack = require('webpack');
var path = require('path');

var debug = process.env.NODE_ENV !== 'production';

var plugins = [
  new webpack.DefinePlugin({
    DEBUG: debug,
    HAS_AUDIO: !!process.env.AUDIO,
  })
];

if (!debug && !process.env.NOMINIFY) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

// we're supressing warnings because our transpiled and minified
// code doesn't play well with metrological's closure compiler
plugins.push(new webpack.BannerPlugin(
    ['/**', ' * @fileoverview', ' * @suppress {uselessCode|suspiciousCode}', '*/'].join('\n'),
    { raw: true, entryOnly: true }
));

var config = {
  entry: {
    main: './src/init.js'
  },
  output: {
    path: './ro.hat-app.app.Hat/Contents/Javascript',
    filename: 'init.js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules|web_modules/ },
    ]
  },
  externals: {
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  babel: {
    stage: 0,
    optional: ['runtime']
  },
  plugins: plugins,
};

if (process.env.UNFUCK) {
  config.module.loaders.push({ test: /pixi/, loader: path.join(__dirname, 'src/unfucker.js') });
}

module.exports = config;
