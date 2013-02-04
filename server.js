var argv = require('optimist').string('e').argv,
    sio = require('socket.io'),
    io,
    connection_manager = require('lib/pg-chat/manager'),
    socketManager;

if (typeof(argv.e) !== 'undefined') {
    process.env.NODE_ENV = argv.e;
} else if (typeof(process.env.NODE_ENV) === 'undefined') {
    process.env.NODE_ENV = 'development';
}

var config = require('config');

socketManager = new connection_manager(config);

io = sio.listen(config.port, function() {
    console.log('Socket.io listening on port ' + config.port);
});

io.configure(function (){
    io.set('log level', 1);
});

io.sockets.on('connection', function(socket){
    socketManager.handleNewConnection(socket);
});
