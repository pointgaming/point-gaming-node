var config = {
    detailedErrors: true,
    debug: true,
    hostname: "localhost",
    port: 9999,
    model: {
        defaultAdapter: "riak"
    },
    db: {
        riak: {
            protocol: "http",
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
