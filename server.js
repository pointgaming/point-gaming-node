var argv = require('optimist').string('e').argv,
    fs = require('fs'),
    sio = require('socket.io'),
    io,
    connection_manager = require('./lib/pg-chat/manager'),
    PointGaming = global.PointGaming || {};

// setup the global variable
global.PointGaming = PointGaming;

// setup the environment
if (typeof(argv.e) !== 'undefined') {
    process.env.NODE_ENV = argv.e;
} else if (typeof(process.env.NODE_ENV) === 'undefined') {
    process.env.NODE_ENV = 'development';
}

// run the initialization script
require('./config/init');

// load the config
PointGaming.config = require('config');

var options = {
  key: fs.readFileSync(PointGaming.config.ssl.key),
  cert: fs.readFileSync(PointGaming.config.ssl.cert)
};

var app = require('https').createServer(options, function(req, res){
  res.writeHead(200);
  res.end('Welcome to socket.io');
});
app.listen(PointGaming.config.port);

io = sio.listen(app, function() {
    console.log('Socket.io listening');
});

io.configure(function (){
    io.set('log level', 1);
    io.enable('broser client minification');
    io.enable('broser client etag');
    io.enable('broser client gzip');
});

PointGaming.socketManager = new connection_manager(PointGaming.config);

io.sockets.on('connection', function(socket){
    PointGaming.socketManager.handleNewConnection(socket);
});

// run the initializers
require('./config/initializers/');
