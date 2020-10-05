const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const portInUse = require('./portInUse');
const config = require('../webpack/webpack.web.dev.config');

(async () => {
  const inUse = await portInUse(config.devServer.port);
  if (!inUse) {
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(config.devServer.port);
  }
})();
