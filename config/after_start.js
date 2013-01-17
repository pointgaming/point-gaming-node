var client = require("redis").createClient(),
    User = geddy.model.User,
    S = require("string"),
    async = require('async'),
    MessageQueue = require('../lib/messagequeue'),
    EventEmitter = require('events').EventEmitter;

geddy.emitter = new EventEmitter();

geddy.io.sockets.on("connection", function (socket) {
    socket.on("message", function (message) {
        if (!message.sessionID) {
            return;
        }

        client.hget(message.sessionID, "userId", function (err, userId) {
            var id = userId.replace(/"/g, "");

            if (userId && !err) {
                User.first({ id: id }, function (err, _user) {
                    if (_user && !err) {
                        geddy.io.sockets.emit("chat", {
                            username: _user.username,
                            text: S(message.text).escapeHTML().s
                        });
                    }
                });
            }
        });
    });
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
