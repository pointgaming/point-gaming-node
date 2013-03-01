var join = require('./join'),
    leave = require('./leave'),
    list = require('./list'),
    message = {
      send: require('./message/send')
    },
    member = {
      list: require('./member/list')
    },
    invite = {
      send: require('./invite/send'),
      receive: require('./invite/receive')
    };

module.exports = {
  join: new join,
  leave: new leave,
  list: new list,
  message: { send: new message.send },
  member: { list: new member.list },
  invite: {
    send: new invite.send,
    receive: new invite.receive
  }
};
