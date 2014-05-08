var PointGaming = global.PointGaming,
    redis = require("redis");

PointGaming.redis_client = redis.createClient(PointGaming.config.redis);
