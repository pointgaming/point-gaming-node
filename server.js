var argv = require('optimist').string('e').argv,
    fs = require('fs'),
    sio = require('socket.io'),
    io,
    connection_manager = require('./lib/pg-chat/manager'),
    socketManager;

if (typeof(argv.e) !== 'undefined') {
    process.env.NODE_ENV = argv.e;
} else if (typeof(process.env.NODE_ENV) === 'undefined') {
    process.env.NODE_ENV = 'development';
}

var config = require('config');

socketManager = new connection_manager(config);

var options = {
  key: fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert)
};

var app = require('https').createServer(options, function(req, res){
  res.writeHead(200);
  res.end('Welcome to socket.io');
});
app.listen(config.port);

io = sio.listen(app, function() {
    console.log('Socket.io listening');
});

io.configure(function (){
    io.set('log level', 1);
    io.enable('broser client minification');
    io.enable('broser client etag');
    io.enable('broser client gzip');
});

io.sockets.on('connection', function(socket){
    socketManager.handleNewConnection(socket);
});
