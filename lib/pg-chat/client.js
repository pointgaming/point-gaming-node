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

client.prototype.registerEventHandlers = function() {
  var self = this;

  this.socket.on('auth', function(data){ self.authHandler(data); });

  this.socket.on('disconnect', function(){ self.disconnectHandler(); });

  this.socket.on('join_chat', function(data){ self.joinChatHandler(data); });

  this.socket.on('friends', function() { self.listFriendsHandler(); });

  this.socket.on('message', function(data){ self.messageHandler(data); });
};

client.prototype.authHandler = function(data){
  var self = this;

  this.manager.authenticate(data, function(err, user) {
    self.authResponseHandler(err, user, data);
  });
};

client.prototype.authResponseHandler = function(err, user, auth_data) {
  if (err) {
    this.socket.emit('auth_resp', {success: false});
  } else {
    this.user = user;
    this.auth_data = auth_data;
    this.socket.emit('auth_resp', {success: true, username: user.username, user: user});
    this.subscribeToExchange(this.USER_EXCHANGE_PREFIX + this.user._id, this.userExchangeMessageHandler);
    this.setRedisOnlineKey();
    this.setCurrentUserStatus('online');
  }
};

client.prototype.disconnectHandler = function(){
  var self = this;

  this.manager.removeClient(this);

  if (this.queues.length) {
    for (var i = 0; i < this.queues.length; i++) {
      this.queues[i].destroy();
    }
    this.queues = [];
  }

  if (self.user) {
    this.checkIfCurrentUserOnline(function(err, isOnline){
      if (!isOnline) {
        self.setCurrentUserStatus('offline');
      }
    });
  }
};

client.prototype.setCurrentUserStatus = function(new_status){
  this.manager.api_client.setUserSession(this.auth_data.auth_token, {status: new_status}, function(err, data){});
};

client.prototype.chatExchangeMessageHandler = function(exchange_name, message){
  var message = JSON.parse(message.data.toString());
  message.exchange = exchange_name;
  this.socket.emit('message', message);
};

client.prototype.userExchangeMessageHandler = function(exchange_name, message){
  var message = JSON.parse(message.data.toString());
  if (message.action) {
    switch(message.action) {
      case 'ping':
        this.setRedisOnlineKey();
        break;
      case 'friend_status_changed':
        this.socket.emit(message.action, message.user);
        break;
      case 'friend_request_created':
      case 'friend_request_destroyed':
        this.socket.emit(message.action, message.data);
        break;
      case 'friend_destroyed':
      case 'new_friend':
        this.socket.emit('friend_status_changed', message.user);
        break;
    }
  } else if (message.username && message.message) {
    message.exchange = this.user._id;
    this.socket.emit('message', message);
  }
};

client.prototype.joinChatHandler = function(data) {
  if (data.chat) {
    this.subscribeToExchange(this.CHAT_EXCHANGE_PREFIX + data.chat, this.chatExchangeMessageHandler);
    this.socket.emit('join_chat', {success: true});
  } else {
    this.socket.emit('join_chat', {success: false});
  }
};

client.prototype.listFriendsHandler = function() {
  var self = this;

  if (this.auth_data && this.auth_data.auth_token) {
    this.manager.api_client.getFriends(this.auth_data.auth_token, function(err, data){
      if (data) self.socket.emit('friends', data);
    });
  }
};

client.prototype.messageHandler = function(data) {
  if (data.chat && data.message) {
    var message = {username: this.user.username, message: data.message};
    // TODO: verify the user is in this chat room (unless it is a private message)
    this.sendMessageToExchange(this.CHAT_EXCHANGE_PREFIX + data.chat, message);
  } else if (data.user && data.message) {
    var message = {username: this.user.username, message: data.message};
    this.sendMessageToExchange(this.USER_EXCHANGE_PREFIX + data.user, message);
  }
};

client.prototype.createExchange = function(name, callback) {
  var exchange = this.manager.amqp_conn.exchange(name, {
    type: 'fanout',
    durable: true
  }, function(){
    callback(null, exchange);
  });
};

client.prototype.subscribeToExchange = function(name, messageCallback) {
  var self = this;

  // create the exchange in case it does not already exist
  this.createExchange(name, function(err, exchange) {
    // create an unnamed queue
    self.manager.amqp_conn.queue('', {durable: true}, function(queue){
      self.queues.push(queue);

      // bind to named exchange
      queue.bind(name, '#');

      queue.subscribe(function(message){ messageCallback.call(self, name, message); });
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

client.prototype.getRedisOnlineKeyName = function(){
  return 'online.'+this.user._id;
};

client.prototype.deleteRedisOnlineKey = function(callback) {
  this.manager.redis_client.del(this.getRedisOnlineKeyName(), callback);
};

client.prototype.setRedisOnlineKey = function() {
  var key = this.getRedisOnlineKeyName();
  this.manager.redis_client.set(key, '1');
  this.manager.redis_client.expire(key, 500);
};

// if the current socket is subscribed to its user exchange and responds to the ping 
// event emitted during the execution of this method, this method should pass true
// to the second parameter of the callback
//
// param callback function(err, isOnline)
client.prototype.checkIfCurrentUserOnline = function(callback){
  var self = this;

  // delete the key used to track if a user is online
  this.deleteRedisOnlineKey(function(err, numDeleted){
    // initiate ping/pong event, causing other online sockets to re-create the key we just deleted
    self.sendMessageToExchange(self.USER_EXCHANGE_PREFIX + self.user._id, {action: 'ping'});

    setTimeout(function(){
      // if the key exists at this point, the user is online using another client
      self.manager.redis_client.exists(self.getRedisOnlineKeyName(), callback);
    }, 5000);
  });
};

module.exports = client;
