var client = function(manager, socket){
  if (manager && socket) {
    this.manager = manager;
    this.socket = socket;
    this.user = null;

    this.registerEventHandlers();
    socket.emit('ready');
  }
};

client.prototype.authHandler = function(data){
  var self = this;

  this.manager.authenticate(data, function(err, user) {
    self.authResponseHandler(err, user);
  });
};

// we have to create the exchange in case it does not exist
client.prototype.createExchange = function(name, callback) {
  var self = this;

  this.exchange = this.manager.amqp_conn.exchange(name, {
    type: 'fanout',
    durable: false
  }, function(){
    callback(null, self.exchange);
  });
};

client.prototype.subscribeToUserExchange = function() {
  var self = this;

  // create the exchange in case it does not already exist
  this.createExchange(self.user.username, function(err, exchange) {
    // create an unnamed queue
    self.manager.amqp_conn.queue('', function(queue){
      self.queue = queue;

      // bind to named exchange
      queue.bind(self.user.username, '#');

      queue.subscribe(function(message){
        self.socket.emit('message', JSON.parse(message.data.toString()));
      });
    });
  });
};

client.prototype.authResponseHandler = function(err, user) {
  var self = this;
  var message;

  if (err) {
    this.socket.emit('auth_resp', {success: false});
  } else {
    this.user = user;
    this.socket.emit('auth_resp', {success: true});
    this.subscribeToUserExchange();
  }
};

client.prototype.disconnectHandler = function(){
  // TODO: pass this in a callback from manager
  this.manager.removeClient(this);

  if (this.queue) {
    this.queue.destroy();
  }
  if (this.exchange) {
    this.exchange.destroy();
  }
};

client.prototype.registerEventHandlers = function() {
  var self = this;

  this.socket.on('auth', function(data){ self.authHandler(data); });

  this.socket.on('disconnect', function(){ self.disconnectHandler(); });
};

module.exports = client;
