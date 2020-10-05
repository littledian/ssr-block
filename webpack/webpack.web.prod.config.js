const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.web.base.config');
const root = process.cwd();

module.exports = merge(config, {
  mode: 'production',
  output: {
    path: path.join(root, '/build/web')
  }
});
