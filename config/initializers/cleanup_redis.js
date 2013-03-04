var PointGaming = global.PointGaming,
    MemberChange = require('../../lib/pg-chat/commands/chatroom/member/change'),
    memberChange = new MemberChange();
    async = require('async');

module.exports = function(callback) {
  PointGaming.models.ServerSocket.all(function(err, sockets) {
    if (err) {
      callback(err);
    } else if (sockets.length) {
      console.log('Cleaning up ' + sockets.length + ' socket(s).');
      cleanupServerSockets(sockets, callback);
    } else {
      callback(null);
    }
  });
};

var cleanupServerSockets = function(sockets, callback) {
  async.each(sockets, function(item, iter_callback) {
    // cleanup the user connected to this socket
    cleanupSocketUser(item, function(err) {
      // delete the socket from the list of sockets
      PointGaming.models.ServerSocket.remove(item, iter_callback);
    });
  }, function(err) {
    if (err) {
      console.log('Failed to cleanup redis after server crashed!');
      exit(1);
    } else {
      console.log('Cleanup complete!');
      callback(null);
    }
  });
};

var cleanupSocketUser = function(socket, callback) {
  PointGaming.models.SocketUser.find(socket, function(err, user_id) {
    if (err) return callback(err);

    cleanupSocketChatrooms(socket, user_id, function(err) {
      if (err) return callback(err);

      // delete userSocket
      PointGaming.models.UserSocket.remove(user_id, socket, function(err) {
        PointGaming.models.UserSocket.count(user_id, function(err, count) {
          if (err) return callback(err);

          // if there's no more userSockets, delete userUsername
          if (count <= 0) {
            PointGaming.models.UserUsername.remove(user_id);
          }

          // delete socketUser
          PointGaming.models.SocketUser.remove(socket, callback);
        });
      });
    });
  });
};

var cleanupSocketChatrooms = function(socket, user_id, callback) {
  PointGaming.models.SocketChatroom.all(socket, function(err, chatrooms) {
    if (err) return callback(err);

    if (user_id && chatrooms.length) {
      async.each(chatrooms, function(chatroom, iter_callback) {
        cleanupUserChatroomSocket(socket, user_id, chatroom, iter_callback);
      }, function(err) {
        return callback(err);
      });
    } else {
      callback(null);
    }
  });
};

var cleanupUserChatroomSocket = function(socket, user_id, chatroom, callback) {
  // decrement userCount from chatroom
  PointGaming.models.UserChatroom.remove(user_id, chatroom, function(err, userLeftChat) {
    if (err) return callback(err);

    if (userLeftChat) {
      PointGaming.models.ChatroomMember.remove(chatroom, user_id);
      // TODO: retrieve the users username at some point before this, and pass it here...
      memberChange.handle({_id: user_id, username: 'unknown'}, chatroom, "left");
    }

    // remove this chatroom from SocketChatroom set
    PointGaming.models.SocketChatroom.remove(socket, chatroom, callback);
  });
};
