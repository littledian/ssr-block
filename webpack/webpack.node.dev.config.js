const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.node.base.config');

module.exports = merge(config, {
  mode: 'development',
  devServer: {
    port: 7001,
    hot: false,
    inline: false,
    publicPath: '/build',
    contentBase: path.join(process.cwd(), '/build')
  }
});
