var PointGaming = global.PointGaming,
    amqp  = require('amqp');

PointGaming.amqp_conn = amqp.createConnection();
