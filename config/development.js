var config = {
    detailedErrors: true,
    debug: true,
    hostname: "localhost",
    api_url: "http://localhost:3000/",
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
