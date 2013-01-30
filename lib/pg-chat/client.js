var client = function(manager, socket){
  if (manager && socket) {
    this.manager = manager;
    this.socket = socket;
    this.user = null;

    this.queues = [];

    this.registerEventHandlers();
    socket.emit('ready');
  }
};

client.prototype.USER_EXCHANGE_PREFIX = 'u.';
client.prototype.CHAT_EXCHANGE_PREFIX = 'c.';

client.prototype.authHandler = function(data){
  var self = this;

  this.manager.authenticate(data, function(err, user) {
    self.authResponseHandler(err, user);
  });
};

client.prototype.createExchange = function(name, callback) {
  var exchange = this.manager.amqp_conn.exchange(name, {
    type: 'fanout',
    durable: true
  }, function(){
    callback(null, exchange);
  });
};

client.prototype.subscribeToExchange = function(name) {
  var self = this;

  // create the exchange in case it does not already exist
  this.createExchange(name, function(err, exchange) {
    // create an unnamed queue
    self.manager.amqp_conn.queue('', {durable: true}, function(queue){
      self.queues.push(queue);

      // bind to named exchange
      queue.bind(name, '#');

      queue.subscribe(function(message){
        var message = JSON.parse(message.data.toString());
        // TODO: we should probably remove the exchange_prefix
        message.exchange = name;
        self.socket.emit('message', message);
      });
    });
  });
};

client.prototype.sendMessageToExchange = function(exchange_name, message, callback){
  var self = this;
  var exchange = self.manager.amqp_conn.exchange(exchange_name, {
    type: 'fanout',
    durable: true
  }, function(){
    exchange.publish('', JSON.stringify(message), {}, function(){
      exchange.destroy(true);
      if (typeof(callback) === 'function') {
        callback(null);
      }
    });
  });
};

client.prototype.authResponseHandler = function(err, user) {
  if (err) {
    this.socket.emit('auth_resp', {success: false});
  } else {
    this.user = user;
    this.socket.emit('auth_resp', {success: true, username: this.user.username});
    this.subscribeToExchange(this.USER_EXCHANGE_PREFIX + this.user.username);
  }
};

client.prototype.disconnectHandler = function(){
  // TODO: pass this in a callback from manager
  this.manager.removeClient(this);

  if (this.queues.length) {
    for (var i = 0; i < this.queues.length; i++) {
      this.queues[i].destroy();
    }
    this.queues = [];
  }
};

client.prototype.joinChatHandler = function(data) {
  if (data.chat) {
    this.subscribeToExchange(this.CHAT_EXCHANGE_PREFIX + data.chat);
    this.socket.emit('join_chat', {success: true});
  } else {
    this.socket.emit('join_chat', {success: false});
  }
};

client.prototype.messageHandler = function(data) {
  if (data.chat && data.message) {
    // TODO: parse data.message to see if it's a command
    var message = {username: this.user.username, message: data.message};
    // TODO: verify the user is in this chat room (unless it is a private message)
    this.sendMessageToExchange(this.CHAT_EXCHANGE_PREFIX + data.chat, message);
  }
};

client.prototype.registerEventHandlers = function() {
  var self = this;

  this.socket.on('auth', function(data){ self.authHandler(data); });

  this.socket.on('disconnect', function(){ self.disconnectHandler(); });

  this.socket.on('join_chat', function(data){ self.joinChatHandler(data); });

  this.socket.on('message', function(data){ self.messageHandler(data); });
};

module.exports = client;
