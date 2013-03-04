var PointGaming = global.PointGaming,
    amqp  = require('amqp');

PointGaming.amqp_conn = amqp.createConnection();

PointGaming.amqp_conn.USER_EXCHANGE_PREFIX = 'u.';
PointGaming.amqp_conn.CHAT_EXCHANGE_PREFIX = 'c.';

// This function will first create the exchange with default settings (to prevent 
// errors from sending a message to a non-existing exchange). Then it will deliver 
// the message to the exchange. After that, it will destroy the exchange and call 
// the callback (if supplied).
PointGaming.amqp_conn.sendMessageToFanoutExchange = function(exchange_name, message, callback){
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
