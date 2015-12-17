var webpack = require('webpack');
var path = require('path');

var debug = process.env.NODE_ENV !== 'production';

var config = {
  entry: {
    main: './src/init.js'
  },
  output: {
    path: './Contents/Javascript',
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
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: debug,
      HAS_AUDIO: !!process.env.AUDIO,
    }),
  ],
};

if (process.env.UNFUCK) {
  config.module.loaders.push({ test: /pixi/, loader: path.join(__dirname, 'src/unfucker.js') });
}

if (!debug) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

module.exports = config;
