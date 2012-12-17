var config = {
    detailedErrors: false,
    hostname: "dev.pointgaming.net",
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
