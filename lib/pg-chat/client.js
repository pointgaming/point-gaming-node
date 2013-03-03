var authenticator = require('./commands/authenticate'),
    authenticator = new authenticator(),
    sendMessage = require('./commands/message/send'),
    sendMessage = new sendMessage(),
    receiveMessage = require('./commands/message/receive'),
    receiveMessage = new receiveMessage(),
    chatroom = require('./commands/chatroom/'),
    SocketUsername = require('./models/socket_username'),
    socketUsername = new SocketUsername(),
    UserUsername = require('./models/user_username'),
    userUsername = new UserUsername(),
    UserSocket = require('./models/user_socket'),
    userSocket = new UserSocket(),
    ChatroomMember = require('./models/chatroom_member'),
    chatroomMember = new ChatroomMember(),
    MemberChange = require('./commands/chatroom/member/change'),
    memberChange = new MemberChange();
    UserChatroom = require('./models/user_chatroom'),
    userChatroom = new UserChatroom(),
    SocketChatroom = require('./models/socket_chatroom'),
    socketChatroom = new SocketChatroom();

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
  this.socket.on('Chatroom.User.getList', chatroom.list.handle.bind(chatroom.list, this) );

  this.socket.on('Chatroom.Member.getList', chatroom.member.list.handle.bind(chatroom.member.list, this) );

  this.socket.on('Chatroom.Message.send', chatroom.message.send.handle.bind(chatroom.message.send, this) );

  this.socket.on('Chatroom.Invite.send', chatroom.invite.send.handle.bind(chatroom.invite.send, this) );

  this.socket.on('friends', function() { self.listFriendsHandler(); });

  this.socket.on('Message.send', sendMessage.handle.bind(sendMessage, this) );
};

client.prototype.setCurrentUser = function(user, authMessage) {
  this.user = user;
  this.auth_data = authMessage;
  this.subscribeToExchange(this.USER_EXCHANGE_PREFIX + this.user._id, this.userExchangeMessageHandler);
  this.setCurrentUserStatus('online');

  userSocket.add(this.user._id, this.socket.id);
  socketUsername.set(this.socket.id, this.user._id);
  userUsername.set(this.user._id, this.user.username);
};

client.prototype.removeFromChat = function(chatroom) {
  var self = this;

  userChatroom.remove(this.user._id, chatroom, function(err, userLeftChat) {
    if (!err && userLeftChat) {
      chatroomMember.remove(chatroom, self.user._id);
      memberChange.handle(self, chatroom, "left");
    }
  });
  socketChatroom.remove(this.socket.id, chatroom);
};

client.prototype.disconnectHandler = function(){
  var self = this,
      item;

  if (this.user) {
    userSocket.remove(this.user._id, this.socket.id);
  }

  socketUsername.remove(this.socket.id);

  // TODO: make this async
  if (this.queues.length) {
    for (var i = 0; i < this.queues.length; i++) {
      item = this.queues[i];
      if (item.name.substr(0, 2) === this.CHAT_EXCHANGE_PREFIX) {
        this.removeFromChat(item.name.substr(2));
      }

      item.queue.destroy();
    }
    this.queues = [];
  }

  if (self.user) {
    this.checkIfCurrentUserOnline(function(err, isOnline){
      if (!err && !isOnline) {
        self.setCurrentUserStatus('offline');
      }
    });
  }
};

client.prototype.setCurrentUserStatus = function(new_status){
  PointGaming.api_client.setUserSession(this.auth_data.auth_token, {status: new_status}, function(err, data){});
  if (new_status === "offline") {
    userUsername.remove(this.user._id);
  }
};

client.prototype.userExchangeMessageHandler = function(exchange_name, message){
  var message = JSON.parse(message.data.toString());
  if (message.action) {
    switch(message.action) {
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
    receiveMessage.handle(this, message);
  }
};

client.prototype.listFriendsHandler = function() {
  var self = this;

  if (this.auth_data && this.auth_data.auth_token) {
    PointGaming.api_client.getFriends(this.auth_data.auth_token, function(err, data){
      if (!err) self.socket.emit('friends', data);
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

// param callback function(err, isOnline)
client.prototype.checkIfCurrentUserOnline = function(callback){
  userSocket.count(this.user._id, function(err, online_sockets){
    if (err) callback(err);
    else callback(null, online_sockets > 0);
  });
};

module.exports = client;
