var client = require('./client'),
  authenticator = require('./authenticator'),
  apiClient = require('./api/client'),
  redis = require('redis'),
  amqp  = require('amqp');


var manager = function(config){
  this.amqp_conn = amqp.createConnection();

  this.api_client = new apiClient(config.api_url || 'http://dev.pointgaming.net:3000/');

  this.authenticator = new authenticator(this);

  this.redis_client = redis.createClient(config.redis);

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
