var client = require('./client'),
  authenticator = require('./authenticator'),
  amqp  = require('amqp');


var manager = function(){
  this.amqp_conn = amqp.createConnection();

  this.authenticator = new authenticator;

  this.clients = [];

  this.exchanges = {};
}

manager.prototype.addClient = function(client) {
  this.clients.push(client);
};

manager.prototype.authenticate = function(data, callback) {
  if (this.authenticator) {
    this.authenticator.authenticate(data, callback);
  } else {
    callback({message: "manager.authenticator not found"});
  }
};

manager.prototype.handleNewConnection = function(socket) {
  var newClient = new client(this, socket);
  this.addClient(newClient);
};

manager.prototype.removeClient = function(client) {
  sIdx = this.clients.indexOf(client);
  if (sIdx != -1){
    this.clients.splice(sIdx, 1);
  }
};

module.exports = manager;
