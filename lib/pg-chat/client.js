var authenticator = require('./commands/authenticate'),
    authenticator = new authenticator(),
    sendMessage = require('./commands/message/send'),
    sendMessage = new sendMessage(),
    receiveMessage = require('./commands/message/receive'),
    receiveMessage = new receiveMessage(),
    chatroom = require('./commands/chatroom/');

var client = function(socket){
  if (socket) {
    this.socket = socket;
    this.user = null;

    this.queues = [];

    this.registerEventHandlers();
    socket.emit('ready');
  }
};

client.prototype.USER_EXCHANGE_PREFIX = 'u.';
client.prototype.CHAT_EXCHANGE_PREFIX = 'c.';

client.prototype.emit = function(eventName, message) {
  this.socket.emit(eventName, message);
};

client.prototype.registerEventHandlers = function() {
  var self = this;

  this.socket.on('auth', authenticator.handle.bind(authenticator, this) );

  this.socket.on('disconnect', function(){ self.disconnectHandler(); });

  this.socket.on('Chatroom.join', chatroom.join.handle.bind(chatroom.join, this) );
  this.socket.on('Chatroom.leave', chatroom.leave.handle.bind(chatroom.leave, this) );
  this.socket.on('Chatroom.getList', chatroom.list.handle.bind(chatroom.list, this) );

  this.socket.on('Chatroom.Member.getList', chatroom.member.list.handle.bind(chatroom.member.list, this) );

  this.socket.on('Chatroom.Message.send', chatroom.message.send.handle.bind(chatroom.message.send, this) );

  this.socket.on('Chatroom.Invite.send', chatroom.invite.send.handle.bind(chatroom.invite.send, this) );

  this.socket.on('friends', function() { self.listFriendsHandler(); });

  this.socket.on('message', sendMessage.handle.bind(sendMessage, this) );
};

client.prototype.setCurrentUser = function(user, authMessage) {
  this.user = user;
  this.auth_data = authMessage;
  this.subscribeToExchange(this.USER_EXCHANGE_PREFIX + this.user._id, this.userExchangeMessageHandler);
  this.setRedisOnlineKey();
  this.setCurrentUserStatus('online');
};

client.prototype.disconnectHandler = function(){
  var self = this;


  if (this.queues.length) {
    for (var i = 0; i < this.queues.length; i++) {
      this.queues[i].queue.destroy();
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
  PointGaming.api_client.setUserSession(this.auth_data.auth_token, {status: new_status}, function(err, data){});
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
      case 'Chatroom.Invite.new':
      case 'friend_request_created':
      case 'friend_request_destroyed':
        this.socket.emit(message.action, message.data);
        break;
      case 'friend_destroyed':
      case 'new_friend':
        this.socket.emit('friend_status_changed', message.user);
        break;
    }
  } else if (message.fromUser && message.message) {
    receiveMessage.handle.bind(receiveMessage, this);
  }
};

client.prototype.listFriendsHandler = function() {
  var self = this;

  if (this.auth_data && this.auth_data.auth_token) {
    PointGaming.api_client.getFriends(this.auth_data.auth_token, function(err, data){
      if (data) self.socket.emit('friends', data);
    });
  }
};

client.prototype.createExchange = function(name, callback) {
  var exchange = PointGaming.amqp_conn.exchange(name, {
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
    PointGaming.amqp_conn.queue('', {durable: true}, function(queue){
      self.queues.push({
        name: name,
        queue: queue
      });

      // bind to named exchange
      queue.bind(name, '#');

      queue.subscribe(function(message){ messageCallback.call(self, name, message); });
    });
  });
};

client.prototype.unsubscribeFromExchange = function(name) {
  var self = this,
      queueLength = this.queues.length,
      i = 0;

  for (; i < queueLength; ++i) {
    if (this.queues[i].name === name) {
      this.queues[i].queue.destroy();
    }
  }
};

client.prototype.sendMessageToExchange = function(exchange_name, message, callback){
  var self = this;

  var exchange = PointGaming.amqp_conn.exchange(exchange_name, {
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
  PointGaming.redis_client.del(this.getRedisOnlineKeyName(), callback);
};

client.prototype.setRedisOnlineKey = function() {
  var key = this.getRedisOnlineKeyName();
  PointGaming.redis_client.set(key, '1');
  PointGaming.redis_client.expire(key, 500);
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
      PointGaming.redis_client.exists(self.getRedisOnlineKeyName(), callback);
    }, 5000);
  });
};

module.exports = client;
