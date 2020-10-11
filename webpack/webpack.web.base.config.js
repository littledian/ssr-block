const fs = require('fs');
const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.base.config');

function getEntries() {
  const root = process.cwd();
  const entryRoot = path.join(root, 'entry');
  const entry = {};
  const files = fs.readdirSync(entryRoot);
  files.forEach((file) => {
    const filePath = path.join(entryRoot, file);
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory()) return;
    entry[file] = path.join(filePath, 'web');
  });

  return entry;
}

module.exports = merge(config, {
  entry: getEntries(),
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    moment: 'moment'
  }
});
