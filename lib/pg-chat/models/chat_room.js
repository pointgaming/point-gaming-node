var Chatroom = function() {

};

Chatroom.types = {
  Dispute: {
    prefix: 'Dispute_',
    regex: /^Dispute_/
  },
  Game: {
    prefix: 'Game_',
    regex: /^Game_/
  },
  GameRoom: {
    prefix: 'GameRoom_',
    regex: /^GameRoom_/
  },
  Private: {
    prefix: 'private_',
    regex: /^private_/
  },
  Stream: {
    prefix: 'Stream_',
    regex: /^Stream_/
  }
};

Chatroom.getTypeFromServerId = function(chat_name) {
  switch (true) {
    case !!chat_name.match(Chatroom.types.GameRoom.regex):
      return 'GameRoom';
    case !!chat_name.match(Chatroom.types.Game.regex):
      return 'Game';
    case !!chat_name.match(Chatroom.types.Stream.regex):
      return 'Stream';
    case !!chat_name.match(Chatroom.types.Private.regex):
      return 'Private';
    case !!chat_name.match(Chatroom.types.Dispute.regex):
      return 'Dispute';
    default:
      return null;
  }
};

Chatroom.getIdFromServerId = function(chat_name, chat_type) {
  return (chat_type === null) ?
            chat_name : 
            chat_name.replace(Chatroom.types[chat_type].regex, '');
};

module.exports = Chatroom;
