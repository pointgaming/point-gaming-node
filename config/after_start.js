var User = geddy.model.User,
    async = require('async'),
    MessageQueue = require('../lib/messagequeue'),
    EventEmitter = require('events').EventEmitter,
    connection_manager = require('../lib/pg-chat/manager');

geddy.emitter = new EventEmitter();

var socketManager = new connection_manager(geddy.config);

geddy.io.sockets.on("connection", function (socket) {
  socketManager.handleNewConnection(socket);
});

var _notifyUserFriends = function(action){
  return function(user){
    user.getFriendUsers(function(err, friends){
      if (friends && friends.length) {
        var message = {username: user.username, action: action};
        async.forEach(friends, function(item, callback){
          MessageQueue.sendMessageToUser(item.username, JSON.stringify(message), callback);
        }, function(err){});
      }
    });
  };
};

geddy.emitter.on('user_logged_in', _notifyUserFriends('logged_in'));
geddy.emitter.on('user_logged_out', _notifyUserFriends('logged_out'));
