var amqp  = require('amqp');

var connection = amqp.createConnection(geddy.config.amqp);

exports.sendMessageToUser = function(username, message, callback){
  var exchange = connection.exchange(username, {
    type: 'fanout',
    durable: false
  }, function(){
    exchange.publish('', message, {}, function(){
      exchange.destroy(true);
      callback(null);
    });
  });
};
