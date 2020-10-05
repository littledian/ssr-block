const net = require('net');

module.exports = function portInUse(port) {
  return new Promise((resolve) => {
    let server = net.createServer().listen(port);
    server.on('listening', function () {
      server.close();
      resolve(false);
    });
    server.on('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      }
    });
  });
};
