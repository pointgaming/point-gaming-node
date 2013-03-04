var fs = require('fs'),
    sio = require('socket.io'),
    connection_manager = require('./manager'),
    io,
    PointGaming = global.PointGaming;

exports.start = function(afterStartCallback) {
  var app = require('https').createServer({
    key: fs.readFileSync(PointGaming.config.ssl.key),
    cert: fs.readFileSync(PointGaming.config.ssl.cert)
  }, function(req, res){
    res.writeHead(200);
    res.end('Welcome to socket.io');
  });

  io = sio.listen(app);

  io.configure(function (){
    io.set('log level', 1);
    io.enable('broser client minification');
    io.enable('broser client etag');
    io.enable('broser client gzip');
  });

  app.listen(PointGaming.config.port, function() {
    PointGaming.socketManager = new connection_manager(PointGaming.config);

    io.sockets.on('connection', function(socket){
        PointGaming.socketManager.handleNewConnection(socket);
    });

    if (typeof(afterStartCallback) === 'function') {
      afterStartCallback();
    }
  });
};
