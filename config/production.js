var config = {
    detailedErrors: false,
    hostname: "dev.pointgaming.net",
    api_url: "http://dev.pointgaming.net:3000/",
    port: 4000,
    model: {
        defaultAdapter: "riak"
    },
    db: {
        riak: {
            host: "localhost",
            port: 8098
        }
    },
    redis: {
        host: "localhost",
        port: 6379
    },
    sessions: {
        store: "redis",
        key: "sid",
        expiry: 14 * 24 * 60 * 60,

        server: {
            host: "localhost",
            port: 6379
        }
    }
};

module.exports = config;
