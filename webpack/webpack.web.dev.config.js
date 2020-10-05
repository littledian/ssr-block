const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.web.base.config');

module.exports = merge(config, {
  mode: 'development',
  devServer: {
    port: 7002,
    publicPath: '/build',
    contentBase: path.join(process.cwd(), '/build')
  }
});
