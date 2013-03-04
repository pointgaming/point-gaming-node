var messageHandler = require('./message/receive'),
    messageHandler = new messageHandler();
    MemberChange = require('./member/change'),
    memberChange = new MemberChange();
    ChatroomMember = require('../../models/chatroom_member'),
    chatroomMember = new ChatroomMember(),
    UserChatroom = require('../../models/user_chatroom'),
    userChatroom = new UserChatroom(),
    SocketChatroom = require('../../models/socket_chatroom'),
    socketChatroom = new SocketChatroom();

// TODO: change the 'join_chat' event name

var Command = function() {

};

// This function will handle the event in which a connected socket joins a chatroom.
// It will subscribe the users socket to the chat rooms exchange.
// It will emit events when the user joins the chat.
Command.prototype.handle = function(socket, message) {
  if (message._id) {
    socket.subscribeToExchange(socket.CHAT_EXCHANGE_PREFIX + message._id, messageHandler.handle.bind(messageHandler, socket));

    chatroomMember.add(message._id, socket.user._id, socket.user.points || 0);
    userChatroom.add(socket.user._id, message._id, function(err, userSocketCountInChat) {
      if (userSocketCountInChat === "1") {
        memberChange.handle(socket.user, message._id, "joined");
      }
    });
    socketChatroom.add(socket.socket.id, message._id);

    socket.emit('join_chat', {success: true});
  } else {
    socket.emit('join_chat', {success: false});
  }
};

module.exports = Command;
