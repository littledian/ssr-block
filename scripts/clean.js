const rm = require('rimraf');
rm.sync('build/**');
rm.sync('utils/**/*.js');
rm.sync('service/**/*.js');
rm.sync('server.js');
