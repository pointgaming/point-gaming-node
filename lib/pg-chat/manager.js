var client = require('./client');

var manager = function(config){
  this.clients = [];
}

manager.prototype.handleNewConnection = function(socket) {
  var newClient = new client(socket);

  this.addClient(newClient);

  socket.on('disconnect', this.removeClient.bind(this, newClient));
};

manager.prototype.addClient = function(client) {
  this.clients.push(client);
};

manager.prototype.removeClient = function(client) {
  sIdx = this.clients.indexOf(client);
  if (sIdx != -1){
    this.clients.splice(sIdx, 1);
  }
};

module.exports = manager;
